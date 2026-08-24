import React, { useState } from "react";
import { ChevronLeft, Upload, CreditCard, Check, Loader2, AlertCircle, Download } from "lucide-react";
import { useMembershipForm } from "../context/MembershipFormContext";
import { useSnackbar } from "../../../../contexts/SnackbarContext";
import { memberService } from "../../../../../services/memberService";
import { getBackendFileUrl } from "../../../../../utils/fileUrl";


export function StepMembershipFee() {
  const {
    isAuthenticated,
    selectedMembershipType,
    membershipCategories,
    paymentReceipt,
    setPaymentReceipt,
    existingPaymentReceiptUrl,
    applicationId,
    setApplicationId,
    submitting,
    prevStep,
    applicantName,
    applicantEmail,
    mobileNumber,
    buildApplicationFormData,
    resetFormState,
    setShowCongratulations,
    membershipTypes,
    applications,
    setApplications,
  } = useMembershipForm();

  const { showSnackbar } = useSnackbar();

  // Payment status state
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "submitting_form" | "submitting_without_payment" | "creating_order" | "checkout_opened" | "verifying_payment" | "success" | "failed"
  >("idle");
  const [completedApplication, setCompletedApplication] = useState<any>(null);
  const [showMockModal, setShowMockModal] = useState(false);
  const [mockOrderDetails, setMockOrderDetails] = useState<any>(null);

  const membershipTypeName = isAuthenticated
    ? selectedMembershipType?.membership_name || "Member"
    : membershipCategories.includes("producer_member") ? "Producer" : "Other Member";

  // Fee variables (fetched from selected membership type if available, else defaults)
  const parseFee = (fee: any) => {
    if (typeof fee === "number") return fee;
    if (typeof fee === "string") {
      const parsed = parseFloat(fee);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // If the user is authenticated, use their selected/existing type.
  // Otherwise, match based on the category they chose in Step 1.
  const isProducer = membershipCategories.includes("producer_member");
  const matchedType = membershipTypes.find((t: any) =>
    isProducer ? t.membership_name.toLowerCase().includes("producer") : t.membership_name.toLowerCase().includes("other")
  );

  const activeType = (isAuthenticated && selectedMembershipType) ? selectedMembershipType : matchedType;

  const joiningFeeAmount = activeType ? parseFee(activeType.joining_fee) : 5000;
  const annualFeeAmount = activeType ? parseFee(activeType.annual_fee) : 5000;
  const totalFee = joiningFeeAmount + annualFeeAmount;

  const currentApp = completedApplication || applications?.find((app: any) =>
    app.status === 'associate_member' || (applicationId && app.id === Number(applicationId))
  );

  const isMembershipComplete = !!(currentApp && (
    currentApp.status === 'associate_member' ||
    currentApp.status === 'paid_no_receipt' ||
    currentApp.payment_status === 'successful' ||
    currentApp.payment_status === 'captured'
  ));
  const isUnpaid = currentApp?.is_paid === false;

  // Helper to load Razorpay SDK dynamically
  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    try {
      setPaymentStatus("submitting_form");
      // 1. Submit form first to get application ID
      const formData = buildApplicationFormData();
      const appRes = await memberService.submitApplication(formData);

      if (!appRes.success) {
        throw new Error(appRes.error || "Failed to submit application.");
      }

      const applicationId = appRes.application.id;
      setApplicationId(applicationId);

      // 2. Create Razorpay order on backend
      setPaymentStatus("creating_order");
      const orderRes = await memberService.createRazorpayOrder(applicationId);

      if (!orderRes.success) {
        throw new Error(orderRes.error || "Failed to create Razorpay order.");
      }

      // 3. Check if mock/fallback sandbox is active
      if (orderRes.is_mock) {
        setMockOrderDetails({
          order_id: orderRes.order_id,
          amount: orderRes.amount,
          currency: orderRes.currency,
          application_id: applicationId,
        });
        setShowMockModal(true);
        setPaymentStatus("checkout_opened");
        return;
      }

      // 4. Load Razorpay and open checkout
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay payment SDK failed to load. Please verify your connection.");
      }

      const options = {
        key: orderRes.key_id,
        amount: orderRes.amount,
        currency: orderRes.currency,
        name: "Cinefil India",
        description: "Membership Registration Fee",
        order_id: orderRes.order_id,
        handler: async function (response: any) {
          setPaymentStatus("verifying_payment");
          try {
            const verifyRes = await memberService.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              application_id: applicationId,
            });

            if (verifyRes.success) {
              showSnackbar("Payment verified successfully! Registered as Associate Member.", "success");
              setPaymentStatus("success");
              if (verifyRes.application) {
                setCompletedApplication(verifyRes.application);
                setApplications((prev: any[]) => {
                  const filtered = prev.filter(app => app.id !== verifyRes.application.id);
                  return [...filtered, verifyRes.application];
                });
              }
              setShowCongratulations(true);
            } else {
              throw new Error(verifyRes.error || "Signature verification failed.");
            }
          } catch (err: any) {
            console.error(err);
            showSnackbar(err.message || "Payment verification failed.", "error");
            setPaymentStatus("failed");
          }
        },
        prefill: {
          name: applicantName,
          email: applicantEmail,
          contact: mobileNumber,
        },
        theme: {
          color: "#183858", // Cinefil Navy
        },
        modal: {
          ondismiss: function () {
            setPaymentStatus("failed");
            showSnackbar("Payment process cancelled by user.", "info");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      setPaymentStatus("checkout_opened");

    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.error || error.message || "An error occurred during payment setup.";
      showSnackbar(errMsg, "error");
      setPaymentStatus("failed");
    }
  };

  const handleSubmitWithoutPayment = async () => {
    try {
      setPaymentStatus("submitting_without_payment");
      const formData = buildApplicationFormData(true);
      formData.append('submit_without_payment', 'true');

      // Use the full submission endpoint even for an existing draft. It handles
      // submitted film data and film documents before activating membership.
      const response = await memberService.submitApplication(formData);

      if (!response.success) {
        throw new Error(response.error || "Unable to submit the application without payment.");
      }

      const application = response.application;
      setApplicationId(String(application.id));
      setCompletedApplication(application);
      setApplications((previous: any[]) => [
        ...previous.filter((item) => item.id !== application.id),
        application,
      ]);
      setPaymentStatus("success");
      setShowCongratulations(true);
      showSnackbar("Associate membership activated. Your payment is marked as unpaid.", "success");
    } catch (error: any) {
      console.error(error);
      showSnackbar(error.response?.data?.error || error.message || "Unable to submit the application.", "error");
      setPaymentStatus("failed");
    }
  };

  const downloadReceipt = () => {
    showSnackbar("Generating PDF receipt...", "info");
    const receiptHtml = `
      <div style="font-family: Arial, sans-serif; padding: 40px; color: #333;">
        <div style="text-align: center; border-bottom: 2px solid #183858; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #183858; margin: 0;">CINEFIL INDIA</h1>
          <h2 style="color: #666; margin: 5px 0 0 0;">PAYMENT RECEIPT</h2>
        </div>
        <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse;">
          <tr><td style="padding: 10px 0; font-weight: bold; width: 40%;">Receipt Number:</td><td style="padding: 10px 0;">RCP-${Date.now()}</td></tr>
          <tr><td style="padding: 10px 0; font-weight: bold;">Applicant Name:</td><td style="padding: 10px 0;">${applicantName}</td></tr>
          <tr><td style="padding: 10px 0; font-weight: bold;">Applicant Email:</td><td style="padding: 10px 0;">${applicantEmail}</td></tr>
          <tr><td style="padding: 10px 0; font-weight: bold;">Mobile Number:</td><td style="padding: 10px 0;">${mobileNumber}</td></tr>
          <tr><td style="padding: 10px 0; font-weight: bold;">Membership Type:</td><td style="padding: 10px 0;">${membershipTypeName}</td></tr>
          <tr style="border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; font-size: 1.2em;">
            <td style="padding: 15px 0; font-weight: bold;">Amount Paid:</td>
            <td style="padding: 15px 0; font-weight: bold; color: #183858;">INR ${totalFee.toLocaleString()}</td>
          </tr>
          <tr><td style="padding: 10px 0; font-weight: bold;">Status:</td><td style="padding: 10px 0; color: green; font-weight: bold;">SUCCESSFUL</td></tr>
          <tr><td style="padding: 10px 0; font-weight: bold;">Payment Gateway:</td><td style="padding: 10px 0;">Razorpay</td></tr>
        </table>
        <div style="text-align: center; margin-top: 40px; font-size: 0.9em; color: #666;">
          <p>Thank you for your payment.</p>
          <p>Please upload this receipt in the membership form to complete your application.</p>
        </div>
      </div>
    `;

    const wrapper = document.createElement("div");
    wrapper.style.position = 'fixed';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
    wrapper.style.zIndex = '-9999';
    wrapper.style.pointerEvents = 'none';
    wrapper.style.width = '800px';

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = receiptHtml;
    tempDiv.style.backgroundColor = '#ffffff'; // Ensure white background
    tempDiv.style.width = '800px';
    tempDiv.style.boxSizing = 'border-box';
    tempDiv.style.padding = '40px';

    wrapper.appendChild(tempDiv);
    document.body.appendChild(wrapper);

    // If html2pdf is already loaded
    if ((window as any).html2pdf) {
      generateAndDownloadPDF(tempDiv, wrapper);
    } else {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.onload = () => generateAndDownloadPDF(tempDiv, wrapper);
      document.head.appendChild(script);
    }
  };

  const generateAndDownloadPDF = (element: HTMLElement, wrapperElement: HTMLElement) => {
    const opt = {
      margin: 0.5,
      filename: `Cinefil_Receipt_${applicantName.replace(/\s+/g, "_")}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    (window as any).html2pdf().set(opt).from(element).save().then(() => {
      document.body.removeChild(wrapperElement);
      showSnackbar("Receipt downloaded successfully as PDF!", "success");
    });
  };

  const handleApproveMockPayment = async () => {
    if (!mockOrderDetails) return;
    setShowMockModal(false);
    setPaymentStatus("verifying_payment");
    try {
      const verifyRes = await memberService.verifyRazorpayPayment({
        razorpay_order_id: mockOrderDetails.order_id,
        razorpay_payment_id: "pay_mock_" + Math.random().toString(36).substring(7),
        razorpay_signature: "mock_signature",
        application_id: mockOrderDetails.application_id,
      });

      if (verifyRes.success) {
        showSnackbar("Sandbox Payment simulation successful! Registered as Associate Member.", "success");
        setPaymentStatus("success");
        if (verifyRes.application) {
          setApplications((prev: any[]) => {
            const filtered = prev.filter(app => app.id !== verifyRes.application.id);
            return [...filtered, verifyRes.application];
          });
        }
        setShowCongratulations(true);
      } else {
        throw new Error(verifyRes.error || "Sandbox signature verification failed.");
      }
    } catch (err: any) {
      console.error(err);
      showSnackbar(err.message || "Sandbox payment verification failed.", "error");
      setPaymentStatus("failed");
    }
  };

  const handleCancelMockPayment = () => {
    setShowMockModal(false);
    setPaymentStatus("failed");
    showSnackbar("Sandbox Payment simulation cancelled.", "info");
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case "submitting_form":
        return "Saving application details...";
      case "submitting_without_payment":
        return "Activating associate membership without payment...";
      case "creating_order":
        return "Initializing transaction gateway...";
      case "checkout_opened":
        return "Waiting for payment...";
      case "verifying_payment":
        return "Verifying signature and completing enrollment...";
      default:
        return "";
    }
  };

  const [upgrading, setUpgrading] = useState(false);

  const handleUpgradeToPrime = async () => {
    setUpgrading(true);
    try {
      const res = await memberService.upgradeToPrime();
      if (res.success) {
        showSnackbar("Successfully upgraded to Prime Membership!", "success");
        window.location.href = "/member-dashboard";
      } else {
        showSnackbar(res.error || "Failed to upgrade to Prime.", "error");
      }
    } catch (err: any) {
      console.error(err);
      showSnackbar("An error occurred during upgrade. Please try again.", "error");
    } finally {
      setUpgrading(false);
    }
  };

  if (isMembershipComplete || paymentStatus === "success") {
    const membershipNumber = currentApp?.membership_number || "AM-Pending";
    return (
      <div className="mf-step" style={{ animation: "fadeIn 0.5s ease" }}>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: "24px" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#22c55e", opacity: 0.15, transform: "scale(1.2)", animation: "pulse 2s infinite" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "80px", height: "80px", borderRadius: "50%", background: "#22c55e", color: "white", boxShadow: "0 10px 15px -3px rgba(34, 197, 94, 0.4)", margin: "0 auto" }}>
              <Check size={40} style={{ margin: "0 auto" }} />
            </div>
          </div>

          <h3 className="mf-step__title" style={{ fontSize: "24px", color: "#1e293b", marginBottom: "8px", fontWeight: 800 }}>
            Registration Successful!
          </h3>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
            {isUnpaid
              ? "Your associate membership is active. Payment is currently marked as unpaid."
              : "Your payment has been verified and your associate membership is now active."}
          </p>

          {isUnpaid && (
            <div style={{ maxWidth: "600px", margin: "0 auto 24px", padding: "14px 16px", borderRadius: "10px", background: "#fff7ed", border: "1px solid #fdba74", color: "#9a3412", fontSize: "13px", fontWeight: 600 }}>
              Payment status: Unpaid. You retain Associate Member dashboard access and can request an upgrade to Prime Membership.
            </div>
          )}

          <div style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(12px)",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "24px",
            maxWidth: "500px",
            margin: "0 auto 28px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)"
          }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Allotted Membership Number
            </span>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#183858", marginTop: "4px", letterSpacing: "0.02em" }}>
              {membershipNumber}
            </div>
          </div>

          <div className="mf-info-box mf-info-box--neutral" style={{
            textAlign: "left",
            maxWidth: "600px",
            margin: "0 auto 32px",
            padding: "20px",
            borderRadius: "12px",
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0"
          }}>
            <h4 style={{ fontWeight: 800, fontSize: "14px", color: "#183858", marginBottom: "12px" }}>
              Note - Upgradation to Prime Member
            </h4>
            <p style={{ fontSize: "13px", color: "#334155", lineHeight: "1.6", marginBottom: "12px", fontWeight: 600 }}>
              You have successfully registered as a Cinefil Associate Member. Your membership number is {membershipNumber}. You will not earn royalties until you upgrade to Prime.
            </p>
            <div style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.6", borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}>
              <p style={{ marginBottom: "8px" }}>
                Admission as a Prime Member shall be an internal administrative process of CINEFIL, contingent upon the furnishing of the prescribed supporting documents — including, without limitation, Censor Certificates, Probates, Letters of Administration or other instruments evidencing devolution of title upon legal heirs — as and when required by CINEFIL, and shall at all times remain subject to statutory compliance under the Copyright Act, 1957 read with the Copyright Rules, 2013, as amended from time to time, and such other applicable laws, as the case may be; defects, if any, shall be auto-flagged for internal scrutiny by CINEFIL.
              </p>
              <p>
                Entitlement to the quarterly distribution of royalties, as provided under the Copyright Rules, 2013, shall accrue only upon admission as a Prime Member and upon due completion of the statutory compliance and verification process prescribed thereunder.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", maxWidth: "600px", margin: "0 auto" }}>
            {/* <button
              type="button"
              onClick={downloadReceipt}
              className="mf-btn mf-btn--prev"
              style={{ padding: "12px 24px", display: "inline-flex", alignItems: "center", gap: "8px", border: "1px solid #cbd5e1" }}
            >
              <Download size={18} />
              Download Receipt
            </button> */}

            {isAuthenticated ? (
              <>
                {/* <button
                  type="button"
                  disabled={upgrading}
                  onClick={handleUpgradeToPrime}
                  className="mf-btn"
                  style={{
                    padding: "12px 24px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "var(--color-gold)",
                    color: "var(--color-navy)",
                    fontWeight: 700,
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    boxShadow: "0 4px 6px -1px rgba(212, 163, 89, 0.2)"
                  }}
                >
                  {upgrading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Upgrading...
                    </>
                  ) : (
                    "Upgrade to Prime"
                  )}
                </button> */}
                <button
                  type="button"
                  onClick={() => window.location.href = "/member-dashboard"}
                  className="mf-btn"
                  style={{
                    padding: "12px 24px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "#183858",
                    color: "white",
                    fontWeight: 700,
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  Go to Dashboard
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => window.location.href = "/login"}
                className="mf-btn"
                style={{
                  padding: "12px 24px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#183858",
                  color: "white",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Go to Login / Dashboard
              </button>
            )}
          </div>

          {!isAuthenticated && (
            <p style={{ fontSize: "12px", color: "#64748b", marginTop: "16px" }}>
              Please check your registered email for your account login credentials to access your dashboard and manage your films.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mf-step">
      {/* Loading Overlay */}
      {paymentStatus !== "idle" && paymentStatus !== "failed" && paymentStatus !== "success" && (
        <div className="mf-loading-overlay">
          <div className="mf-loading-overlay__content">
            <Loader2 className="mf-spin" size={44} style={{ color: "var(--color-gold)" }} />
            <p className="mf-loading-overlay__text">{getStatusText()}</p>
          </div>
        </div>
      )}

      {/* Mock Sandbox Modal */}
      {showMockModal && mockOrderDetails && (
        <div className="mf-mock-modal-overlay">
          <div className="mf-mock-modal">
            <div className="mf-mock-modal__header">
              <AlertCircle size={24} style={{ color: "var(--color-gold)" }} />
              <h4>Cinefil Sandbox Payment Gateway</h4>
            </div>
            <div className="mf-mock-modal__body">
              <p>No active Razorpay credentials found. Simulating secure checkout sandbox.</p>
              <div className="mf-mock-modal__details">
                <div><strong>Order ID:</strong> <span>{mockOrderDetails.order_id}</span></div>
                <div><strong>Amount:</strong> <span>₹{(mockOrderDetails.amount / 100).toLocaleString()}</span></div>
                <div><strong>Currency:</strong> <span>{mockOrderDetails.currency}</span></div>
              </div>
            </div>
            <div className="mf-mock-modal__footer">
              <button type="button" className="mf-mock-btn mf-mock-btn--cancel" onClick={handleCancelMockPayment}>
                Cancel
              </button>
              <button type="button" className="mf-mock-btn mf-mock-btn--approve" onClick={handleApproveMockPayment}>
                Approve Payment
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mf-step__header">
        <h3 className="mf-step__title flex items-center gap-2">
          Membership Fee
          <abbr title="Pay the required membership fee to complete the application and receive your associate membership number." style={{ cursor: "help", textDecoration: "none" }}>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 text-xs font-bold transition-all">i</span>
          </abbr>
        </h3>
        <p className="mf-step__subtitle">Review your fees and complete the payment process.</p>
      </div>

      <div className="mf-info-box mf-info-box--neutral" style={{ marginBottom: "20px", padding: "16px", borderRadius: "8px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
        <h4 style={{ fontWeight: 700, fontSize: "14px", color: "#183858", marginBottom: "8px" }}>Workflow & Membership Issuance:</h4>
        <ul style={{ listStyleType: "disc", paddingLeft: "20px", fontSize: "13px", color: "#475569", lineHeight: "1.6" }}>
          <li>Submit the application through the website.</li>
          <li>On submission, your Associate Membership Number will be allotted automatically — you are now an Associate Member of CINEFIL.</li>
          <li>On realisation of the fee, your membership becomes active.</li>
        </ul>
      </div>

      {/* Fee summary */}
      <div className="mf-fee-card">
        <div style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid var(--mf-border)" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.03em" }}>Selected Category</span>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", marginTop: "2px" }}>{membershipTypeName}</p>
        </div>
        <div className="mf-fee-row">
          <span className="mf-fee-row__label">Joining Fees</span>
          <span className="mf-fee-row__value">₹{joiningFeeAmount.toLocaleString()}</span>
        </div>
        <div className="mf-fee-row">
          <span className="mf-fee-row__label">Annual Fees</span>
          <span className="mf-fee-row__value">₹{annualFeeAmount.toLocaleString()}</span>
        </div>
        <div className="mf-fee-total">
          <span>Total Payable</span>
          <span className="mf-fee-total__value">₹{totalFee.toLocaleString()}</span>
        </div>
      </div>

      <hr className="mf-divider" />

      {/* Payment gateway */}
      <div>
        <span className="mf-section-label">Online Payment</span>
        <button
          type="button"
          onClick={handleRazorpayPayment}
          disabled={paymentStatus !== "idle" && paymentStatus !== "failed"}
          className="mf-pay-btn"
        >
          <CreditCard size={18} />
          {paymentStatus === "idle" || paymentStatus === "failed" ? "Pay with Razorpay" : "Processing..."}
        </button>
        <p style={{ textAlign: "center", fontSize: "11px", color: "#94a3b8", marginTop: "8px" }}>
          Secure transaction encrypted with Razorpay.
        </p>
      </div>

      <div style={{ marginTop: "16px", textAlign: "center" }}>
        <button
          type="button"
          onClick={handleSubmitWithoutPayment}
          disabled={paymentStatus !== "idle" && paymentStatus !== "failed"}
          className="mf-btn mf-btn--prev"
          style={{ width: "100%" }}
        >
          Submit Without Payment
        </button>
        <p style={{ fontSize: "11px", color: "#9a3412", marginTop: "8px" }}>
          Your Associate Member access will be active, but your payment status will remain unpaid.
        </p>
      </div>

      <div className="mf-actions">
        <button type="button" onClick={prevStep} className="mf-btn mf-btn--prev">
          <ChevronLeft size={16} /> Back
        </button>
      </div>
    </div>
  );
}
