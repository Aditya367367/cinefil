import { useEffect, useState } from "react";
import {
  Shield, CheckCircle, XCircle, FileText, User,
  CreditCard, Film, ArrowRight, AlertCircle, RefreshCw, FileCheck, Mail, MessageSquare
} from "lucide-react";
import { memberService } from "../../../services/memberService";
import { useAuth } from "../../../context/AuthContext";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { API_ROOT } from "../../../services/api";

interface ApplicationDocument {
  id: number;
  document_type: string;
  file_name: string;
  file: string;
  uploaded_at: string;
}

interface Application {
  id: number;
  status: string;
  applicant_name: string;
  applicant_email: string;
  mobile_number: string;
  pan_number?: string;
  company_name?: string;
  registered_address?: string;
  city?: string;
  state?: string;
  country?: string;
  pin_code?: string;
  account_holder_name?: string;
  bank_name?: string;
  branch_name?: string;
  account_number?: string;
  ifsc_code?: string;
  pan_card?: string;
  board_resolution?: string;
  passport_photo?: string;
  passport_photo_2?: string;
  membership_categories?: string[];
  applicant_types?: string[];
  other_applicant_type?: string;
  declare_lawful_owner?: boolean;
  authorize_cinefil?: boolean;
  agree_to_abide?: boolean;
  agreement_accepted?: boolean;
  digital_signature?: string;
  signature_place?: string;
  signature_date?: string;
  payment_receipt?: string;
  payment_amount?: string;
  payment_currency?: string;
  payment_status?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  documents?: ApplicationDocument[];
  submitted_film_data?: any[];
  application_date: string;
  membership_type_name?: string;
  agreement_signing_option?: string;
  agreement_signed_document?: string;
  status_history?: any[];
  latest_remarks?: string;
}

