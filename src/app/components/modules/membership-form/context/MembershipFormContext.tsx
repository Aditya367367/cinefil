import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { memberService } from "../../../../../services/memberService";
import { useAuth } from "../../../../../context/AuthContext";
import { useFilmSearch, useActorSearch } from "../../../../../hooks/useSearch";
import api from "../../../../../services/api";
import { useSnackbar } from "../../../../contexts/SnackbarContext";

export interface MembershipTypeItem {
  id: number;
  membership_name: string;
  description: string;
  joining_fee?: number | string;
  annual_fee?: number | string;
  fee_currency?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface Film {
  title: SelectOption | null;
  cast: SelectOption[] | null;
  year: string;
  release_date?: string;
  language: string;
  remarks?: string;
  ownership_type: string[];
  censor_certificate: File | null;
  copyright_certificate: File | null;
  ownership_document: File | null;
  existing_censor_certificate_url?: string | null;
  existing_copyright_certificate_url?: string | null;
  existing_ownership_document_url?: string | null;
}

export interface MembershipFormContextType {
  // Navigation
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  totalSteps: number;
  isProducer: boolean;
  startedAsGuest: boolean;
  currentStepKey: string;
  activeSteps: string[];
  nextStep: () => void | Promise<void>;
  prevStep: () => void;

  // Base details
  membershipTypes: MembershipTypeItem[];
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
  applicantName: string;
  setApplicantName: React.Dispatch<React.SetStateAction<string>>;
  cinLlp: string;
  setCinLlp: React.Dispatch<React.SetStateAction<string>>;
  gstNumber: string;
  setGstNumber: React.Dispatch<React.SetStateAction<string>>;
  panNumberField: string;
  setPanNumberField: React.Dispatch<React.SetStateAction<string>>;
  dobIncorporation: string;
  setDobIncorporation: React.Dispatch<React.SetStateAction<string>>;
  registeredAddress: string;
  setRegisteredAddress: React.Dispatch<React.SetStateAction<string>>;
  correspondenceAddress: string;
  setCorrespondenceAddress: React.Dispatch<React.SetStateAction<string>>;
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  stateField: string;
  setStateField: React.Dispatch<React.SetStateAction<string>>;
  country: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  pinCode: string;
  setPinCode: React.Dispatch<React.SetStateAction<string>>;
  website: string;
  setWebsite: React.Dispatch<React.SetStateAction<string>>;
  telephoneNumber: string;
  setTelephoneNumber: React.Dispatch<React.SetStateAction<string>>;
  mobileNumber: string;
  setMobileNumber: React.Dispatch<React.SetStateAction<string>>;
  applicantEmail: string;
  setApplicantEmail: React.Dispatch<React.SetStateAction<string>>;

  // Authorized Representative State
  repName: string;
  setRepName: React.Dispatch<React.SetStateAction<string>>;
  repDesignation: string;
  setRepDesignation: React.Dispatch<React.SetStateAction<string>>;
  repMobile: string;
  setRepMobile: React.Dispatch<React.SetStateAction<string>>;
  repEmail: string;
  setRepEmail: React.Dispatch<React.SetStateAction<string>>;
  repAadhar: string;
  setRepAadhar: React.Dispatch<React.SetStateAction<string>>;
  repPan: string;
  setRepPan: React.Dispatch<React.SetStateAction<string>>;
  repAuthorityLetter: File | null;
  setRepAuthorityLetter: React.Dispatch<React.SetStateAction<File | null>>;

  // OTP Verification State
  isEmailVerified: boolean;
  setIsEmailVerified: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileVerified: boolean;
  setIsMobileVerified: React.Dispatch<React.SetStateAction<boolean>>;

  // Bank Details State
  accountHolderName: string;
  setAccountHolderName: React.Dispatch<React.SetStateAction<string>>;
  bankName: string;
  setBankName: React.Dispatch<React.SetStateAction<string>>;
  branchName: string;
  setBranchName: React.Dispatch<React.SetStateAction<string>>;
  accountNumber: string;
  setAccountNumber: React.Dispatch<React.SetStateAction<string>>;
  ifscCode: string;
  setIfscCode: React.Dispatch<React.SetStateAction<string>>;
  swiftCode: string;
  setSwiftCode: React.Dispatch<React.SetStateAction<string>>;
  upiId: string;
  setUpiId: React.Dispatch<React.SetStateAction<string>>;
  canceledCheck: File | null;
  setCanceledCheck: React.Dispatch<React.SetStateAction<File | null>>;
  gstCertificate: File | null;
  setGstCertificate: React.Dispatch<React.SetStateAction<File | null>>;

  // Categories & App Types
  membershipCategories: string[];
  setMembershipCategories: React.Dispatch<React.SetStateAction<string[]>>;
  applicantTypes: string[];
  setApplicantTypes: React.Dispatch<React.SetStateAction<string[]>>;
  otherApplicantType: string;
  setOtherApplicantType: React.Dispatch<React.SetStateAction<string>>;

  // State
  submitting: boolean;
  showCongratulations: boolean;
  setShowCongratulations: React.Dispatch<React.SetStateAction<boolean>>;
  loadingTypes: boolean;
  loadingApplications: boolean;

  // Documents
  panCard: File | null;
  setPanCard: React.Dispatch<React.SetStateAction<File | null>>;
  certificateOfIncorporation: File | null;
  setCertificateOfIncorporation: React.Dispatch<React.SetStateAction<File | null>>;
  identityProof: File | null;
  setIdentityProof: React.Dispatch<React.SetStateAction<File | null>>;
  addressProof: File | null;
  setAddressProof: React.Dispatch<React.SetStateAction<File | null>>;
  boardResolution: File | null;
  setBoardResolution: React.Dispatch<React.SetStateAction<File | null>>;
  documentErrors: { [key: string]: string };
  setDocumentErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  validateDocument: (file: File) => string | null;

