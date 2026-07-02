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
  } = useMembershipForm();

  const { showSnackbar } = useSnackbar();

  // Payment status state
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "submitting_form" | "creating_order" | "checkout_opened" | "verifying_payment" | "success" | "failed"
  >("idle");
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

  const isAlreadyPaid = applications?.some((app: any) => 
    (app.status === 'paid_no_receipt' || app.payment_status === 'successful' || app.payment_status === 'captured') && 
    (app.id === applicationId || !applicationId)
  );

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
              showSnackbar("Payment verified successfully! Please download and upload the receipt to submit.", "success");
              setPaymentStatus("success");
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
        showSnackbar("Sandbox Payment simulation successful! Please download and upload the receipt to submit.", "success");
        setPaymentStatus("success");
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
        <h3 className="mf-step__title">Membership Fee</h3>
        <p className="mf-step__subtitle">Review your fees and complete the payment process.</p>
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
        {paymentStatus === "success" || isAlreadyPaid ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", padding: "16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#15803d", fontWeight: 700 }}>
              <Check size={20} />
              <span>{isAlreadyPaid ? "Already Paid!" : "Online Payment Successful!"}</span>
            </div>
            <button
              type="button"
              onClick={downloadReceipt}
              className="mf-pay-btn"
              style={{ backgroundColor: "#16a34a", color: "white", width: "auto", padding: "10px 20px" }}
            >
              <Download size={18} />
              Download Receipt
            </button>
            <p style={{ fontSize: "12px", color: "#166534", textAlign: "center", marginTop: "4px", maxWidth: "400px" }}>
              Please upload this downloaded receipt file in the section below and click "Submit Application" to finalize.
            </p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      <hr className="mf-divider" />

      {/* Upload receipt */}
      <div>
        <label className="mf-label">
          Or Upload Payment Receipt <span className="mf-label__hint">(for bank transfers / offline payment)</span>
        </label>
        <input
          type="file"
          id="payment-receipt"
          className="mf-hidden-input"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setPaymentReceipt(e.target.files?.[0] || null)}
        />
        <label htmlFor="payment-receipt" className={`mf-upload ${paymentReceipt ? "mf-upload--has-file" : ""}`}>
          {paymentReceipt ? (
            <>
              <Check size={18} style={{ color: "#059669" }} />
              <span className="mf-upload__filename">{paymentReceipt.name}</span>
            </>
          ) : existingPaymentReceiptUrl ? (
            <>
              <Check size={18} style={{ color: "#059669" }} />
              <span className="mf-upload__filename">Existing Receipt Uploaded</span>
              <a href={getBackendFileUrl(existingPaymentReceiptUrl)} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#183858', textDecoration: 'underline' }} onClick={(e) => e.stopPropagation()}>
                View Receipt
              </a>
            </>
          ) : (
            <>
              <Upload size={20} className="mf-upload__icon" />
              <span className="mf-upload__text">Click to upload payment receipt</span>
              <span className="mf-upload__hint">PDF, JPG, or PNG</span>
            </>
          )}
        </label>
        {existingPaymentReceiptUrl && !paymentReceipt && (
           <p style={{fontSize: '12px', color: '#64748b', marginTop: '6px', textAlign: 'center'}}>
             You have already uploaded a receipt. Uploading a new one will replace it.
           </p>
        )}
      </div>

      <div className="mf-actions">
        <button type="button" onClick={prevStep} className="mf-btn mf-btn--prev">
          <ChevronLeft size={16} /> Back
        </button>
        <button
          type="submit"
          disabled={submitting || !( (isAlreadyPaid || paymentStatus === "success") && (paymentReceipt || existingPaymentReceiptUrl) )}
          className="mf-btn mf-btn--submit"
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </div>
  );
}
