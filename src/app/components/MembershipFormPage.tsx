import { useEffect, useState } from "react";
import { Download, Upload, CheckCircle, PlusCircle, Trash2, ChevronRight, ChevronLeft, Film, User, ShieldCheck } from "lucide-react";
import CreatableSelect from 'react-select/creatable';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { PageBanner } from "./PageBanner";
import { memberService } from "../../services/memberService";
import { useAuth } from "../../context/AuthContext";
import { useCompanySearch, useFilmSearch, useActorSearch } from "../../hooks/useSearch";
import api from "../../services/api";
import { useSnackbar } from "../contexts/SnackbarContext";
import { CongratulationsAnimation } from "./CongratulationsAnimation";
import { handleApiError } from "../../utils/errorHandler";


interface MembershipTypeItem {
  id: number;
  membership_name: string;
  description: string;
}

function FormCard({ title, forType, fields }: {
  title: string;
  forType: string;
  fields: string[];
}) {
  return (
    <div className="flex flex-col">
      <div className="text-center mb-4">
        <p className="text-sm font-semibold mb-1" style={{ color: "var(--cinefil-navy)" }}>{title}</p>
        <button
          onClick={() => alert(`Downloading ${title}`)}
          className="text-xs flex items-center gap-1 mx-auto transition-opacity hover:opacity-70"
          style={{ color: "var(--cinefil-gold)" }}
        >
          <Download size={12} /> Click to Download
        </button>
      </div>

      {/* Form preview card */}
      <div
        className="rounded-sm overflow-hidden border"
        style={{ borderColor: "rgba(0,0,0,0.1)" }}
      >
        {/* Header */}
        <div
          className="py-4 px-5 text-center"
          style={{ background: "linear-gradient(180deg, #000000 0%, #183858 100%)" }}
        >
          <p className="text-white/90 text-xs font-bold tracking-wider uppercase">MEMBERSHIP / AUTHORISATION FORM</p>
          <p
            className="text-sm font-bold mt-1 tracking-wide"
            style={{ color: "var(--cinefil-gold)", fontFamily: "var(--font-display)" }}
          >
            {forType}
          </p>
        </div>

        {/* Form fields preview */}
        <div className="p-5 flex flex-col gap-3" style={{ backgroundColor: "#f9fafb" }}>
          <p
            className="text-[10px] leading-relaxed"
            style={{ color: "var(--cinefil-muted)" }}
          >
            For the registration of CINEFIL by the Central Government u/s 33(3) of Copyright Act 1957 Exclusive
            authorisation given herein, pursuant to Section 34(1)(a) of Chapter VI of Copyright Act 1957 read with
            Chapter XI Copyrights Society of Copyright Act 1957 and transfer of films are not less than 1000 through
            VIDEO thereby which includes Television and Indian, Outdoor Film Industry.
          </p>

          {fields.map((f) => (
            <div key={f}>
              <label className="text-[10px] font-semibold block mb-0.5" style={{ color: "var(--cinefil-navy)" }}>{f}</label>
              <div className="h-7 rounded-sm border bg-white" style={{ borderColor: "rgba(0,0,0,0.12)" }} />
            </div>
          ))}

          {/* Films table */}
          <div className="mt-2">
            <label className="text-[10px] font-semibold block mb-1" style={{ color: "var(--cinefil-navy)" }}>
              Cinematograph Film Work
            </label>
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr style={{ backgroundColor: "var(--cinefil-navy)" }}>
                  {["Title of Cinematograph Film(s)", "Star Cast", "Year", "Language"].map((h) => (
                    <th key={h} className="text-white px-2 py-1.5 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2].map((i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "rgba(0,0,0,0.03)" : "white" }}>
                    {[0, 1, 2, 3].map((j) => (
                      <td key={j} className="border px-2 py-2" style={{ borderColor: "rgba(0,0,0,0.08)" }}>&nbsp;</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signature */}
          <div className="flex justify-between mt-3 pt-3 border-t text-[10px]" style={{ borderColor: "rgba(0,0,0,0.08)", color: "var(--cinefil-muted)" }}>
            <div>
              <p className="font-semibold mb-3" style={{ color: "var(--cinefil-navy)" }}>Signature</p>
              <p>Name :</p>
              <p>Date & Place :</p>
            </div>
            <div className="text-right">
              <p className="font-semibold mb-3" style={{ color: "var(--cinefil-navy)" }}>Authorised Signatory</p>
              <p>for CINEFIL Producers Performance Ltd.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface Film {
  title: SelectOption | null;
  cast: SelectOption[] | null;
  year: string;
  language: string;
}

function FormPreviewCard({
  applicantName,
  companyName,
  address,
  contactNumber,
  applicantEmail,
  membershipTypeName,
  films,
}: {
  applicantName: string;
  companyName: string;
  address: string;
  contactNumber:string;
  applicantEmail: string;
  membershipTypeName: string;
  films: Film[];
}) {
  const forType = membershipTypeName.includes("Producer") ? "FOR PRODUCER" : "FOR OTHER OWNERS / VIDEO PUBLISHERS";

  return (
    <div className="flex flex-col shadow-lg rounded-md overflow-hidden bg-white border border-slate-100 transition-all duration-300">
      <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Live Form Preview</span>
      </div>
      <div
        className="rounded-sm overflow-hidden border"
        style={{ borderColor: "rgba(0,0,0,0.1)" }}
      >
        <div
          className="py-4 px-5 text-center"
          style={{ background: "linear-gradient(180deg, #000000 0%, #183858 100%)" }}
        >
          <p className="text-white/90 text-xs font-bold tracking-wider uppercase">MEMBERSHIP / AUTHORISATION FORM</p>
          <p
            className="text-sm font-bold mt-1 tracking-wide"
            style={{ color: "var(--cinefil-gold)", fontFamily: "var(--font-display)" }}
          >
            {forType}
          </p>
        </div>

        <div className="p-5 flex flex-col gap-3" style={{ backgroundColor: "#f9fafb" }}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <label className="text-[10px] font-semibold block mb-0.5" style={{ color: "var(--cinefil-navy)" }}>Name</label>
              <div className="h-7 rounded-sm border bg-white px-2 py-1 text-xs truncate" style={{ borderColor: "rgba(0,0,0,0.12)" }}>{applicantName || "..."}</div>
            </div>
            <div>
              <label className="text-[10px] font-semibold block mb-0.5" style={{ color: "var(--cinefil-navy)" }}>Email</label>
              <div className="h-7 rounded-sm border bg-white px-2 py-1 text-xs truncate" style={{ borderColor: "rgba(0,0,0,0.12)" }}>{applicantEmail || "..."}</div>
            </div>
            <div>
              <label className="text-[10px] font-semibold block mb-0.5" style={{ color: "var(--cinefil-navy)" }}>Company</label>
              <div className="h-7 rounded-sm border bg-white px-2 py-1 text-xs truncate" style={{ borderColor: "rgba(0,0,0,0.12)" }}>{companyName || "..."}</div>
            </div>
            <div>
              <label className="text-[10px] font-semibold block mb-0.5" style={{ color: "var(--cinefil-navy)" }}>Contact No.</label>
              <div className="h-7 rounded-sm border bg-white px-2 py-1 text-xs truncate" style={{ borderColor: "rgba(0,0,0,0.12)" }}>{contactNumber || "..."}</div>
            </div>
          </div>

          <div className="mt-2">
            <label className="text-[10px] font-semibold block mb-1" style={{ color: "var(--cinefil-navy)" }}>
              Cinematograph Film Work
            </label>
            <div className="max-h-[180px] overflow-y-auto border rounded-sm" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              <table className="w-full text-[10px] border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr style={{ backgroundColor: "var(--cinefil-navy)" }}>
                    {["Title", "Star Cast", "Year", "Language"].map((h) => (
                      <th key={h} className="text-white px-2 py-1.5 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {films.map((film, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="border px-2 py-2 max-w-[80px] truncate" style={{ borderColor: "rgba(0,0,0,0.08)" }}>{film.title?.label || "-"}</td>
                      <td className="border px-2 py-2 max-w-[100px] truncate" style={{ borderColor: "rgba(0,0,0,0.08)" }}>{film.cast?.map(c => c.label).join(', ') || "-"}</td>
                      <td className="border px-2 py-2" style={{ borderColor: "rgba(0,0,0,0.08)" }}>{film.year || "-"}</td>
                      <td className="border px-2 py-2" style={{ borderColor: "rgba(0,0,0,0.08)" }}>{film.language || "-"}</td>
                    </tr>
                  ))}
                  {films.length === 0 && (
                    <tr>
                      <td colSpan={4} className="border px-2 py-4 text-center text-slate-400" style={{ borderColor: "rgba(0,0,0,0.08)" }}>No films added</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) => {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
  const steps = [
    { label: "Personal Info", icon: <User size={14} /> },
    { label: "Membership", icon: <ShieldCheck size={14} /> },
    { label: "Documents", icon: <Upload size={14} /> },
    { label: "Film Details", icon: <Film size={14} /> }
  ];

  return (
    <div className="mb-10 select-none">
      <div className="relative flex justify-between items-center w-full">
        {/* Track Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full z-0" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--cinefil-gold)] rounded-full transition-all duration-500 ease-in-out z-0" 
          style={{ width: `${progress}%` }}
        />

        {/* Steps Indicators */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={step.label} className="relative flex flex-col items-center z-10">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2 font-medium text-xs ${
                  isCompleted 
                    ? 'bg-[var(--cinefil-navy)] border-[var(--cinefil-navy)] text-white' 
                    : isActive 
                      ? 'bg-white border-[var(--cinefil-gold)] text-[var(--cinefil-navy)] scale-110 shadow-md shadow-amber-500/10' 
                      : 'bg-white border-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? <CheckCircle size={14} className="stroke-[3]" /> : step.icon}
              </div>
              <span 
                className={`absolute top-10 whitespace-nowrap text-[11px] tracking-wide transition-all duration-300 font-medium ${
                  isActive ? 'text-slate-900 font-bold' : isCompleted ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-6" /> {/* Spacer for label layout */}
    </div>
  );
};

export function MembershipFormPage() {
  const { isAuthenticated, user } = useAuth();
  const [membershipTypes, setMembershipTypes] = useState<MembershipTypeItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [applicantName, setApplicantName] = useState<string>("");
  const [company, setCompany] = useState<SelectOption | null>(null);
  const [address, setAddress] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [applicantEmail, setApplicantEmail] = useState<string>("");
  const [films, setFilms] = useState<Film[]>([{ title: null, cast: null, year: '', language: '' }]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [minimumLoadingTypes, setMinimumLoadingTypes] = useState(true);
  const [minimumLoadingApplications, setMinimumLoadingApplications] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);

  const { showSnackbar } = useSnackbar();

  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [excelUploaded, setExcelUploaded] = useState(false);

  // Document upload state
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [aadharCard, setAadharCard] = useState<File | null>(null);
  const [panCard, setPanCard] = useState<File | null>(null);
  const [documentErrors, setDocumentErrors] = useState<{ [key: string]: string }>({});

  const { loadOptions: loadCompanyOptions, onCreateOption: onCreateCompany } = useCompanySearch();
  const { loadOptions: loadFilmOptions, onCreateOption: onCreateFilm } = useFilmSearch();
  const { loadOptions: loadActorOptions, onCreateOption: onCreateActor } = useActorSearch();

  // File validation functions
  const validatePhoto = (file: File): string | null => {
    const validFormats = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validFormats.includes(file.type)) {
      return 'Photo must be JPEG, PNG, or PDF format';
    }
    if (file.size > maxSize) {
      return 'Photo must be within 2MB';
    }
    return null;
  };

  const validateDocument = (file: File): string | null => {
    const validFormats = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 4 * 1024 * 1024; // 4MB

    if (!validFormats.includes(file.type)) {
      return 'Document must be JPEG, PNG, or PDF format';
    }
    if (file.size > maxSize) {
      return 'Document must be within 4MB';
    }
    return null;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validatePhoto(file);
      if (error) {
        setDocumentErrors(prev => ({ ...prev, passportPhoto: error }));
        setPassportPhoto(null);
      } else {
        setDocumentErrors(prev => ({ ...prev, passportPhoto: '' }));
        setPassportPhoto(file);
      }
    }
  };

  const handleAadharUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateDocument(file);
      if (error) {
        setDocumentErrors(prev => ({ ...prev, aadharCard: error }));
        setAadharCard(null);
      } else {
        setDocumentErrors(prev => ({ ...prev, aadharCard: '' }));
        setAadharCard(file);
      }
    }
  };

  const handlePanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateDocument(file);
      if (error) {
        setDocumentErrors(prev => ({ ...prev, panCard: error }));
        setPanCard(null);
      } else {
        setDocumentErrors(prev => ({ ...prev, panCard: '' }));
        setPanCard(file);
      }
    }
  };

  const handleCreateCompany = async (inputValue: string) => {
    try {
      const createdCompany = await onCreateCompany(inputValue);
      setCompany(createdCompany);
    } catch (error) {
      console.error('Error creating company:', error);
      // Fallback to local creation if API fails
      setCompany({ value: inputValue, label: inputValue });
    }
  };

  const handleCreateFilm = async (index: number, inputValue: string) => {
    try {
      const createdFilm = await onCreateFilm(inputValue);
      handleFilmChange(index, 'title', createdFilm);
    } catch (error) {
      console.error('Error creating film:', error);
      // Fallback to local creation if API fails
      const newFilm = { value: inputValue, label: inputValue };
      handleFilmChange(index, 'title', newFilm);
    }
  };

  const handleCreateActor = async (index: number, inputValue: string) => {
    try {
      const createdActor = await onCreateActor(inputValue);
      const newFilms = [...films];
      const cast = newFilms[index].cast || [];
      newFilms[index].cast = [...cast, createdActor];
      setFilms(newFilms);
    } catch (error) {
      console.error('Error creating actor:', error);
      // Fallback to local creation if API fails
      const newActor = { value: inputValue, label: inputValue };
      const newFilms = [...films];
      const cast = newFilms[index].cast || [];
      newFilms[index].cast = [...cast, newActor];
      setFilms(newFilms);
    }
  };


  const handleFilmChange = (index: number, field: keyof Film, value: any) => {
    const newFilms = [...films];
    newFilms[index][field] = value;
    setFilms(newFilms);
  };

  const addFilm = () => {
    setFilms([...films, { title: null, cast: null, year: '', language: '' }]);
  };

  const removeFilm = (index: number) => {
    const newFilms = films.filter((_, i) => i !== index);
    setFilms(newFilms);
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/upload-excel/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Backend response:', response.data);
      const uploadedFilms = response.data.films;
      console.log('Uploaded films:', uploadedFilms);

      const newFilms = uploadedFilms.map((f: any) => {
        console.log('Processing film:', f);
        return {
          title: f.title ? { value: f.title, label: f.title } : null,
          cast: f.cast ? f.cast.split(',').map((c: string) => ({ value: c.trim(), label: c.trim() })) : [],
          year: f.year || '',
          language: f.language || '',
        };
      });

      console.log('New films state:', newFilms);
      setFilms(newFilms);
      setExcelUploaded(true);
      showSnackbar('Excel file processed successfully', 'success');
    } catch (error) {
      console.error('Error uploading Excel:', error);
      const errorMessage = (error as any).response?.data?.error || 'Failed to process Excel file';
      showSnackbar(errorMessage, 'error');
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!applicantName.trim() || !applicantEmail.trim()) {
        showSnackbar("Please fill in your name and email address.", "error");
        return;
      }
    }
    if (step === 2) {
      if (!selectedType) {
        showSnackbar("Please select a membership type.", "error");
        return;
      }
    }
    if (step === 3) {
      if (!passportPhoto) {
        showSnackbar("Please upload your passport size photo.", "error");
        return;
      }
      if (!aadharCard) {
        showSnackbar("Please upload your Aadhar card.", "error");
        return;
      }
      if (!panCard) {
        showSnackbar("Please upload your PAN card.", "error");
        return;
      }
      // Check for document errors
      if (documentErrors.passportPhoto) {
        showSnackbar(documentErrors.passportPhoto, "error");
        return;
      }
      if (documentErrors.aadharCard) {
        showSnackbar(documentErrors.aadharCard, "error");
        return;
      }
      if (documentErrors.panCard) {
        showSnackbar(documentErrors.panCard, "error");
        return;
      }
    }
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  useEffect(() => {
    if (user) {
      setApplicantName(user.full_name || "");
      setApplicantEmail(user.email || "");
      if (user.company) {
        setCompany({ value: user.company.id, label: user.company.name });
      }
      setAddress(user.address || "");
      setContactNumber(user.contact_number || "");
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      memberService.getMembershipTypes()
        .then((res) => {
          setMembershipTypes(Array.isArray(res) ? res : res.results || []);
        })
        .catch((err) => console.error("Failed to load membership types", err))
        .finally(() => setLoadingTypes(false));

      memberService.getMyApplications()
        .then((res) => {
          setApplications(Array.isArray(res) ? res : res.applications || []);
        })
        .catch((err) => console.error("Failed to load membership applications", err))
        .finally(() => setLoadingApplications(false));

      const timerTypes = setTimeout(() => {
        setMinimumLoadingTypes(false);
      }, 1500);

      const timerApplications = setTimeout(() => {
        setMinimumLoadingApplications(false);
      }, 1500);

      return () => {
        clearTimeout(timerTypes);
        clearTimeout(timerApplications);
      };
    }
  }, [isAuthenticated]);

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    // If not on the last step, just go to the next step.
    // This prevents premature submission from a 'Next' button with type="submit".
    if (step < totalSteps) {
      nextStep();
      return;
    }

    const isFilmsPartiallyFilled = films.some(f => f.title || (f.cast && f.cast.length > 0) || f.year || f.language);

    if (!isFormValid || !isFilmsPartiallyFilled) {
      showSnackbar("Please complete all required fields, including at least one film, before submitting.", "error");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('membership_type', parseInt(selectedType).toString());
      formData.append('applicant_name', applicantName);
      formData.append('company_name', company?.label || '');
      formData.append('address', address);
      formData.append('contact_number', contactNumber);
      formData.append('applicant_email', applicantEmail);
      
      // Add documents
      if (passportPhoto) {
        formData.append('passport_photo', passportPhoto);
      }
      if (aadharCard) {
        formData.append('aadhar_card', aadharCard);
      }
      if (panCard) {
        formData.append('pan_card', panCard);
      }

      // Add films data
      const filmsData = films.map(f => ({
        title: f.title?.label || f.title?.value,
        cast: f.cast?.map(c => c.label || c.value),
        year: f.year,
        language: f.language,
      })).filter(f => f.title || (f.cast && f.cast.length > 0) || f.year || f.language);

      formData.append('films', JSON.stringify(filmsData));

      const response = await memberService.submitApplication(formData);

      if (response.success) {
        setShowCongratulations(true);
        setApplications((prev) => [...prev, response.application]);
        showSnackbar("Membership application submitted successfully!", "success");
        // Reset form after successful submission
        setStep(1);
        setFilms([{ title: null, cast: null, year: '', language: '' }]);
        setCompany(null);
        setAddress("");
        setContactNumber("");
        setExcelUploaded(false);
        setPassportPhoto(null);
        setAadharCard(null);
        setPanCard(null);
        setDocumentErrors({});
      } else {
        let errorMessage = "Failed to submit application.";
        if (typeof response.error === 'string') errorMessage = response.error;
        else if (typeof response.error === 'object' && response.error?.message) errorMessage = response.error.message;
        showSnackbar(errorMessage, "error");
      }
    } catch (err: any) {
      console.error(err);
      showSnackbar(handleApiError(err), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnimationComplete = () => {
    setShowCongratulations(false);
  };

  const selectedMembershipType = membershipTypes.find((t) => t.id === parseInt(selectedType));
  const isFormValid = applicantName.trim() !== '' && applicantEmail.trim() !== '' && selectedType !== '';

  return (
    <div style={{ fontFamily: "var(--font-body)" }} className="min-h-screen bg-slate-50/50">
      {showCongratulations && (
        <CongratulationsAnimation onComplete={handleAnimationComplete} />
      )}
      <PageBanner title="MEMBERSHIP FORM" subtitle="Download the membership / authorisation form or apply online." />

      {/* <section className="py-14 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <FormCard
              title="Membership Form For Producers"
              forType="FOR PRODUCER"
              fields={["Name - PRODUCER", "Name of the Company / Film Banner :", "Address :", "Contact Nos :", "Email :"]}
            />
            <FormCard
              title="Membership Form For Other Owners"
              forType="FOR OTHER OWNERS / VIDEO PUBLISHERS"
              fields={["Name - OTHER OWNER", "Name of the Company / Film Banner :", "Address :", "Contact Nos :", "Email :"]}
            />
          </div>
        </div>
      </section> */}

      {isAuthenticated && (
        <section className="py-12">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            {loadingApplications || minimumLoadingApplications ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="h-5 bg-slate-200 rounded w-3/4 animate-pulse mb-3" />
                    <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse mb-4" />
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 rounded animate-pulse" />
                      <div className="h-3 bg-slate-200 rounded w-5/6 animate-pulse" />
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="h-8 bg-slate-200 rounded-lg animate-pulse w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : user?.is_member ? (
              <div className="max-w-2xl mx-auto bg-white p-10 rounded-md border border-slate-100 shadow-md text-center transition-all">
                <div className="inline-flex p-3 bg-emerald-50 rounded-full text-emerald-500 mb-4">
                  <CheckCircle size={36} />
                </div>
                <p className="text-base font-bold text-slate-900 tracking-wide">Membership Approved</p>
                <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">Your account already has member access. You can now use the dashboard to add films seamlessly.</p>
              </div>
            ) : applications.some((app) => app.status === 'pending') ? (
              <div className="max-w-2xl mx-auto bg-white p-10 rounded-md border border-slate-100 shadow-md text-center">
                <div className="inline-flex p-3 bg-amber-50 rounded-full text-amber-500 mb-4 animate-pulse">
                  <ShieldCheck size={36} />
                </div>
                <p className="text-base font-bold text-slate-900 tracking-wide">Application Pending Review</p>
                <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">Your membership application is safely under review. We will notify you immediately once it is verified.</p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                  <div className="bg-white p-6 sm:p-10 rounded-md border border-slate-100 shadow-md transition-all">
                    <ProgressBar currentStep={step} totalSteps={totalSteps} />
                    <form onSubmit={handleSubmitApplication} className="mt-4">
                    {step === 1 && (
                      <div className="animate-fade-in space-y-6">
                        <div className="border-b border-slate-100 pb-4">
                          <h3 className="text-lg font-bold text-slate-900 tracking-wide">Personal Information</h3>
                          <p className="text-xs text-slate-500 mt-1">Tell us about yourself and your company setup.</p>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                              Full name
                            </label>
                            <input
                              value={applicantName}
                              onChange={(e) => setApplicantName(e.target.value)}
                              className="w-full rounded-md border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all outline-none focus:border-[var(--cinefil-gold)] focus:bg-white"
                              placeholder="Your full name"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={applicantEmail}
                              onChange={(e) => setApplicantEmail(e.target.value)}
                              className="w-full rounded-md border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all outline-none focus:border-[var(--cinefil-gold)] focus:bg-white"
                              placeholder="Email address"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                              Company / Film Banner
                            </label>
                            <AsyncCreatableSelect
                              isClearable
                              loadOptions={loadCompanyOptions}
                              onCreateOption={handleCreateCompany}
                              value={company}
                              onChange={setCompany}
                              placeholder="Search or create company..."
                              className="react-select-container text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                              Contact number
                            </label>
                            <input 
                              value={contactNumber} 
                              onChange={(e) => setContactNumber(e.target.value)} 
                              className="w-full rounded-md border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all outline-none focus:border-[var(--cinefil-gold)] focus:bg-white" 
                              placeholder="Contact number" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                            Address
                          </label>
                          <textarea 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)} 
                            rows={3}
                            className="w-full rounded-md border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all outline-none focus:border-[var(--cinefil-gold)] focus:bg-white resize-none" 
                            placeholder="Full corporate or local communication address"
                          />
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="animate-fade-in space-y-6">
                        <div className="border-b border-slate-100 pb-4">
                          <h3 className="text-lg font-bold text-slate-900 tracking-wide">Select Membership Type</h3>
                          <p className="text-xs text-slate-500 mt-1">Choose the custom structure that best matching your licensing tier.</p>
                        </div>
                        {loadingTypes || minimumLoadingTypes ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(4)].map((_, index) => (
                              <div key={index} className="border border-slate-200 rounded-xl p-5 hover:border-amber-400/30 transition-colors cursor-pointer">
                                <div className="flex items-start gap-3">
                                  <div className="w-5 h-5 bg-slate-200 rounded animate-pulse mt-0.5" />
                                  <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
                                    <div className="h-3 bg-slate-200 rounded w-full animate-pulse" />
                                    <div className="h-3 bg-slate-200 rounded w-2/3 animate-pulse" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {membershipTypes.map((type) => {
                              const isSelected = selectedType === type.id.toString();
                              return (
                                <label 
                                  key={type.id} 
                                  className={`flex items-start p-5 rounded-md border cursor-pointer transition-all duration-200 ${
                                    isSelected 
                                      ? 'bg-amber-50/40 border-[var(--cinefil-gold)] shadow-sm' 
                                      : 'border-slate-200 bg-white hover:border-slate-300'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="membershipType"
                                    value={type.id}
                                    checked={isSelected}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="mt-1 h-4 w-4 text-[var(--cinefil-gold)] border-slate-300 focus:ring-[var(--cinefil-gold)]"
                                  />
                                  <div className="ml-4 text-sm">
                                    <span className={`font-semibold tracking-wide ${isSelected ? 'text-[var(--cinefil-navy)]' : 'text-slate-900'}`}>
                                      {type.membership_name}
                                    </span>
                                    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{type.description}</p>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {step === 3 && (
                      <div className="animate-fade-in space-y-6">
                        <div className="border-b border-slate-100 pb-4">
                          <h3 className="text-lg font-bold text-slate-900 tracking-wide">Document Upload</h3>
                          <p className="text-xs text-slate-500 mt-1">Upload matching proof credentials to fast-track alignment reviews.</p>
                        </div>

                        <div className="space-y-5">
                          {/* Passport Photo */}
                          <div className="bg-slate-50/50 p-4 rounded-md border border-slate-100">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                              Passport Size Photo
                              <span className="text-slate-400 font-normal normal-case ml-2">(JPEG, PNG, PDF - Max 2MB)</span>
                            </label>
                            <div className="relative">
                              <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={handlePhotoUpload}
                                className="hidden"
                                id="passport-photo"
                              />
                              <label
                                htmlFor="passport-photo"
                                className={`flex items-center justify-center gap-3 p-5 border-2 border-dashed rounded-md cursor-pointer transition-all duration-200 ${
                                  passportPhoto 
                                    ? 'border-emerald-500 bg-emerald-50/30' 
                                    : 'border-slate-300 bg-white hover:border-[var(--cinefil-gold)]'
                                }`}
                              >
                                <Upload size={18} className={passportPhoto ? 'text-emerald-500' : 'text-slate-400'} />
                                <span className="text-xs font-medium text-slate-600 truncate max-w-xs sm:max-w-md">
                                  {passportPhoto ? passportPhoto.name : 'Click to select passport photo'}
                                </span>
                              </label>
                            </div>
                            {documentErrors.passportPhoto && (
                              <p className="mt-2 text-xs font-medium text-red-600">{documentErrors.passportPhoto}</p>
                            )}
                          </div>

                          {/* Aadhar Card */}
                          <div className="bg-slate-50/50 p-4 rounded-md border border-slate-100">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                              Aadhar Card
                              <span className="text-slate-400 font-normal normal-case ml-2">(JPEG, PNG, PDF - Max 4MB)</span>
                            </label>
                            <div className="relative">
                              <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={handleAadharUpload}
                                className="hidden"
                                id="aadhar-card"
                              />
                              <label
                                htmlFor="aadhar-card"
                                className={`flex items-center justify-center gap-3 p-5 border-2 border-dashed rounded-md cursor-pointer transition-all duration-200 ${
                                  aadharCard 
                                    ? 'border-emerald-500 bg-emerald-50/30' 
                                    : 'border-slate-300 bg-white hover:border-[var(--cinefil-gold)]'
                                }`}
                              >
                                <Upload size={18} className={aadharCard ? 'text-emerald-500' : 'text-slate-400'} />
                                <span className="text-xs font-medium text-slate-600 truncate max-w-xs sm:max-w-md">
                                  {aadharCard ? aadharCard.name : 'Click to select Aadhar card'}
                                </span>
                              </label>
                            </div>
                            {documentErrors.aadharCard && (
                              <p className="mt-2 text-xs font-medium text-red-600">{documentErrors.aadharCard}</p>
                            )}
                          </div>

                          {/* PAN Card */}
                          <div className="bg-slate-50/50 p-4 rounded-md border border-slate-100">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                              PAN Card
                              <span className="text-slate-400 font-normal normal-case ml-2">(JPEG, PNG, PDF - Max 4MB)</span>
                            </label>
                            <div className="relative">
                              <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={handlePanUpload}
                                className="hidden"
                                id="pan-card"
                              />
                              <label
                                htmlFor="pan-card"
                                className={`flex items-center justify-center gap-3 p-5 border-2 border-dashed rounded-md cursor-pointer transition-all duration-200 ${
                                  panCard 
                                    ? 'border-emerald-500 bg-emerald-50/30' 
                                    : 'border-slate-300 bg-white hover:border-[var(--cinefil-gold)]'
                                }`}
                              >
                                <Upload size={18} className={panCard ? 'text-emerald-500' : 'text-slate-400'} />
                                <span className="text-xs font-medium text-slate-600 truncate max-w-xs sm:max-w-md">
                                  {panCard ? panCard.name : 'Click to select PAN card'}
                                </span>
                              </label>
                            </div>
                            {documentErrors.panCard && (
                              <p className="mt-2 text-xs font-medium text-red-600">{documentErrors.panCard}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="animate-fade-in space-y-6">
                        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 tracking-wide">Film Details</h3>
                            <p className="text-xs text-slate-500 mt-1">Provide details about the dynamic catalog items you manage.</p>
                          </div>
                          <button
                            type="button"
                            onClick={addFilm}
                            className="inline-flex items-center gap-2 text-xs font-bold bg-amber-50 text-[var(--cinefil-gold)] px-3 py-1.5 rounded border border-amber-200/50 hover:bg-[var(--cinefil-navy)] hover:text-white transition-all self-start"
                          >
                            <PlusCircle size={14} />
                            Add Film Entry
                          </button>
                        </div>
                        <div className="p-5 border border-dashed border-slate-200 bg-slate-50/50 rounded-md">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                            Batch import option via Excel
                          </label>
                          <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleExcelUpload}
                            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-[var(--cinefil-gold)] file:text-white hover:file:opacity-95 cursor-pointer"
                          />
                          <p className="text-[11px] text-slate-400 mt-2.5 leading-normal">
                            Supported column headers setup: <code className="bg-slate-100 text-slate-600 px-1 py-0.5 rounded">Title/Film Name/Movie</code>, <code className="bg-slate-100 text-slate-600 px-1 py-0.5 rounded">Cast/Star Cast</code>, <code className="bg-slate-100 text-slate-600 px-1 py-0.5 rounded">Year/Release Year</code>, <code className="bg-slate-100 text-slate-600 px-1 py-0.5 rounded">Language</code>
                          </p>
                          {excelUploaded && (
                            <p className="text-xs font-medium text-emerald-600 mt-3 flex items-center gap-1">
                              ✓ System imported {films.length} catalog film structure records successfully.
                            </p>
                          )}
                        </div>
                        {!excelUploaded && (
                          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                            {films.map((film, index) => (
                            <div key={index} className="relative p-5 border border-slate-200 bg-white rounded-md shadow-sm space-y-4 transition-all hover:border-slate-300">
                              {films.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeFilm(index)}
                                  className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                              <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Entry Item #{index + 1}</div>
                              <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                    Film Title
                                  </label>
                                  <AsyncCreatableSelect
                                    isClearable
                                    loadOptions={loadFilmOptions}
                                    onCreateOption={(inputValue) => handleCreateFilm(index, inputValue)}
                                    onChange={(option) => handleFilmChange(index, 'title', option)}
                                    value={film.title}
                                    placeholder="Search or enter title..."
                                    className="text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                    Star Cast
                                  </label>
                                  <AsyncCreatableSelect
                                    isMulti
                                    isClearable
                                    loadOptions={loadActorOptions}
                                    onCreateOption={(inputValue) => handleCreateActor(index, inputValue)}
                                    onChange={(options) => handleFilmChange(index, 'cast', options)}
                                    value={film.cast}
                                    placeholder="Search or add cast..."
                                    className="text-sm"
                                  />
                                </div>
                              </div>
                              <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                    Year
                                  </label>
                                  <input
                                    type="text"
                                    value={film.year}
                                    onChange={(e) => handleFilmChange(index, 'year', e.target.value)}
                                    className="w-full rounded-md border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none focus:border-[var(--cinefil-gold)] focus:bg-white transition-all"
                                    placeholder="e.g., 2023"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                    Language
                                  </label>
                                  <input
                                    type="text"
                                    value={film.language}
                                    onChange={(e) => handleFilmChange(index, 'language', e.target.value)}
                                    className="w-full rounded-md border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none focus:border-[var(--cinefil-gold)] focus:bg-white transition-all"
                                    placeholder="e.g., English"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        )}
                      </div>
                    )}
                    <div className="mt-8 flex justify-between pt-5 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-slate-100 text-slate-700 rounded transition-all hover:bg-slate-200 ${step === 1 ? 'invisible' : ''}`}
                      >
                        <ChevronLeft size={16} /> Back
                      </button>
                      {step < totalSteps ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold bg-[var(--cinefil-navy)] text-white rounded shadow hover:opacity-90 transition-all"
                        >
                          Next <ChevronRight size={16} />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={submitting || !isFormValid}
                          className="inline-flex items-center justify-center min-w-[140px] px-5 py-2.5 text-sm font-bold bg-emerald-600 text-white rounded shadow hover:bg-emerald-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {submitting ? (
                            <span className="flex items-center gap-2">
                              <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Submitting...
                            </span>
                          ) : 'Submit Application'}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
                </div>
                <div className="hidden lg:block lg:col-span-1">
                  <div className="sticky top-28">
                    <FormPreviewCard
                      applicantName={applicantName}
                      companyName={company?.label || "Not provided"}
                      address={address}
                      contactNumber={contactNumber}
                      applicantEmail={applicantEmail}
                      membershipTypeName={selectedMembershipType?.membership_name || "Not selected"}
                      films={films}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}