  // Existing KYC & Rep & Bank URLs
  existingPanCardUrl?: string | null;
  existingCertificateOfIncorporationUrl?: string | null;
  existingIdentityProofUrl?: string | null;
  existingAddressProofUrl?: string | null;
  existingBoardResolutionUrl?: string | null;
  existingRepAuthorityLetterUrl?: string | null;
  existingCanceledCheckUrl?: string | null;
  existingGstCertificateUrl?: string | null;

  // Existing Ownership URLs
  existingProducerOwnershipDeclarationUrl?: string | null;
  existingAssignmentAgreementUrl?: string | null;
  existingOtherOwnershipDeclarationUrl?: string | null;

  // Ownership Details
  isOriginalProducer: string;
  setIsOriginalProducer: React.Dispatch<React.SetStateAction<string>>;
  relationWithProducer: string;
  setRelationWithProducer: React.Dispatch<React.SetStateAction<string>>;
  productionHouseName: string;
  setProductionHouseName: React.Dispatch<React.SetStateAction<string>>;
  totalFilmsOwned: string;
  setTotalFilmsOwned: React.Dispatch<React.SetStateAction<string>>;
  producerOwnershipDeclaration: File | null;
  setProducerOwnershipDeclaration: React.Dispatch<React.SetStateAction<File | null>>;

  natureOfOwnership: string[];
  setNatureOfOwnership: React.Dispatch<React.SetStateAction<string[]>>;
  assignmentAgreement: File | null;
  setAssignmentAgreement: React.Dispatch<React.SetStateAction<File | null>>;
  otherOwnershipDeclaration: File | null;
  setOtherOwnershipDeclaration: React.Dispatch<React.SetStateAction<File | null>>;

  // Films
  films: Film[];
  setFilms: React.Dispatch<React.SetStateAction<Film[]>>;
  excelUploaded: boolean;
  setExcelUploaded: React.Dispatch<React.SetStateAction<boolean>>;
  handleFilmChange: (index: number, field: keyof Film, value: any) => void;
  addFilm: () => void;
  removeFilm: (index: number) => void;
  handleExcelUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onCreateFilm: (inputValue: string) => Promise<SelectOption>;
  onCreateActor: (inputValue: string) => Promise<SelectOption>;
  handleCreateFilm: (index: number, inputValue: string) => Promise<void>;
  handleCreateActor: (index: number, inputValue: string) => Promise<void>;

  // Declarations
  declareLawfulOwner: boolean;
  setDeclareLawfulOwner: React.Dispatch<React.SetStateAction<boolean>>;
  authorizeCinefil: boolean;
  setAuthorizeCinefil: React.Dispatch<React.SetStateAction<boolean>>;
  agreeToAbide: boolean;
  setAgreeToAbide: React.Dispatch<React.SetStateAction<boolean>>;

  companyName: string;
  setCompanyName: React.Dispatch<React.SetStateAction<string>>;

  // Agreement
  agreementAccepted: boolean;
  setAgreementAccepted: React.Dispatch<React.SetStateAction<boolean>>;
  digitalSignature: string;
  setDigitalSignature: React.Dispatch<React.SetStateAction<string>>;
  signaturePlace: string;
  setSignaturePlace: React.Dispatch<React.SetStateAction<string>>;
  signatureDate: string;
  setSignatureDate: React.Dispatch<React.SetStateAction<string>>;
  agreementSigningOption: string;
  setAgreementSigningOption: React.Dispatch<React.SetStateAction<string>>;
  agreementSignedDocument: File | null;
  setAgreementSignedDocument: React.Dispatch<React.SetStateAction<File | null>>;
  existingAgreementSignedDocumentUrl: string | null;
  setExistingAgreementSignedDocumentUrl: React.Dispatch<React.SetStateAction<string | null>>;

  // KYC Photos
  passportPhoto: File | null;
  setPassportPhoto: React.Dispatch<React.SetStateAction<File | null>>;
  passportPhoto2: File | null;
  setPassportPhoto2: React.Dispatch<React.SetStateAction<File | null>>;
  existingPassportPhotoUrl: string | null;
  setExistingPassportPhotoUrl: React.Dispatch<React.SetStateAction<string | null>>;
  existingPassportPhoto2Url: string | null;
  setExistingPassportPhoto2Url: React.Dispatch<React.SetStateAction<string | null>>;

  // Payment
  paymentReceipt: File | null;
  setPaymentReceipt: React.Dispatch<React.SetStateAction<File | null>>;
  existingPaymentReceiptUrl: string | null;
  setExistingPaymentReceiptUrl: React.Dispatch<React.SetStateAction<string | null>>;
  applicationId: string;
  setApplicationId: React.Dispatch<React.SetStateAction<string>>;