export function OfficerDashboardPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sectionReviews, setSectionReviews] = useState<Record<string, string>>({});
  const [sendReviewLoading, setSendReviewLoading] = useState(false);
  const [mobileTab, setMobileTab] = useState<'queue' | 'detail'>('queue');

  useEffect(() => {
    setSectionReviews({});
  }, [selectedApp?.id]);

  const handleReviewChange = (section: string, value: string) => {
    setSectionReviews(prev => ({
      ...prev,
      [section]: value
    }));
  };

  const handleSendReview = async (recipientType: 'user' | 'ceo') => {
    if (!selectedApp) return;
    setSendReviewLoading(true);
    setErrorMsg("");
    try {
      const res = await memberService.sendExecutiveReview(selectedApp.id, recipientType, sectionReviews);
      if (res.success) {
        showSnackbar(`Review comments successfully sent to ${recipientType === 'user' ? 'applicant' : 'CEO'}.`, "success");
      } else {
        setErrorMsg(res.error || "Failed to send review comments.");
      }
    } catch (e: any) {
      const msg = e.response?.data?.error || "Error sending review comments.";
      setErrorMsg(msg);
    } finally {
      setSendReviewLoading(false);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await memberService.getOfficerApplications();
      if (res.success) {
        const primeApps = (res.applications || []).filter((a: Application) => a.status !== 'associate_member');
        setApplications(primeApps);
        if (primeApps.length > 0) {
          // Keep currently selected app if it still exists in the refreshed list
          setSelectedApp(prev => prev ? (primeApps.find((a: Application) => a.id === prev.id) || primeApps[0]) : primeApps[0]);
        } else {
          setSelectedApp(null);
        }
      }
    } catch (e) {
      showSnackbar("Failed to fetch applications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusUpdate = async (status: string) => {
    if (!selectedApp) return;
    setActionLoading(true);
    setErrorMsg("");
    try {
      const res = await memberService.updateApplicationStatus(selectedApp.id, status, remarks);
      if (res.success) {
        showSnackbar(`Application status updated successfully.`, "success");
        setRemarks("");
        fetchApplications();
      } else {
        setErrorMsg(res.error || "Failed to update status");
      }
    } catch (e: any) {
      const msg = e.response?.data?.error || "Error occurred while updating status.";
      setErrorMsg(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleLabel = () => {
    if (user?.is_ceo_authorised_officer || user?.role === 'ceo') return "CEO / Authorised Officer";
    if (user?.is_legal_officer || user?.role === 'legal_officer') return "Legal Officer";
    if (user?.is_rights_verification_officer || user?.role === 'rights_verification_officer') return "Rights Verification Officer";
    if (user?.is_membership_executive || user?.role === 'membership_executive') return "Membership Executive";
    if (user?.is_membership_committee_member || user?.role === 'membership_committee') return "Membership Committee Member";
    return "Officer";
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "submitted": return "bg-blue-50 text-blue-700 border-blue-200";
      case "kyc_under_review": return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "documents_pending": return "bg-amber-50 text-amber-700 border-amber-200";
      case "ownership_verification": return "bg-orange-50 text-orange-700 border-orange-200";
      case "legal_scrutiny": return "bg-purple-50 text-purple-700 border-purple-200";
      case "ceo_review": return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "membership_committee_review": return "bg-pink-50 text-pink-700 border-pink-200";
      case "approved": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected": return "bg-rose-50 text-rose-700 border-rose-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getFilmDocument = (app: Application, index: number, docType: string) => {
    if (!app.documents) return null;
    return app.documents.find(d => d.document_type === `film_${index}_${docType}`);
  };

  const renderFieldValue = (label: string, value: any, isBoolean: boolean = false) => {
    return (
      <div className="border-b border-slate-100 pb-2 last:border-0 last:pb-0">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-sm font-medium text-slate-900">
          {isBoolean ? (value ? "Yes" : "No") : (value || "N/A")}
        </p>
      </div>
    );
  };
  
  const getFullUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const baseUrl = API_ROOT.replace('/api/v1', '');
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };
  
  const renderDocumentLink = (label: string, fileUrl?: string) => {
    const absoluteUrl = getFullUrl(fileUrl);
    return (
      <div className="flex flex-col p-3 rounded bg-slate-50 border border-slate-200 h-full">
        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">{label}</span>
        {absoluteUrl ? (
          <a
            href={absoluteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors mt-auto"
          >
            <FileCheck size={14} /> View File
          </a>
        ) : (
          <span className="text-xs font-semibold text-rose-500 flex items-center gap-1 mt-auto">
            <XCircle size={14} /> Not Provided
          </span>
        )}
      </div>
    );
  };

  const renderSectionReviewInput = (sectionName: string) => {
    if (!(user?.is_membership_executive || user?.role === 'membership_executive')) return null;
    return (
      <div className="p-6 pt-0 border-t border-slate-100 mt-4">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
          Section Review Comment
        </label>
        <textarea
          value={sectionReviews[sectionName] || ""}
          onChange={(e) => handleReviewChange(sectionName, e.target.value)}
          placeholder={`Write review comments for ${sectionName}...`}
          className="w-full text-xs rounded border border-slate-200 bg-slate-50 p-3 text-slate-800 focus:bg-white focus:border-indigo-500 transition-all outline-none"
          rows={2}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header Banner */}
      <header className="border-b border-slate-200 bg-white px-8 py-5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded bg-amber-50 border border-amber-200 p-2 text-amber-600">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-wide uppercase">Officer Workflow Console</h1>
            <p className="text-xs text-slate-500 font-medium">Role: <span className="text-indigo-600 font-bold">{getRoleLabel()}</span></p>
          </div>
        </div>
        <button
          onClick={fetchApplications}
          className="flex items-center gap-2 rounded bg-white hover:bg-slate-50 px-4 py-2 text-xs font-bold border border-slate-200 shadow-sm active:scale-95 transition-all text-slate-700"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-indigo-600" : "text-slate-400"} />
          Refresh Inbox
        </button>
      </header>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden flex border-b border-slate-200 bg-white">
        <button
          onClick={() => setMobileTab('queue')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider text-center border-b-2 transition-all ${
            mobileTab === 'queue' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Inbox Queue ({applications.length})
        </button>
        <button
          onClick={() => setMobileTab('detail')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider text-center border-b-2 transition-all ${
            mobileTab === 'detail' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Application Details {selectedApp ? `#${selectedApp.id}` : ''}
        </button>
      </div>

      {/* Main Layout Split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar Queue */}
        <aside className={`w-full lg:w-[350px] border-r border-slate-200 bg-white p-5 flex-col shrink-0 ${
          mobileTab === 'queue' ? 'flex' : 'hidden lg:flex'
        }`}>
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center justify-between">
            Pending Inbox 
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">{applications.length}</span>
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {loading && applications.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                <RefreshCw className="animate-spin mx-auto mb-2 text-indigo-400" size={24} />
                Loading queue...
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm border border-dashed border-slate-200 rounded p-4 bg-slate-50">
                No applications pending for your role at this time.
              </div>
            ) : (
              applications.map((app) => {
                const cardRemark = app.latest_remarks || (Array.isArray(app.status_history) ? app.status_history.find((h: any) => h.remarks)?.remarks : "") || "";

                return (
                  <div
                    key={app.id}
                    onClick={() => { setSelectedApp(app); setErrorMsg(""); setMobileTab('detail'); }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedApp?.id === app.id
                        ? "bg-indigo-50/80 border-indigo-300 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold text-sm text-slate-900 truncate flex-1">{app.applicant_name}</h3>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider shrink-0 ${getStatusBadgeClass(app.status)}`}>
                        {app.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-500 truncate font-medium">{app.applicant_email}</p>

                    {/* Display Remarks in Sidebar */}
                    {cardRemark ? (
                      <div className="mt-2.5 p-2 rounded bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 leading-snug">
                        <div className="flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider text-amber-800 mb-0.5">
                          <MessageSquare size={11} className="text-amber-600 shrink-0" />
                          <span>Remark / Note:</span>
                        </div>
                        <p className="font-medium line-clamp-2 text-slate-800">{cardRemark}</p>
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wider">
                        Submitted: {new Date(app.application_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Details Panel */}
        <main className={`flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50 custom-scrollbar relative ${
          mobileTab === 'detail' ? 'block' : 'hidden lg:block'
        }`}>
          {selectedApp ? (
            <div className="max-w-5xl mx-auto space-y-6 pb-40">
              {/* Top Summary Card */}
              <div className="bg-white border border-slate-200 rounded p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-3 py-1 rounded">
                    {selectedApp.membership_type_name || "Membership Application"}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-3">{selectedApp.applicant_name}</h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium tracking-wide">Application Reference: #{selectedApp.id}</p>
                </div>
                <div className="flex flex-col items-end gap-2 bg-slate-50 p-4 rounded border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Current Step</span>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded border uppercase tracking-widest ${getStatusBadgeClass(selectedApp.status)}`}>
                    {selectedApp.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Error messages */}
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded p-4 text-xs font-semibold flex items-center gap-3 shadow-sm">
                  <AlertCircle size={18} className="shrink-0" />
                  <p>{errorMsg}</p>
                </div>
              )}

              {/* Step 1: Categories & Classification */}
              <div className="bg-white border border-slate-200 rounded shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} className="text-indigo-600" />
                    Step 1: Membership Category
                  </h3>
                </div>
                <div className="p-6 grid gap-6 sm:grid-cols-2">
                  {renderFieldValue("Membership Categories", Array.isArray(selectedApp.membership_categories) ? selectedApp.membership_categories.join(", ") : selectedApp.membership_categories)}
                  {renderFieldValue("Applicant Types", Array.isArray(selectedApp.applicant_types) ? selectedApp.applicant_types.join(", ") : selectedApp.applicant_types)}
                  
                  {Array.isArray(selectedApp.applicant_types) && selectedApp.applicant_types.includes("other") && (
                    <div className="col-span-full">
                      {renderFieldValue("Other Applicant Type (Specified)", selectedApp.other_applicant_type)}
                    </div>
                  )}
                </div>
                {renderSectionReviewInput("Step 1: Membership Category")}
              </div>

              {/* Step 2: Applicant Details */}
              <div className="bg-white border border-slate-200 rounded shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} className="text-indigo-600" />
                    Step 2: Applicant Details
                  </h3>
                </div>
                <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {renderFieldValue("Name of the Applicant", selectedApp.applicant_name)}
                  {renderFieldValue("Company / Firm / Banner", selectedApp.company_name)}
                  {renderFieldValue("Email Address", selectedApp.applicant_email)}
                  {renderFieldValue("Mobile Number", selectedApp.mobile_number)}
                  {renderFieldValue("PAN Number", selectedApp.pan_number)}
                  
                  <div className="col-span-full border-b border-slate-100 pb-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Address</p>
                    <p className="text-sm font-medium text-slate-900 leading-relaxed">
                      {[selectedApp.registered_address, selectedApp.city, selectedApp.state, selectedApp.country, selectedApp.pin_code].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
                {renderSectionReviewInput("Step 2: Applicant Details")}
              </div>

              {/* Step 3: Bank Details */}
              <div className="bg-white border border-slate-200 rounded shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <CreditCard size={14} className="text-indigo-600" />
                    Step 3: Bank Account Details
                  </h3>
                </div>
                <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {renderFieldValue("Account Holder Name", selectedApp.account_holder_name)}
                  {renderFieldValue("Bank Name", selectedApp.bank_name)}
                  {renderFieldValue("Branch Name", selectedApp.branch_name)}
                  {renderFieldValue("Account Number", selectedApp.account_number)}
                  {renderFieldValue("IFSC Code", selectedApp.ifsc_code)}
                </div>
                {renderSectionReviewInput("Step 3: Bank Account Details")}
              </div>
              
              {/* Step 4: KYC Documents */}
              <div className="bg-white border border-slate-200 rounded shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} className="text-indigo-600" />
                    Step 4: KYC Documents
                  </h3>
                </div>
                <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {renderDocumentLink("PAN Card", selectedApp.pan_card)}
                  {renderDocumentLink("Authority Letter / Board Resolution", selectedApp.board_resolution)}
                  {renderDocumentLink("Passport Photograph 1", selectedApp.passport_photo)}
                  {renderDocumentLink("Passport Photograph 2", selectedApp.passport_photo_2)}
                </div>
                {renderSectionReviewInput("Step 4: KYC Documents")}
              </div>

              {/* Step 5: Film Details */}
              <div className="bg-white border border-slate-200 rounded shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <Film size={14} className="text-indigo-600" />
                    Step 5: Repertoire Details
                  </h3>
                  <span className="bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    {selectedApp.submitted_film_data?.length || 0} FILMS
                  </span>
                </div>
                
                {selectedApp.submitted_film_data && selectedApp.submitted_film_data.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {selectedApp.submitted_film_data.map((f: any, idx: number) => {
                      const dbFilm = selectedApp.films?.[idx] || selectedApp.films?.find((df: any) => df.title?.toLowerCase() === (f.title?.label || f.title?.value || f.title || "").toLowerCase());
                      const censorDoc = getFilmDocument(selectedApp, idx, 'censor_certificate');
                      const censorDocUrl = censorDoc?.file || f.censor_certificate_url || dbFilm?.documents?.find((d: any) => d.document_type?.toLowerCase().includes('censor'))?.file_url || dbFilm?.documents?.find((d: any) => d.document_type?.toLowerCase().includes('censor'))?.file;
                      const censorNo = f.censor_certificate_no || dbFilm?.censor_certificate_no;

                      return (
                        <div key={idx} className="p-6">
                          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                            <div>
                              <h4 className="font-black text-slate-900 text-base">{f.title?.label || f.title?.value || f.title || f.film_id || `Untitled Film #${idx + 1}`}</h4>
                              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                                {f.release_year || f.year || (f.release_date ? f.release_date.split('-')[0] : "Unknown Year")} • {f.language || "Unknown Language"}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {f.ownership_type && Array.isArray(f.ownership_type) && f.ownership_type.map((t: string) => (
                                <span key={t} className="bg-slate-100 border border-slate-200 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid gap-4 sm:grid-cols-2 text-sm mb-4">
                            <div>
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Release Date</span>
                              <span className="font-medium text-slate-800">{f.release_date || dbFilm?.release_date || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Censor Certificate Number</span>
                              <span className="font-medium text-slate-800 font-mono">{censorNo || "N/A"}</span>
                            </div>
                            <div className="col-span-full">
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Star Cast</span>
                              <span className="font-medium text-slate-800">
                                {Array.isArray(f.cast) ? f.cast.map((c:any) => c.label || c.value || c).join(", ") : (f.cast || "N/A")}
                              </span>
                            </div>
                            <div className="col-span-full">
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Remarks</span>
                              <span className="font-medium text-slate-800">{f.remarks || dbFilm?.remarks || "—"}</span>
                            </div>
                          </div>

                          {/* Film Documents */}
                          <div className="mt-4">
                            <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Film Documents</h5>
                            <div className="grid gap-3 sm:grid-cols-3">
                               {renderDocumentLink("Censor Certificate", censorDocUrl)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm font-medium text-slate-500">
                    No films submitted in this application.
                  </div>
                )}
                {renderSectionReviewInput("Step 5: Repertoire Details")}
              </div>

              {/* Step 6: Declaration */}
              <div className="bg-white border border-slate-200 rounded shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle size={14} className="text-indigo-600" />
                    Step 6: Declaration
                  </h3>
                </div>
                <div className="p-6 grid gap-6 sm:grid-cols-3">
                  {renderFieldValue("Declared Lawful Owner", selectedApp.declare_lawful_owner, true)}
                  {renderFieldValue("Authorized Cinefil", selectedApp.authorize_cinefil, true)}
                  {renderFieldValue("Agreed to Rules & Regulations", selectedApp.agree_to_abide, true)}
                </div>
                {renderSectionReviewInput("Step 6: Declaration")}
              </div>

              {/* Step 7: Agreement */}
              <div className="bg-white border border-slate-200 rounded shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle size={14} className="text-indigo-600" />
                    Step 7: Agreement
                  </h3>
                </div>
                <div className="p-6 grid gap-6 sm:grid-cols-3">
                  {renderFieldValue("Membership Agreement Accepted", selectedApp.agreement_accepted, true)}
                  {renderFieldValue("Digital Signature Name", selectedApp.digital_signature)}
                  {renderFieldValue("Place of Signature", selectedApp.signature_place)}
                  {renderFieldValue("Date of Signature", selectedApp.signature_date)}
                </div>
                {renderSectionReviewInput("Step 7: Agreement")}
              </div>
              
              {/* Step 8: Membership Fee */}
              <div className="bg-white border border-slate-200 rounded shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <CreditCard size={14} className="text-indigo-600" />
                    Step 8: Membership Fee
                  </h3>
                </div>
                <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {renderFieldValue("Payment Status", selectedApp.payment_status)}
                  {renderFieldValue("Amount", selectedApp.payment_amount ? `${selectedApp.payment_currency || 'INR'} ${selectedApp.payment_amount}` : "N/A")}
                  {renderFieldValue("Razorpay Order ID", selectedApp.razorpay_order_id)}
                  {renderFieldValue("Razorpay Payment ID", selectedApp.razorpay_payment_id)}
                </div>
                {renderSectionReviewInput("Step 8: Membership Fee")}
              </div>

              {/* Executive Review Report Summary */}
              {(user?.is_membership_executive || user?.role === 'membership_executive') && (
                <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 bg-indigo-50/50">
                    <h3 className="text-xs font-black text-indigo-900 uppercase tracking-widest flex items-center gap-2">
                      <FileText size={14} className="text-indigo-600" />
                      Executive Review Report Summary
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {Object.entries(sectionReviews).filter(([_, val]) => val.trim() !== "").length === 0 ? (
                      <p className="text-xs font-medium text-slate-500 italic">No review comments written yet. Fill in comments below individual sections.</p>
                    ) : (
                      <div className="space-y-3">
                        {Object.entries(sectionReviews).map(([sec, val]) => {
                          if (!val.trim()) return null;
                          return (
                            <div key={sec} className="bg-slate-50 border border-slate-100 p-3 rounded">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{sec}</span>
                              <p className="text-xs text-slate-700 font-medium whitespace-pre-wrap">{val}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => handleSendReview('user')}
                        disabled={sendReviewLoading || Object.values(sectionReviews).filter(v => v.trim() !== '').length === 0}
                        className="inline-flex items-center gap-2 rounded bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white transition-all disabled:opacity-50 shadow-sm"
                      >
                        <Mail size={14} />
                        Send Review to User via Email
                      </button>
                      <button
                        onClick={() => handleSendReview('ceo')}
                        disabled={sendReviewLoading || Object.values(sectionReviews).filter(v => v.trim() !== '').length === 0}
                        className="inline-flex items-center gap-2 rounded bg-slate-800 hover:bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition-all disabled:opacity-50 shadow-sm"
                      >
                        <FileText size={14} />
                        Send Report to CEO
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Spacer for fixed bottom bar */}
              <div className="h-20"></div>

              {/* Action Console form - Fixed to bottom */}
              <div className="fixed bottom-0 left-0 lg:left-[350px] right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="w-full md:w-1/2 flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap hidden xl:inline">Action Panel</span>
                  <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter remarks (reason for approval, queries)..."
                    className="w-full rounded border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                  {/* Membership Executive Options */}
                  {(user?.is_membership_executive || user?.role === 'membership_executive') && (
                    <>
                      {['submitted', 'kyc_under_review', 'documents_pending', 'query_raised', 'associate_member'].includes(selectedApp.status) && (
                        <button
                          onClick={() => handleStatusUpdate("ownership_verification")}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-2 rounded bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white transition-all disabled:opacity-50 shadow-sm"
                        >
                          Approve & Forward
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </>
                  )}

                  {/* Rights Officer Options */}
                  {(user?.is_rights_verification_officer || user?.role === 'rights_verification_officer') && (
                    <>
                      {selectedApp.status === 'ownership_verification' && (
                        <button
                          onClick={() => handleStatusUpdate("legal_scrutiny")}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-2 rounded bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white transition-all disabled:opacity-50 shadow-sm"
                        >
                          Approve & Forward to Legal
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </>
                  )}

                  {/* Legal Officer Options */}
                  {(user?.is_legal_officer || user?.role === 'legal_officer') && (
                    <>
                      {selectedApp.status === 'legal_scrutiny' && (
                        <button
                          onClick={() => handleStatusUpdate("ceo_review")}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-2 rounded bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white transition-all disabled:opacity-50 shadow-sm"
                        >
                          Approve & Forward to CEO
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </>
                  )}

                  {/* CEO Options */}
                  {(user?.is_ceo_authorised_officer || user?.role === 'ceo') && (
                    <>
                      {selectedApp.status === 'ceo_review' && (
                        <button
                          onClick={() => handleStatusUpdate("membership_committee_review")}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-2 rounded bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white transition-all disabled:opacity-50 shadow-sm"
                        >
                          Approve & Forward to Committee
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </>
                  )}

                  {/* Membership Committee Options */}
                  {(user?.is_membership_committee_member || user?.role === 'membership_committee') && (
                    <>
                      {selectedApp.status === 'membership_committee_review' && (
                        <button
                          onClick={() => handleStatusUpdate("approved")}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-2 rounded bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition-all disabled:opacity-50 shadow-sm"
                        >
                          <CheckCircle size={14} />
                          Final Approve
                        </button>
                      )}
                    </>
                  )}
                  
                  {/* Universal Reject / Query */}
                  {['submitted', 'kyc_under_review', 'documents_pending', 'ownership_verification', 'legal_scrutiny', 'ceo_review', 'membership_committee_review', 'associate_member'].includes(selectedApp.status) && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate("query_raised")}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-2 rounded bg-white hover:bg-slate-50 px-4 py-2 text-xs font-bold border border-slate-300 text-amber-600 transition-all disabled:opacity-50 shadow-sm"
                      >
                        Raise Query
                      </button>
                      <button
                        onClick={() => handleStatusUpdate("rejected")}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-2 rounded bg-rose-50 hover:bg-rose-100 px-4 py-2 text-xs font-bold border border-rose-200 text-rose-700 transition-all disabled:opacity-50 shadow-sm"
                      >
                        <XCircle size={14} />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Shield className="mb-4 text-slate-300" size={48} strokeWidth={1} />
              <p className="text-sm font-medium">Select an application from the inbox list to inspect details.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