  // Misc actions
  handleSubmitApplication: (e: React.FormEvent) => Promise<void>;
  handleAnimationComplete: () => void;
  isAuthenticated: boolean;
  selectedMembershipType: MembershipTypeItem | undefined;
  buildApplicationFormData: () => FormData;
  resetFormState: () => void;
  applications: any[];
  setApplications: React.Dispatch<React.SetStateAction<any[]>>;
  loadingApplications: boolean;
  loadDraftApplication: (draftData: any) => void;
  membershipTypes: MembershipTypeItem[];
}

const MembershipFormContext = createContext<MembershipFormContextType | undefined>(undefined);

export function MembershipFormProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [membershipTypes, setMembershipTypes] = useState<MembershipTypeItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [applicantName, setApplicantName] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [cinLlp, setCinLlp] = useState<string>("");
  const [gstNumber, setGstNumber] = useState<string>("");
  const [panNumberField, setPanNumberField] = useState<string>("");
  const [dobIncorporation, setDobIncorporation] = useState<string>("");
  const [registeredAddress, setRegisteredAddress] = useState<string>("");
  const [correspondenceAddress, setCorrespondenceAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [stateField, setStateField] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [pinCode, setPinCode] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [telephoneNumber, setTelephoneNumber] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [applicantEmail, setApplicantEmail] = useState<string>("");

  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [isMobileVerified, setIsMobileVerified] = useState<boolean>(false);

  // Existing document URL states
  const [existingPanCardUrl, setExistingPanCardUrl] = useState<string | null>(null);
  const [existingCertificateOfIncorporationUrl, setExistingCertificateOfIncorporationUrl] = useState<string | null>(null);
  const [existingIdentityProofUrl, setExistingIdentityProofUrl] = useState<string | null>(null);
  const [existingAddressProofUrl, setExistingAddressProofUrl] = useState<string | null>(null);
  const [existingBoardResolutionUrl, setExistingBoardResolutionUrl] = useState<string | null>(null);
  const [existingRepAuthorityLetterUrl, setExistingRepAuthorityLetterUrl] = useState<string | null>(null);
  const [existingCanceledCheckUrl, setExistingCanceledCheckUrl] = useState<string | null>(null);
  const [existingGstCertificateUrl, setExistingGstCertificateUrl] = useState<string | null>(null);
  const [existingProducerOwnershipDeclarationUrl, setExistingProducerOwnershipDeclarationUrl] = useState<string | null>(null);
  const [existingAssignmentAgreementUrl, setExistingAssignmentAgreementUrl] = useState<string | null>(null);
  const [existingOtherOwnershipDeclarationUrl, setExistingOtherOwnershipDeclarationUrl] = useState<string | null>(null);

  const [films, setFilms] = useState<Film[]>([{ title: null, cast: null, year: '', release_date: '', language: '', remarks: '', ownership_type: [], censor_certificate: null, copyright_certificate: null, ownership_document: null }]);

  const [repName, setRepName] = useState<string>("");
  const [repDesignation, setRepDesignation] = useState<string>("");
  const [repMobile, setRepMobile] = useState<string>("");
  const [repEmail, setRepEmail] = useState<string>("");
  const [repAadhar, setRepAadhar] = useState<string>("");
  const [repPan, setRepPan] = useState<string>("");
  const [repAuthorityLetter, setRepAuthorityLetter] = useState<File | null>(null);

  const [accountHolderName, setAccountHolderName] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [branchName, setBranchName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [ifscCode, setIfscCode] = useState<string>("");
  const [swiftCode, setSwiftCode] = useState<string>("");
  const [upiId, setUpiId] = useState<string>("");
  const [canceledCheck, setCanceledCheck] = useState<File | null>(null);
  const [gstCertificate, setGstCertificate] = useState<File | null>(null);

  const [membershipCategories, setMembershipCategories] = useState<string[]>([]);
  const [applicantTypes, setApplicantTypes] = useState<string[]>([]);
  const [otherApplicantType, setOtherApplicantType] = useState<string>("");
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);

  const { showSnackbar } = useSnackbar();

  const [startedAsGuest] = useState(() => !isAuthenticated);
  const [step, setStep] = useState(1);
  const selectedMembershipType = membershipTypes.find((t) => t.id === parseInt(selectedType));
  const isProducer = membershipCategories.length > 0
    ? membershipCategories.includes("producer_member")
    : !!selectedMembershipType?.membership_name?.toLowerCase().includes("producer");

  const activeSteps: string[] = [];
  if (startedAsGuest) {
    activeSteps.push("register");
  }
  activeSteps.push("category");
  activeSteps.push("applicant");
  activeSteps.push("bank");
  activeSteps.push("kyc");
  activeSteps.push("film");
  activeSteps.push("declaration");
  activeSteps.push("agreement");
  activeSteps.push("review");
  activeSteps.push("fee");

  const totalSteps = activeSteps.length;
  const currentStepKey = activeSteps[step - 1] || "";
  const [excelUploaded, setExcelUploaded] = useState(false);

  const [panCard, setPanCard] = useState<File | null>(null);
  const [certificateOfIncorporation, setCertificateOfIncorporation] = useState<File | null>(null);
  const [identityProof, setIdentityProof] = useState<File | null>(null);
  const [addressProof, setAddressProof] = useState<File | null>(null);
  const [boardResolution, setBoardResolution] = useState<File | null>(null);
  const [documentErrors, setDocumentErrors] = useState<{ [key: string]: string }>({});

  const [isOriginalProducer, setIsOriginalProducer] = useState<string>('');
  const [relationWithProducer, setRelationWithProducer] = useState<string>('');
  const [productionHouseName, setProductionHouseName] = useState<string>('');
  const [totalFilmsOwned, setTotalFilmsOwned] = useState<string>('');
  const [producerOwnershipDeclaration, setProducerOwnershipDeclaration] = useState<File | null>(null);

  const [natureOfOwnership, setNatureOfOwnership] = useState<string[]>([]);
  const [assignmentAgreement, setAssignmentAgreement] = useState<File | null>(null);
  const [otherOwnershipDeclaration, setOtherOwnershipDeclaration] = useState<File | null>(null);

  const [declareLawfulOwner, setDeclareLawfulOwner] = useState<boolean>(false);
  const [authorizeCinefil, setAuthorizeCinefil] = useState<boolean>(false);
  const [agreeToAbide, setAgreeToAbide] = useState<boolean>(false);

  const [agreementAccepted, setAgreementAccepted] = useState<boolean>(false);
  const [digitalSignature, setDigitalSignature] = useState<string>("");
  const [signaturePlace, setSignaturePlace] = useState<string>("");
  const [signatureDate, setSignatureDate] = useState<string>("");
  const [agreementSigningOption, setAgreementSigningOption] = useState<string>("no_dsc");
  const [agreementSignedDocument, setAgreementSignedDocument] = useState<File | null>(null);
  const [existingAgreementSignedDocumentUrl, setExistingAgreementSignedDocumentUrl] = useState<string | null>(null);

  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [passportPhoto2, setPassportPhoto2] = useState<File | null>(null);
  const [existingPassportPhotoUrl, setExistingPassportPhotoUrl] = useState<string | null>(null);
  const [existingPassportPhoto2Url, setExistingPassportPhoto2Url] = useState<string | null>(null);

  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [existingPaymentReceiptUrl, setExistingPaymentReceiptUrl] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string>("");

  const { onCreateOption: onCreateFilm } = useFilmSearch();
  const { onCreateOption: onCreateActor } = useActorSearch();

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await memberService.getMembershipTypes();
        // The API returns a paginated object containing a "results" array
        const types = Array.isArray(response) ? response : (response.results || response.data || []);
        if (types && types.length > 0) {
          setMembershipTypes(types);
          if (!selectedType) {
            setSelectedType(types[0].id.toString());
          }
        }
      } catch (error) {
        console.error("Failed to load membership types:", error);
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchTypes();

    if (isAuthenticated && user) {
      const fetchApplications = async () => {
        try {
          const response = await memberService.getApplications();
          if (response.success && response.applications) {
            setApplications(response.applications);
          }
        } catch (error) {
          console.error("Failed to fetch applications:", error);
        } finally {
          setLoadingApplications(false);
        }
      };

      fetchApplications();
    } else {
      setLoadingApplications(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (applications && applications.length > 0) {
      const draftApp = applications.find(app => ['draft', 'rejected', 'paid_no_receipt', 'documents_pending', 'query_raised', 'no_film'].includes(app.status));
      if (draftApp && !applicationId) {
        loadDraftApplication(draftApp);
      }
    }
  }, [applications, applicationId]);

  useEffect(() => {
    if (membershipTypes.length > 0) {
      if (membershipCategories.includes("producer_member")) {
        const prodType = membershipTypes.find(t => t.membership_name.toLowerCase().includes("producer"));
        if (prodType) setSelectedType(prodType.id.toString());
      } else if (membershipCategories.includes("other_member")) {
        const otherType = membershipTypes.find(t => t.membership_name.toLowerCase().includes("other") || t.membership_name.toLowerCase().includes("owner"));
        if (otherType) setSelectedType(otherType.id.toString());
      }
    }
  }, [membershipCategories, membershipTypes]);

  useEffect(() => {
    if (user) {
      setApplicantName(user.full_name || "");
      setApplicantEmail(user.email || "");
      if (user.phone) {
        setMobileNumber(user.phone);
      }
      if (user.is_email_verified) {
        setIsEmailVerified(true);
      }
      if (user.is_mobile_verified) {
        setIsMobileVerified(true);
      }
    }
  }, [user]);

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

  const handleCreateFilm = async (index: number, inputValue: string) => {
    try {
      const createdFilm = await onCreateFilm(inputValue);
      handleFilmChange(index, 'title', createdFilm);
    } catch (error) {
      console.error('Error creating film:', error);
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
    setFilms([...films, { title: null, cast: null, year: '', release_date: '', language: '', remarks: '', ownership_type: [], censor_certificate: null, copyright_certificate: null, ownership_document: null }]);
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
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const uploadedFilms = response.data.films;
      const newFilms = uploadedFilms.map((f: any) => ({
        title: f.title ? { value: f.title, label: f.title } : null,
        cast: f.cast ? f.cast.split(',').map((c: string) => ({ value: c.trim(), label: c.trim() })) : [],
        year: f.year || '',
        ownership_type: f.ownership_type ? f.ownership_type.split(',').map((o: string) => o.trim()) : [],
        censor_certificate: null,
        copyright_certificate: null,
        ownership_document: null,
      }));
      setFilms(newFilms);
      setExcelUploaded(true);
      showSnackbar('Excel file processed successfully', 'success');
    } catch (error: any) {
      console.error('Error uploading Excel:', error);
      const errorMessage = error.response?.data?.error || 'Failed to process Excel file';
      showSnackbar(errorMessage, 'error');
    }
  };

  const formatValidationErrors = (errors: any) => {
    if (typeof errors === 'string') return errors;
    try {
      const firstKey = Object.keys(errors)[0];
      const messages = errors[firstKey];
      const message = Array.isArray(messages) ? messages[0] : messages;
      const formattedKey = firstKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return `${formattedKey}: ${message}`;
    } catch (e) {
      return "Validation failed on one or more fields.";
    }
  };

  const saveStepData = async () => {
    // Only save if authenticated
    if (!isAuthenticated) return true;

    setSubmitting(true);
    try {
      const formData = buildApplicationFormData(false);
      let response;
      if (applicationId) {
        response = await memberService.updateApplication(Number(applicationId), formData);
      } else {
        response = await memberService.submitApplication(formData);
      }

      if (response.success) {
        if (response.application && response.application.id) {
          setApplicationId(response.application.id.toString());
        }
        return true;
      } else {
        const errorMsg = response.errors ? formatValidationErrors(response.errors) : (response.error || "Failed to save details");
        showSnackbar(errorMsg, "error");
        return false;
      }
    } catch (err: any) {
      console.error(err);
      const errData = err.response?.data;
      if (errData && errData.errors) {
        showSnackbar(formatValidationErrors(errData.errors), "error");
      } else {
        showSnackbar(errData?.error || "An error occurred while saving details.", "error");
      }
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = async () => {
    if (currentStepKey === "register") {
      if (!isAuthenticated) {
        showSnackbar("Please complete account registration first.", "error");
        return;
      }
      if (!isEmailVerified || !isMobileVerified) {
        showSnackbar("Please verify both email and mobile OTP before proceeding.", "error");
        return;
      }
    }
    if (currentStepKey === "category") {
      if (membershipCategories.length === 0) {
        showSnackbar("Please select at least one membership category.", "error");
        return;
      }
      if (applicantTypes.length === 0) {
        showSnackbar("Please select at least one applicant type.", "error");
        return;
      }
    }
    if (currentStepKey === "applicant") {
      if (!applicantName.trim() || !applicantEmail.trim() || !mobileNumber.trim()) {
        showSnackbar("Please fill in your name, email address, and mobile number.", "error");
        return;
      }
      if (!isEmailVerified) {
        showSnackbar("Please verify your email address.", "error");
        return;
      }
      if (!isMobileVerified) {
        showSnackbar("Please verify your mobile number.", "error");
        return;
      }
      if (!panNumberField.trim() || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumberField)) {
        showSnackbar("Please enter a valid 10-character PAN Number (e.g. ABCDE1234F).", "error");
        return;
      }
      if (!registeredAddress.trim() || !/^[A-Za-z0-9\s#,\-\/\.]{5,255}$/.test(registeredAddress)) {
        showSnackbar("Please enter a valid Address (5-255 characters).", "error");
        return;
      }
      if (!city.trim() || !/^[A-Za-z\s-]{2,100}$/.test(city)) {
        showSnackbar("Please enter a valid City name (letters and spaces only).", "error");
        return;
      }
      if (!stateField.trim()) {
        showSnackbar("Please select a valid State.", "error");
        return;
      }
      if (!country.trim()) {
        showSnackbar("Please select a valid Country.", "error");
        return;
      }
      if (!pinCode.trim() || !/^[1-9][0-9]{5}$/.test(pinCode)) {
        showSnackbar("Please enter a valid 6-digit Indian Pin Code (cannot start with 0).", "error");
        return;
      }
    }
    if (currentStepKey === "bank") {
      if (!accountHolderName.trim() || !bankName.trim() || !branchName.trim() || !accountNumber.trim() || !ifscCode.trim()) {
        showSnackbar("Please fill in all mandatory bank details (Name, Bank, Branch, Account No, IFSC).", "error");
        return;
      }
    }
    if (currentStepKey === "kyc") {
      if (!panCard && !existingPanCardUrl) {
        showSnackbar("Please upload your PAN card.", "error");
        return;
      }
      const isIndividual = applicantTypes.includes("individual");
      if (!isIndividual && !boardResolution && !existingBoardResolutionUrl) {
        showSnackbar("Please upload Authority Letter or Board Resolution for entity.", "error");
        return;
      }
      if (!passportPhoto && !existingPassportPhotoUrl) {
        showSnackbar("Please upload Passport Photograph 1.", "error");
        return;
      }
      // if (!passportPhoto2 && !existingPassportPhoto2Url) {
      //   showSnackbar("Please upload Passport Photograph 2.", "error");
      //   return;
      // }
      if (documentErrors.panCard || documentErrors.boardResolution || documentErrors.passportPhoto || documentErrors.passportPhoto2) {
        showSnackbar("Please fix document errors before proceeding.", "error");
        return;
      }
    }
    if (currentStepKey === "film") {
      const isFilmsPartiallyFilled = films.some(f => f.title || (f.cast && f.cast.length > 0) || f.year || f.language);
      if (!isFilmsPartiallyFilled) {
        showSnackbar("Please complete all required fields, including at least one film.", "error");
        return;
      }
    }
    if (currentStepKey === "declaration") {
      if (!declareLawfulOwner || !authorizeCinefil || !agreeToAbide) {
        showSnackbar("Please accept all declarations.", "error");
        return;
      }
    }
    if (currentStepKey === "agreement") {
      const isScan = agreementSigningOption === "scan";
      const hasSignatureOrDoc = isScan
        ? Boolean(agreementSignedDocument || existingAgreementSignedDocumentUrl)
        : Boolean(digitalSignature.trim());

      if (!agreementAccepted || !hasSignatureOrDoc || !signaturePlace.trim() || !signatureDate) {
        showSnackbar(
          isScan
            ? "Please accept the agreement, upload signed copy, and provide place and date."
            : "Please accept the agreement and provide your digital signature, place, and date.",
          "error"
        );
        return;
      }
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const localTodayStr = `${year}-${month}-${day}`;
      if (signatureDate < localTodayStr) {
        showSnackbar("Signature date cannot be in the past.", "error");
        return;
      }
    }

    if (currentStepKey !== "fee") {
      const saveSuccess = await saveStepData();
      if (!saveSuccess) {
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

  const buildApplicationFormData = (isFinalSubmission = false): FormData => {
    const formData = new FormData();
    if (isFinalSubmission) {
      formData.append('is_final_submission', 'true');
    } else {
      formData.append('status', 'draft');
    }
    const typeId = parseInt(selectedType);
    if (!isNaN(typeId)) {
      formData.append('membership_type', typeId.toString());
    } else {
      if (membershipCategories.includes("producer_member")) {
        formData.append('membership_type', '1');
      } else {
        formData.append('membership_type', '2');
      }
    }
    formData.append('applicant_name', applicantName);
    formData.append('company_name', companyName);
    formData.append('applicant_email', applicantEmail);
    formData.append('cin_llpin', cinLlp);
    formData.append('gst_number', gstNumber);
    formData.append('pan_number', panNumberField);
    formData.append('dob_incorporation', dobIncorporation);
    formData.append('registered_address', registeredAddress);
    formData.append('correspondence_address', correspondenceAddress);
    formData.append('city', city);
    formData.append('state', stateField);
    formData.append('country', country);
    formData.append('pin_code', pinCode);
    formData.append('website', website);
    formData.append('telephone_number', telephoneNumber);
    formData.append('mobile_number', mobileNumber);

    formData.append('rep_name', repName);
    formData.append('rep_designation', repDesignation);
    formData.append('rep_mobile', repMobile);
    formData.append('rep_email', repEmail);
    formData.append('rep_aadhar', repAadhar);
    formData.append('rep_pan', repPan);
    if (repAuthorityLetter) formData.append('rep_authority_letter', repAuthorityLetter);

    formData.append('account_holder_name', accountHolderName);
    formData.append('bank_name', bankName);
    formData.append('branch_name', branchName);
    formData.append('account_number', accountNumber);
    formData.append('ifsc_code', ifscCode);
    formData.append('swift_code', swiftCode);
    formData.append('upi_id', upiId);
    if (canceledCheck) formData.append('canceled_check', canceledCheck);
    if (gstCertificate) formData.append('gst_certificate', gstCertificate);

    formData.append('membership_categories', JSON.stringify(membershipCategories));
    formData.append('applicant_types', JSON.stringify(applicantTypes));
    if (applicantTypes.includes('other') && otherApplicantType) {
      formData.append('other_applicant_type', otherApplicantType);
    }

    if (panCard) formData.append('pan_card', panCard);
    if (certificateOfIncorporation) formData.append('certificate_of_incorporation', certificateOfIncorporation);
    if (identityProof) formData.append('identity_proof', identityProof);
    if (addressProof) formData.append('address_proof', addressProof);
    if (boardResolution) formData.append('board_resolution', boardResolution);
    if (passportPhoto) formData.append('passport_photo', passportPhoto);
    if (passportPhoto2) formData.append('passport_photo_2', passportPhoto2);

    const isProducer = isAuthenticated
      ? selectedMembershipType?.membership_name?.includes("Producer")
      : membershipCategories.includes("producer_member");

    if (isProducer) {
      formData.append('is_original_producer', isOriginalProducer);
      formData.append('production_house_name', productionHouseName);
      formData.append('total_films_owned', totalFilmsOwned);
      if (producerOwnershipDeclaration) formData.append('producer_ownership_declaration', producerOwnershipDeclaration);
    }

    const isOtherMember = isAuthenticated
      ? !selectedMembershipType?.membership_name?.includes("Producer")
      : membershipCategories.includes("other_member");

    if (isOtherMember) {
      formData.append('nature_of_ownership', JSON.stringify(natureOfOwnership));
      if (assignmentAgreement) formData.append('assignment_agreement', assignmentAgreement);
      if (otherOwnershipDeclaration) formData.append('other_ownership_declaration', otherOwnershipDeclaration);
    }

    const filmsData = films.map(f => ({
      title: typeof f.title === 'object' ? (f.title?.label || f.title?.value || '') : (f.title || ''),
      cast: f.cast?.map((c: any) => c.label || c.value || c),
      year: f.year,
      release_date: (f as any).release_date || '',
      language: f.language,
      ownership_type: f.ownership_type,
      remarks: (f as any).remarks || '',
    })).filter(f => f.title || (f.cast && f.cast.length > 0) || f.year || f.language || (f as any).release_date || (f as any).remarks);

    formData.append('films', JSON.stringify(filmsData));

    // Append files for each film dynamically
    films.forEach((f, idx) => {
      if (f.censor_certificate) formData.append(`films[${idx}][censor_certificate]`, f.censor_certificate);
      if (f.copyright_certificate) formData.append(`films[${idx}][copyright_certificate]`, f.copyright_certificate);
      if (f.ownership_document) formData.append(`films[${idx}][ownership_document]`, f.ownership_document);
    });

    // Declarations
    formData.append('declare_lawful_owner', String(declareLawfulOwner));
    formData.append('authorize_cinefil', String(authorizeCinefil));
    formData.append('agree_to_abide', String(agreeToAbide));

    // Agreement
    formData.append('agreement_accepted', String(agreementAccepted));
    formData.append('digital_signature', digitalSignature);
    formData.append('signature_place', signaturePlace);
    formData.append('signature_date', signatureDate);
    formData.append('agreement_signing_option', agreementSigningOption);
    if (agreementSignedDocument) formData.append('agreement_signed_document', agreementSignedDocument);

    // Payment
    if (paymentReceipt) formData.append('payment_receipt', paymentReceipt);
    if (applicationId) formData.append('id', applicationId);

    return formData;
  };

  const resetFormState = () => {
    setStep(1);
    setApplicationId("");
    setFilms([{ title: null, cast: null, year: '', release_date: '', language: '', remarks: '', ownership_type: [], censor_certificate: null, copyright_certificate: null, ownership_document: null }]);
    setCinLlp("");
    setGstNumber("");
    setPanNumberField("");
    setDobIncorporation("");
    setRegisteredAddress("");
    setCorrespondenceAddress("");
    setCity("");
    setStateField("");
    setCountry("");
    setPinCode("");
    setWebsite("");
    setTelephoneNumber("");
    setMobileNumber("");
    setRepName("");
    setRepDesignation("");
    setRepMobile("");
    setRepEmail("");
    setRepAadhar("");
    setRepPan("");
    setRepAuthorityLetter(null);
    setAccountHolderName("");
    setBankName("");
    setBranchName("");
    setAccountNumber("");
    setIfscCode("");
    setSwiftCode("");
    setUpiId("");
    setCanceledCheck(null);
    setGstCertificate(null);
    setExcelUploaded(false);
    setPanCard(null);
    setCertificateOfIncorporation(null);
    setIdentityProof(null);
    setAddressProof(null);
    setBoardResolution(null);
    setDocumentErrors({});
    setMembershipCategories([]);
    setApplicantTypes([]);
    setOtherApplicantType("");
    setIsOriginalProducer('');
    setProductionHouseName('');
    setTotalFilmsOwned('');
    setProducerOwnershipDeclaration(null);
    setNatureOfOwnership([]);
    setAssignmentAgreement(null);
    setOtherOwnershipDeclaration(null);
    setDeclareLawfulOwner(false);
    setAuthorizeCinefil(false);
    setAgreeToAbide(false);
    setAgreementAccepted(false);
    setDigitalSignature("");
    setSignaturePlace("");
    setSignatureDate("");
    setCompanyName("");
    setAgreementSigningOption("no_dsc");
    setAgreementSignedDocument(null);
    setExistingAgreementSignedDocumentUrl(null);
    setPassportPhoto(null);
    setPassportPhoto2(null);
    setExistingPassportPhotoUrl(null);
    setExistingPassportPhoto2Url(null);
    setPaymentReceipt(null);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      nextStep();
      return;
    }
    const isFilmsPartiallyFilled = films.some(f => f.title || (f.cast && f.cast.length > 0) || f.year || f.language);
    if (!isFilmsPartiallyFilled) {
      showSnackbar("Please complete all required fields, including at least one film, before submitting.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const formData = buildApplicationFormData(true);

      let response;
      if (applicationId) {
        response = await memberService.updateApplication(Number(applicationId), formData);
      } else {
        response = await memberService.submitApplication(formData);
      }

      if (response.success) {
        setShowCongratulations(true);
        setApplications((prev) => [...prev, response.application]);
        showSnackbar("Membership application submitted successfully with payment receipt!", "success");
        resetFormState();
      } else {
        const errorMsg = response.errors ? formatValidationErrors(response.errors) : (response.error || "Failed to submit application");
        showSnackbar(errorMsg, "error");
      }
    } catch (err: any) {
      console.error(err);
      const errData = err.response?.data;
      if (errData && errData.errors) {
        showSnackbar(formatValidationErrors(errData.errors), "error");
      } else {
        showSnackbar(errData?.error || "An error occurred.", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnimationComplete = () => {
    setShowCongratulations(false);
  };

  // Populate form with draft application data
  const loadDraftApplication = (draftData: any) => {
    if (!draftData) return;

    // Auto-fill applicant details
    if (draftData.applicant_name) setApplicantName(draftData.applicant_name);
    if (draftData.cin_llpin) setCinLlp(draftData.cin_llpin);
    if (draftData.gst_number) setGstNumber(draftData.gst_number);
    if (draftData.pan_number) setPanNumberField(draftData.pan_number);
    if (draftData.dob_incorporation) setDobIncorporation(draftData.dob_incorporation);
    if (draftData.registered_address) setRegisteredAddress(draftData.registered_address);
    if (draftData.correspondence_address) setCorrespondenceAddress(draftData.correspondence_address);
    if (draftData.city) setCity(draftData.city);
    if (draftData.state) setStateField(draftData.state);
    if (draftData.country) setCountry(draftData.country);
    if (draftData.pin_code) setPinCode(draftData.pin_code);
    if (draftData.website) setWebsite(draftData.website);
    if (draftData.telephone_number) setTelephoneNumber(draftData.telephone_number);
    if (draftData.mobile_number) {
      setMobileNumber(draftData.mobile_number);
      setIsMobileVerified(true);
    }
    if (draftData.applicant_email) {
      setApplicantEmail(draftData.applicant_email);
      setIsEmailVerified(true);
    }

    // Selected Type
    if (draftData.membership_type) {
      setSelectedType(draftData.membership_type.toString());
    }

    // JSON Arrays
    if (draftData.membership_categories && Array.isArray(draftData.membership_categories)) {
      setMembershipCategories(draftData.membership_categories);
    }
    if (draftData.applicant_types && Array.isArray(draftData.applicant_types)) {
      setApplicantTypes(draftData.applicant_types);
    }
    if (draftData.other_applicant_type) {
      setOtherApplicantType(draftData.other_applicant_type);
    }
    if (draftData.nature_of_ownership && Array.isArray(draftData.nature_of_ownership)) {
      setNatureOfOwnership(draftData.nature_of_ownership);
    }

    // Films
    if (draftData.submitted_film_data && Array.isArray(draftData.submitted_film_data) && draftData.submitted_film_data.length > 0) {
      const enrichedFilms = draftData.submitted_film_data.map((film: any, index: number) => {
        const enrichedFilm = { ...film };
        if (draftData.documents && Array.isArray(draftData.documents)) {
          draftData.documents.forEach((doc: any) => {
            if (doc.document_type === `film_${index}_censor_certificate` && doc.file) {
              enrichedFilm.existing_censor_certificate_url = doc.file;
            } else if (doc.document_type === `film_${index}_copyright_certificate` && doc.file) {
              enrichedFilm.existing_copyright_certificate_url = doc.file;
            } else if (doc.document_type === `film_${index}_ownership_document` && doc.file) {
              enrichedFilm.existing_ownership_document_url = doc.file;
            }
          });
        }
        return enrichedFilm;
      });
      setFilms(enrichedFilms);
    }

    // Rep Details
    if (draftData.rep_name) setRepName(draftData.rep_name);
    if (draftData.rep_designation) setRepDesignation(draftData.rep_designation);
    if (draftData.rep_mobile) setRepMobile(draftData.rep_mobile);
    if (draftData.rep_email) setRepEmail(draftData.rep_email);
    if (draftData.rep_aadhar) setRepAadhar(draftData.rep_aadhar);
    if (draftData.rep_pan) setRepPan(draftData.rep_pan);
    if (draftData.rep_authority_letter) setExistingRepAuthorityLetterUrl(draftData.rep_authority_letter);

    // Bank Details
    if (draftData.account_holder_name) setAccountHolderName(draftData.account_holder_name);
    if (draftData.bank_name) setBankName(draftData.bank_name);
    if (draftData.branch_name) setBranchName(draftData.branch_name);
    if (draftData.account_number) setAccountNumber(draftData.account_number);
    if (draftData.ifsc_code) setIfscCode(draftData.ifsc_code);
    if (draftData.swift_code) setSwiftCode(draftData.swift_code);
    if (draftData.upi_id) setUpiId(draftData.upi_id);
    if (draftData.canceled_check) setExistingCanceledCheckUrl(draftData.canceled_check);
    if (draftData.gst_certificate) setExistingGstCertificateUrl(draftData.gst_certificate);
    if (draftData.company_name) {
      setCompanyName(draftData.company_name);
    }
    if (draftData.agreement_signing_option) {
      setAgreementSigningOption(draftData.agreement_signing_option);
    }
    if (draftData.agreement_signed_document) {
      setExistingAgreementSignedDocumentUrl(draftData.agreement_signed_document);
    }
    if (draftData.passport_photo) {
      setExistingPassportPhotoUrl(draftData.passport_photo);
    }
    if (draftData.passport_photo_2) {
      setExistingPassportPhoto2Url(draftData.passport_photo_2);
    }

    // KYC Documents
    if (draftData.pan_card) setExistingPanCardUrl(draftData.pan_card);
    if (draftData.certificate_of_incorporation) setExistingCertificateOfIncorporationUrl(draftData.certificate_of_incorporation);
    if (draftData.identity_proof) setExistingIdentityProofUrl(draftData.identity_proof);
    if (draftData.address_proof) setExistingAddressProofUrl(draftData.address_proof);
    if (draftData.board_resolution) setExistingBoardResolutionUrl(draftData.board_resolution);

    // Ownership Details
    if (draftData.is_original_producer) setIsOriginalProducer(draftData.is_original_producer);
    if (draftData.relation_with_producer) setRelationWithProducer(draftData.relation_with_producer);
    if (draftData.production_house_name) setProductionHouseName(draftData.production_house_name);
    if (draftData.total_films_owned) setTotalFilmsOwned(draftData.total_films_owned);
    if (draftData.producer_ownership_declaration) setExistingProducerOwnershipDeclarationUrl(draftData.producer_ownership_declaration);
    if (draftData.assignment_agreement) setExistingAssignmentAgreementUrl(draftData.assignment_agreement);
    if (draftData.other_ownership_declaration) setExistingOtherOwnershipDeclarationUrl(draftData.other_ownership_declaration);

    // Declarations
    if (draftData.declare_lawful_owner !== undefined) setDeclareLawfulOwner(draftData.declare_lawful_owner);
    if (draftData.authorize_cinefil !== undefined) setAuthorizeCinefil(draftData.authorize_cinefil);
    if (draftData.agree_to_abide !== undefined) setAgreeToAbide(draftData.agree_to_abide);
    if (draftData.agreement_accepted !== undefined) setAgreementAccepted(draftData.agreement_accepted);
    if (draftData.digital_signature) setDigitalSignature(draftData.digital_signature);
    if (draftData.signature_place) setSignaturePlace(draftData.signature_place);
    if (draftData.signature_date) setSignatureDate(draftData.signature_date);

    // Receipt
    if (draftData.payments && Array.isArray(draftData.payments) && draftData.payments.length > 0) {
      const payment = draftData.payments[draftData.payments.length - 1]; // Use latest payment
      if (payment.receipt) {
        setExistingPaymentReceiptUrl(payment.receipt);
      }
    }

    // Set the application ID so submitting will update it
    if (draftData.id) {
      setApplicationId(draftData.id);
    }
  };

  const value: MembershipFormContextType = {
    step, setStep, totalSteps, isProducer, startedAsGuest, currentStepKey, activeSteps, nextStep, prevStep,
    membershipTypes, selectedType, setSelectedType,
    applicantName, setApplicantName, cinLlp, setCinLlp, gstNumber, setGstNumber,
    panNumberField, setPanNumberField, dobIncorporation, setDobIncorporation,
    registeredAddress, setRegisteredAddress, correspondenceAddress, setCorrespondenceAddress,
    city, setCity, stateField, setStateField, country, setCountry, pinCode, setPinCode,
    website, setWebsite, telephoneNumber, setTelephoneNumber, mobileNumber, setMobileNumber,
    applicantEmail, setApplicantEmail,
    companyName, setCompanyName,
    agreementSigningOption, setAgreementSigningOption,
    agreementSignedDocument, setAgreementSignedDocument,
    existingAgreementSignedDocumentUrl, setExistingAgreementSignedDocumentUrl,
    passportPhoto, setPassportPhoto,
    passportPhoto2, setPassportPhoto2,
    existingPassportPhotoUrl, setExistingPassportPhotoUrl,
    existingPassportPhoto2Url, setExistingPassportPhoto2Url,
    repName, setRepName, repDesignation, setRepDesignation, repMobile, setRepMobile,
    repEmail, setRepEmail, repAadhar, setRepAadhar, repPan, setRepPan,
    repAuthorityLetter, setRepAuthorityLetter,
    accountHolderName, setAccountHolderName, bankName, setBankName, branchName, setBranchName,
    accountNumber, setAccountNumber, ifscCode, setIfscCode, swiftCode, setSwiftCode,
    upiId, setUpiId, canceledCheck, setCanceledCheck, gstCertificate, setGstCertificate,
    membershipCategories, setMembershipCategories, applicantTypes, setApplicantTypes,
    otherApplicantType, setOtherApplicantType,
    submitting, showCongratulations, setShowCongratulations, loadingTypes, loadingApplications,
    panCard, setPanCard, certificateOfIncorporation, setCertificateOfIncorporation,
    identityProof, setIdentityProof, addressProof, setAddressProof,
    boardResolution, setBoardResolution, documentErrors, setDocumentErrors,
    validateDocument,
    isOriginalProducer, setIsOriginalProducer, relationWithProducer, setRelationWithProducer, productionHouseName, setProductionHouseName,
    totalFilmsOwned, setTotalFilmsOwned, producerOwnershipDeclaration, setProducerOwnershipDeclaration,
    natureOfOwnership, setNatureOfOwnership, assignmentAgreement, setAssignmentAgreement,
    otherOwnershipDeclaration, setOtherOwnershipDeclaration,
    existingPanCardUrl, existingCertificateOfIncorporationUrl, existingIdentityProofUrl, existingAddressProofUrl, existingBoardResolutionUrl,
    existingRepAuthorityLetterUrl, existingCanceledCheckUrl, existingGstCertificateUrl,
    existingProducerOwnershipDeclarationUrl, existingAssignmentAgreementUrl, existingOtherOwnershipDeclarationUrl,
    films, setFilms, excelUploaded, setExcelUploaded,
    declareLawfulOwner, setDeclareLawfulOwner, authorizeCinefil, setAuthorizeCinefil, agreeToAbide, setAgreeToAbide,
    agreementAccepted, setAgreementAccepted, digitalSignature, setDigitalSignature, signaturePlace, setSignaturePlace, signatureDate, setSignatureDate,
    paymentReceipt, setPaymentReceipt,
    existingPaymentReceiptUrl, setExistingPaymentReceiptUrl,
    applicationId, setApplicationId,
    isEmailVerified, setIsEmailVerified, isMobileVerified, setIsMobileVerified,
    handleFilmChange, addFilm, removeFilm, handleExcelUpload,
    onCreateFilm, onCreateActor, handleCreateFilm, handleCreateActor,
    handleSubmitApplication, handleAnimationComplete,
    isAuthenticated, selectedMembershipType,
    buildApplicationFormData, resetFormState,
    applications, setApplications,
    loadDraftApplication,
  };

  return <MembershipFormContext.Provider value={value}>{children}</MembershipFormContext.Provider>;
}

export function useMembershipForm() {
  const context = useContext(MembershipFormContext);
  if (context === undefined) {
    throw new Error('useMembershipForm must be used within a MembershipFormProvider');
  }
  return context;
}