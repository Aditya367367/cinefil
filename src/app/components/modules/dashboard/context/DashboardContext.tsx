import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { filmService } from "@/services/filmService";
import { useAuth } from "../../../../../context/AuthContext";
import { API_ROOT } from "../../../../../services/api";
import { useActorSearch, useFilmSearch, useRightHolderMemberSearch } from "../../../../../hooks/useSearch";
import { useSnackbar } from "../../../../contexts/SnackbarContext";

export type DashboardRole = "member";
export type DashboardSection = "home" | "films" | "cast" | "documents" | "right-holders" | "shares" | "royalty-details" | "payments" | "membership-details";

export interface FilmItem {
  id: number;
  title: string;
  language: string;
  release_year: number;
  release_date?: string;
  censor_certificate_no?: string;
  cast?: Array<{ id: number; actor_name: string; character_name: string }>;
  documents?: Array<{ id: number; document_type?: string; file_name?: string; file_url?: string }>;
  right_holders?: Array<{
    id: number;
    member?: { id: number; full_name: string } | number;
    member_name?: string;
    rights_holder_type?: string;
    ownership_percentage?: string | number | null;
  }>;
  shares?: Array<{
    id: number;
    shared_with_name?: string;
    share_percentage?: string | number | null;
  }>;
}

export interface RoyaltyDetail {
  id: number;
  film_title: string;
  royalty_amount: string;
}

export interface RoyaltyDistributionItem {
  id: number;
  financial_year_name: string;
  total_amount: string;
  calculated_total?: string | number;
  distribution_date: string;
  notes?: string;
  details?: RoyaltyDetail[];
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface DashboardContextType {
  role: DashboardRole;
  section: DashboardSection;
  changeSection: (newSection: DashboardSection) => void;
  isLoading: boolean;

  user: any;
  isMember: boolean;
  isPendingMember: boolean;

  filmsList: FilmItem[];
  setFilmsList: React.Dispatch<React.SetStateAction<FilmItem[]>>;
  royaltyDistributions: RoyaltyDistributionItem[];
  filmsTotalCount: number;
  filmsPage: number;
  filmsPageSize: number;
  handleFilmsPageChange: (newPage: number) => void;

  castMembers: any[];
  documents: any[];
  rightHolders: any[];
  setRightHolders: React.Dispatch<React.SetStateAction<any[]>>;
  filmShares: any[];
  royaltyDetails: any[];

  // Film form state
  newFilmTitle: string;
  setNewFilmTitle: React.Dispatch<React.SetStateAction<string>>;
  newFilmLanguage: string;
  setNewFilmLanguage: React.Dispatch<React.SetStateAction<string>>;
  newFilmReleaseYear: string;
  setNewFilmReleaseYear: React.Dispatch<React.SetStateAction<string>>;
  newFilmCertificate: string;
  setNewFilmCertificate: React.Dispatch<React.SetStateAction<string>>;
  newFilmReleaseDate: string;
  setNewFilmReleaseDate: React.Dispatch<React.SetStateAction<string>>;
  newFilmCast: any[];
  setNewFilmCast: React.Dispatch<React.SetStateAction<any[]>>;
  
  newFilmProducerName: string;
  setNewFilmProducerName: React.Dispatch<React.SetStateAction<string>>;
  newFilmDirectorName: string;
  setNewFilmDirectorName: React.Dispatch<React.SetStateAction<string>>;
  newFilmDuration: string;
  setNewFilmDuration: React.Dispatch<React.SetStateAction<string>>;

  censorDocFile: File | null;
  setCensorDocFile: React.Dispatch<React.SetStateAction<File | null>>;
  censorDocName: string;
  setCensorDocName: React.Dispatch<React.SetStateAction<string>>;
  censorDocUrl: string;
  setCensorDocUrl: React.Dispatch<React.SetStateAction<string>>;
  censorDocId: number | null;
  setCensorDocId: React.Dispatch<React.SetStateAction<number | null>>;

  copyrightDocFile: File | null;
  setCopyrightDocFile: React.Dispatch<React.SetStateAction<File | null>>;
  copyrightDocName: string;
  setCopyrightDocName: React.Dispatch<React.SetStateAction<string>>;
  copyrightDocUrl: string;
  setCopyrightDocUrl: React.Dispatch<React.SetStateAction<string>>;
  copyrightDocId: number | null;
  setCopyrightDocId: React.Dispatch<React.SetStateAction<number | null>>;

  ownershipDocFile: File | null;
  setOwnershipDocFile: React.Dispatch<React.SetStateAction<File | null>>;
  ownershipDocName: string;
  setOwnershipDocName: React.Dispatch<React.SetStateAction<string>>;
  ownershipDocUrl: string;
  setOwnershipDocUrl: React.Dispatch<React.SetStateAction<string>>;
  ownershipDocId: number | null;
  setOwnershipDocId: React.Dispatch<React.SetStateAction<number | null>>;

  isViewOnly: boolean;
  setIsViewOnly: React.Dispatch<React.SetStateAction<boolean>>;

  newFilmDocumentType: string;
  setNewFilmDocumentType: React.Dispatch<React.SetStateAction<string>>;
  newFilmDocumentName: string;
  setNewFilmDocumentName: React.Dispatch<React.SetStateAction<string>>;
  newFilmDocumentFile: File | null;
  setNewFilmDocumentFile: React.Dispatch<React.SetStateAction<File | null>>;
  newFilmRightHolderMember: SelectOption | null;
  setNewFilmRightHolderMember: React.Dispatch<React.SetStateAction<SelectOption | null>>;
  newFilmRightHolderType: string;
  setNewFilmRightHolderType: React.Dispatch<React.SetStateAction<string>>;
  newFilmRightHolderPercentage: string;
  setNewFilmRightHolderPercentage: React.Dispatch<React.SetStateAction<string>>;
  filmSharedWithNames: string;
  setFilmSharedWithNames: React.Dispatch<React.SetStateAction<string>>;
  filmSharePercentage: string;
  setFilmSharePercentage: React.Dispatch<React.SetStateAction<string>>;

  editingFilm: FilmItem | null;
  showFilmModal: boolean;
  setShowFilmModal: React.Dispatch<React.SetStateAction<boolean>>;
  filmSubmitting: boolean;

  // Right Holder Form State
  rightHolderFilm: SelectOption | null;
  setRightHolderFilm: React.Dispatch<React.SetStateAction<SelectOption | null>>;
  rightHolderMember: SelectOption | null;
  setRightHolderMember: React.Dispatch<React.SetStateAction<SelectOption | null>>;
  rightHolderType: string;
  setRightHolderType: React.Dispatch<React.SetStateAction<string>>;
  rightHolderPercentage: string;
  setRightHolderPercentage: React.Dispatch<React.SetStateAction<string>>;
  rightHolderFormError: string | null;
  rightHolderFormSuccess: string | null;
  rightHolderSubmitting: boolean;

  // Others
  selectedFinancialYearFilter: string;
  setSelectedFinancialYearFilter: React.Dispatch<React.SetStateAction<string>>;
  showDeleteModal: boolean;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  filmToDelete: FilmItem | null;

  // Search Hooks
  loadActorOptions: any;
  onCreateActor: any;
  loadFilmOptions: any;
  onCreateFilm: any;
  loadRightHolderMemberOptions: any;
  onCreateRightHolderMember: any;

  // Handlers
  fetchData: () => Promise<void>;
  resetFilmForm: () => void;
  resetRightHolderForm: () => void;
  handleCreateFilm: () => Promise<void>;
  handleEditFilm: (film: FilmItem) => Promise<void>;
  handleUpdateFilm: () => Promise<void>;
  handleCancelEdit: () => void;
  handleDeleteFilm: (film: FilmItem) => void;
  handleConfirmDelete: () => Promise<void>;
  handleCreateRightHolder: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children, role, initialSection = "home" }: { children: ReactNode; role: DashboardRole; initialSection?: DashboardSection }) {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [section, setSection] = useState<DashboardSection>(initialSection);

  useEffect(() => {
    if (initialSection) {
      setSection(initialSection);
    }
  }, [initialSection]);

  const changeSection = (newSection: DashboardSection) => {
    setSection(newSection);
    const dashboardPath = role === 'member' ? 'member-dashboard' : 'mentor-dashboard';
    const newPath = newSection === 'home' ? `/${dashboardPath}` : `/${dashboardPath}/${newSection}`;
    window.history.pushState({ section: newSection }, "", newPath);
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const sectionMatch = path.match(/member-dashboard\/([^\/]+)/) || path.match(/mentor-dashboard\/([^\/]+)/);
      if (sectionMatch) {
        setSection(sectionMatch[1] as DashboardSection);
      } else if (path.includes('member-dashboard') || path.includes('mentor-dashboard')) {
        setSection('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const dashboardPath = role === 'member' ? 'member-dashboard' : 'mentor-dashboard';
    const currentPath = window.location.pathname;
    const expectedPath = section === 'home' ? `/${dashboardPath}` : `/${dashboardPath}/${section}`;
    if (currentPath !== expectedPath) {
      window.history.replaceState({ section }, "", expectedPath);
    }
  }, [section, role]);

  const [filmsList, setFilmsList] = useState<FilmItem[]>([]);
  const [royaltyDistributions, setRoyaltyDistributions] = useState<RoyaltyDistributionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newFilmTitle, setNewFilmTitle] = useState("");
  const [newFilmLanguage, setNewFilmLanguage] = useState("");
  const [newFilmReleaseYear, setNewFilmReleaseYear] = useState<string>("");
  const [newFilmCertificate, setNewFilmCertificate] = useState("");
  const [filmSubmitting, setFilmSubmitting] = useState<boolean>(false);
  const [castMembers, setCastMembers] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [rightHolders, setRightHolders] = useState<any[]>([]);
  const [filmShares, setFilmShares] = useState<any[]>([]);
  const [royaltyDetails, setRoyaltyDetails] = useState<any[]>([]);

  const [newFilmReleaseDate, setNewFilmReleaseDate] = useState<string>("");
  const [newFilmCast, setNewFilmCast] = useState<any[]>([]);
  const [newFilmDocumentType, setNewFilmDocumentType] = useState<string>("");
  const [newFilmDocumentName, setNewFilmDocumentName] = useState<string>("");
  const [newFilmDocumentFile, setNewFilmDocumentFile] = useState<File | null>(null);
  const [editingDocumentId, setEditingDocumentId] = useState<number | null>(null);
  const [originalDocumentType, setOriginalDocumentType] = useState<string>("");
  const [newFilmRightHolderMember, setNewFilmRightHolderMember] = useState<SelectOption | null>(null);
  const [newFilmRightHolderType, setNewFilmRightHolderType] = useState<string>("");
  const [newFilmRightHolderPercentage, setNewFilmRightHolderPercentage] = useState<string>("");
  const [editingFilm, setEditingFilm] = useState<FilmItem | null>(null);

  const [newFilmProducerName, setNewFilmProducerName] = useState("");
  const [newFilmDirectorName, setNewFilmDirectorName] = useState("");
  const [newFilmDuration, setNewFilmDuration] = useState("");

  const [censorDocFile, setCensorDocFile] = useState<File | null>(null);
  const [censorDocName, setCensorDocName] = useState("");
  const [censorDocUrl, setCensorDocUrl] = useState("");
  const [censorDocId, setCensorDocId] = useState<number | null>(null);

  const [copyrightDocFile, setCopyrightDocFile] = useState<File | null>(null);
  const [copyrightDocName, setCopyrightDocName] = useState("");
  const [copyrightDocUrl, setCopyrightDocUrl] = useState("");
  const [copyrightDocId, setCopyrightDocId] = useState<number | null>(null);

  const [ownershipDocFile, setOwnershipDocFile] = useState<File | null>(null);
  const [ownershipDocName, setOwnershipDocName] = useState("");
  const [ownershipDocUrl, setOwnershipDocUrl] = useState("");
  const [ownershipDocId, setOwnershipDocId] = useState<number | null>(null);

  const [isViewOnly, setIsViewOnly] = useState<boolean>(false);

  const [filmSharedWithNames, setFilmSharedWithNames] = useState<string>("");
  const [filmSharePercentage, setFilmSharePercentage] = useState<string>("");

  const [rightHolderFilm, setRightHolderFilm] = useState<SelectOption | null>(null);
  const [rightHolderMember, setRightHolderMember] = useState<SelectOption | null>(null);
  const [rightHolderType, setRightHolderType] = useState<string>("");
  const [rightHolderPercentage, setRightHolderPercentage] = useState<string>("");
  const [rightHolderFormError, setRightHolderFormError] = useState<string | null>(null);
  const [rightHolderFormSuccess, setRightHolderFormSuccess] = useState<string | null>(null);
  const [rightHolderSubmitting, setRightHolderSubmitting] = useState<boolean>(false);
  const [selectedFinancialYearFilter, setSelectedFinancialYearFilter] = useState<string>("all");
  const [showFilmModal, setShowFilmModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [filmToDelete, setFilmToDelete] = useState<FilmItem | null>(null);
  const [filmsPage, setFilmsPage] = useState(1);
  const [filmsPageSize] = useState(10);
  const [filmsTotalCount, setFilmsTotalCount] = useState(0);

  const { loadOptions: loadActorOptions, onCreateOption: onCreateActor } = useActorSearch();
  const { loadOptions: loadFilmOptions, onCreateOption: onCreateFilm } = useFilmSearch();
  const { loadOptions: loadRightHolderMemberOptions, onCreateOption: onCreateRightHolderMember } = useRightHolderMemberSearch();

  const isMember = user?.is_member === true || user?.role === 'member';
  const isPendingMember = user?.membership_status === 'pending';

  useEffect(() => {
    if (user?.member_id && user?.full_name) {
      setNewFilmRightHolderMember({
        value: user.member_id.toString(),
        label: user.full_name,
      });
    }
  }, [user?.member_id, user?.full_name]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filmsRes = await filmService.getFilmsPaginated({ page: filmsPage, page_size: filmsPageSize });
      const royaltiesRes = await filmService.getMyRoyalties();

      if (filmsRes.results) {
        setFilmsList(filmsRes.results);
        setFilmsTotalCount(filmsRes.count || 0);
      } else {
        setFilmsList(filmsRes);
        setFilmsTotalCount(filmsRes.length || 0);
      }

      if (royaltiesRes.success && royaltiesRes.distributions) {
        setRoyaltyDistributions(royaltiesRes.distributions);
      }

      const [castRes, docRes, holderRes, shareRes, royaltyDetailRes] = await Promise.all([
        fetch(`${API_ROOT}/cast-members/`, { credentials: 'include' }),
        fetch(`${API_ROOT}/documents/`, { credentials: 'include' }),
        fetch(`${API_ROOT}/right-holders/`, { credentials: 'include' }),
        fetch(`${API_ROOT}/film-shares/`, { credentials: 'include' }),
        fetch(`${API_ROOT}/royalty-details/`, { credentials: 'include' })
      ]);

      if (castRes.ok) setCastMembers((await castRes.json()).results || await castRes.json());
      if (docRes.ok) setDocuments((await docRes.json()).results || await docRes.json());
      if (holderRes.ok) setRightHolders((await holderRes.json()).results || await holderRes.json());
      if (shareRes.ok) setFilmShares((await shareRes.json()).results || await shareRes.json());
      if (royaltyDetailRes.ok) setRoyaltyDetails((await royaltyDetailRes.json()).results || await royaltyDetailRes.json());
    } catch (e) {
      console.error("Error fetching dashboard data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (section === "films" && isMember) {
      fetchData();
    }
  }, [filmsPage, filmsPageSize, section, isMember]);

  useEffect(() => {
    fetchData();
  }, []);

  const resetFilmForm = () => {
    setEditingFilm(null);
    setEditingDocumentId(null);
    setOriginalDocumentType("");
    setNewFilmTitle("");
    setNewFilmLanguage("");
    setNewFilmReleaseYear("");
    setNewFilmCertificate("");
    setNewFilmReleaseDate("");
    setNewFilmCast([]);
    setNewFilmDocumentType("");
    setNewFilmDocumentName("");
    setNewFilmDocumentFile(null);
    setNewFilmRightHolderMember(user?.member_id && user?.full_name ? { value: user.member_id.toString(), label: user.full_name } : null);
    setNewFilmRightHolderType("");
    setNewFilmRightHolderPercentage("");
    setFilmSharedWithNames("");
    setFilmSharePercentage("");
    setShowFilmModal(false);

    setNewFilmProducerName("");
    setNewFilmDirectorName("");
    setNewFilmDuration("");

    setCensorDocFile(null);
    setCensorDocName("");
    setCensorDocUrl("");
    setCensorDocId(null);

    setCopyrightDocFile(null);
    setCopyrightDocName("");
    setCopyrightDocUrl("");
    setCopyrightDocId(null);

    setOwnershipDocFile(null);
    setOwnershipDocName("");
    setOwnershipDocUrl("");
    setOwnershipDocId(null);

    setIsViewOnly(false);
  };

  const resetRightHolderForm = () => {
    setRightHolderFilm(null);
    setRightHolderMember(null);
    setRightHolderType("");
    setRightHolderPercentage("");
    setRightHolderFormError(null);
    setRightHolderFormSuccess(null);
  };

  const saveFilmDocument = async (filmId: number, documentType: string, file: File | null, documentId: number | null) => {
    if (!file) return;

    const buildFormData = () => {
      const formData = new FormData();
      formData.append("member_film", filmId.toString());
      formData.append("document_type", documentType);
      formData.append("file", file);
      formData.append("file_name", file.name);
      return formData;
    };

    if (documentId) {
      const res = await fetch(`${API_ROOT}/documents/${documentId}/`, {
        method: "PUT",
        credentials: "include",
        body: buildFormData()
      });
      if (res.ok) return;
      if (res.status !== 404) throw new Error(await res.text());
    }

    const res = await fetch(`${API_ROOT}/documents/`, {
      method: "POST",
      credentials: "include",
      body: buildFormData()
    });
    if (!res.ok) throw new Error(await res.text());
  };

  const syncFilmCast = async (filmId: number, castOptions: any[]) => {
    const existingCastRes = await fetch(`${API_ROOT}/cast-members/?member_film=${filmId}`, { credentials: "include" });
    if (existingCastRes.ok) {
      const existingCastData = await existingCastRes.json();
      const existingCastResults = existingCastData.results || existingCastData;
      for (const existingCast of existingCastResults) {
        await fetch(`${API_ROOT}/cast-members/${existingCast.id}/`, { method: "DELETE", credentials: "include" });
      }
    }
    for (const actorOption of castOptions) {
      const castRes = await fetch(`${API_ROOT}/cast-members/`, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_film: filmId, actor_id: Number(actorOption.value), character_name: actorOption.label }),
      });
      if (!castRes.ok) throw new Error(await castRes.text());
    }
  };

  const syncFilmRightHolder = async (filmId: number) => {
    if (!newFilmRightHolderMember?.value || !newFilmRightHolderType.trim()) return null;
    const percentageValue = newFilmRightHolderPercentage ? parseFloat(newFilmRightHolderPercentage) : null;
    if (percentageValue !== null && (Number.isNaN(percentageValue) || percentageValue > 100)) throw new Error("Ownership percentage cannot exceed 100.");

    const existingHolderRes = await fetch(`${API_ROOT}/right-holders/?member_film=${filmId}`, { credentials: "include" });
    if (existingHolderRes.ok) {
      const existingHolderData = await existingHolderRes.json();
      const existingHolderResults = existingHolderData.results || existingHolderData;
      for (const existingHolder of existingHolderResults) {
        await fetch(`${API_ROOT}/right-holders/${existingHolder.id}/`, { method: "DELETE", credentials: "include" });
      }
    }
    const holderRes = await fetch(`${API_ROOT}/right-holders/`, {
      method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ member_film: filmId, member: Number(newFilmRightHolderMember.value), rights_holder_type: newFilmRightHolderType, ownership_percentage: percentageValue }),
    });
    if (!holderRes.ok) throw new Error(await holderRes.text());
    return null;
  };

  const handleCreateRightHolder = async () => {
    setRightHolderFormError(null); setRightHolderFormSuccess(null);
    if (!rightHolderFilm?.value) return setRightHolderFormError("Member film is required.");
    if (!rightHolderMember?.value) return setRightHolderFormError("Member is required.");
    if (!rightHolderType.trim()) return setRightHolderFormError("Rights holder type is required.");
    const percentageValue = rightHolderPercentage ? parseFloat(rightHolderPercentage) : null;
    if (percentageValue !== null && (Number.isNaN(percentageValue) || percentageValue > 100)) return setRightHolderFormError("Ownership percentage cannot exceed 100.");

    setRightHolderSubmitting(true);
    try {
      const response = await fetch(`${API_ROOT}/right-holders/`, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_film: Number(rightHolderFilm.value), member: Number(rightHolderMember.value), rights_holder_type: rightHolderType, ownership_percentage: percentageValue }),
      });
      if (!response.ok) throw new Error(await response.text());
      const created = await response.json();
      setRightHolders((prev) => [created, ...prev]);
      resetRightHolderForm();
      setRightHolderFormSuccess("Right holder added successfully.");
    } catch (e: any) {
      setRightHolderFormError(e.message || "Failed to add right holder.");
    } finally {
      setRightHolderSubmitting(false);
    }
  };

  const fetchFilmRelations = async (filmId: number) => {
    const [castRes, docRes] = await Promise.all([
      fetch(`${API_ROOT}/cast-members/?member_film=${filmId}`, { credentials: "include" }),
      fetch(`${API_ROOT}/documents/?member_film=${filmId}`, { credentials: "include" }),
    ]);
    const [castData, docData] = await Promise.all([
      castRes.ok ? castRes.json() : Promise.resolve([]),
      docRes.ok ? docRes.json() : Promise.resolve([]),
    ]);
    return { cast: castData?.results || castData || [], documents: docData?.results || docData || [] };
  };

  const handleCreateFilm = async () => {
    if (!newFilmTitle.trim()) return showSnackbar("Film title is required.", "error");
    if (!newFilmReleaseYear.trim() || Number.isNaN(Number(newFilmReleaseYear))) return showSnackbar("Valid release year is required.", "error");

    if (filmSharedWithNames.trim()) {
      const percentageValue = filmSharePercentage ? parseFloat(filmSharePercentage) : null;
      if (percentageValue !== null) {
        if (Number.isNaN(percentageValue) || percentageValue < 0 || percentageValue > 100) {
          return showSnackbar("Share percentage must be between 0 and 100.", "error");
        }
        const names = filmSharedWithNames.split(',').map(n => n.trim()).filter(n => n);
        if (percentageValue * names.length > 100) {
          return showSnackbar(`Total share percentage cannot exceed 100%. Each of the ${names.length} names gets ${percentageValue}%, totaling ${percentageValue * names.length}%.`, "error");
        }
      }
    }

    setFilmSubmitting(true);
    try {
      const filmData: any = { 
        title: newFilmTitle, 
        language: newFilmLanguage, 
        release_year: Number(newFilmReleaseYear), 
        censor_certificate_no: newFilmCertificate,
        producer_name: newFilmProducerName,
        director_name: newFilmDirectorName,
        duration: newFilmDuration
      };
      if (newFilmReleaseDate) filmData.release_date = newFilmReleaseDate;

      const film = await filmService.createFilm(filmData);
      setFilmsList((prev) => [film, ...prev]);
      await syncFilmCast(film.id, newFilmCast);
      const rightHolderWarning = await syncFilmRightHolder(film.id);
      await saveFilmDocument(film.id, 'censor_certificate', censorDocFile, censorDocId);
      await saveFilmDocument(film.id, 'copyright_certificate', copyrightDocFile, copyrightDocId);
      await saveFilmDocument(film.id, 'ownership_document', ownershipDocFile, ownershipDocId);

      if (filmSharedWithNames.trim()) {
        const percentageValue = filmSharePercentage ? parseFloat(filmSharePercentage) : null;
        if (percentageValue !== null && (Number.isNaN(percentageValue) || percentageValue < 0 || percentageValue > 100)) return showSnackbar("Share percentage must be between 0 and 100.", "error");

        const names = filmSharedWithNames.split(',').map(n => n.trim()).filter(n => n);
        for (const name of names) {
          try {
            const shareResponse = await fetch(`${API_ROOT}/film-shares/`, {
              method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ film: film.id, shared_with_name: name, share_percentage: percentageValue }),
            });
            if (!shareResponse.ok) throw new Error(await shareResponse.text());
            const createdShare = await shareResponse.json();
            setFilmShares((prev) => [createdShare, ...prev]);
          } catch (e: any) {
            console.error(`Failed to create film share for ${name}:`, e);
          }
        }
      }

      resetFilmForm();
      showSnackbar(rightHolderWarning ? `Film added successfully. ${rightHolderWarning}` : "Film added successfully.", "success");
    } catch (e: any) {
      showSnackbar(e.response?.data?.detail || e.message || "Failed to add film.", "error");
    } finally {
      setFilmSubmitting(false);
    }
  };

  const handleEditFilm = async (film: FilmItem) => {
    try {
      const filmDetails = await filmService.getFilm(film.id);
      const relatedData = await fetchFilmRelations(film.id);
      const castResults = relatedData.cast;
      const documentResults = filmDetails.documents?.length ? filmDetails.documents : relatedData.documents;
      const holderResults = filmDetails.right_holders?.length ? filmDetails.right_holders : rightHolders.filter((holder) => (typeof holder.member_film === "number" ? holder.member_film : holder.member_film?.id) === film.id);

      setEditingFilm(filmDetails);
      setNewFilmTitle(filmDetails.title || "");
      setNewFilmLanguage(filmDetails.language || "");
      setNewFilmReleaseYear(filmDetails.release_year?.toString() || "");
      setNewFilmCertificate(filmDetails.censor_certificate_no || "");
      setNewFilmReleaseDate(filmDetails.release_date || "");
      setNewFilmProducerName(filmDetails.producer_name || "");
      setNewFilmDirectorName(filmDetails.director_name || "");
      setNewFilmDuration(filmDetails.duration || "");

      const censorDoc = documentResults.find((d: any) => {
        const type = d.document_type?.toLowerCase() || "";
        return type === 'censor_certificate' || type === 'censor certificate' || type.includes('censor');
      });
      const copyrightDoc = documentResults.find((d: any) => {
        const type = d.document_type?.toLowerCase() || "";
        return type === 'copyright_certificate' || type === 'copyright certificate' || type.includes('copyright') || type === 'agreement' || type === 'license' || type === 'contract' || type === 'registration';
      });
      const ownershipDoc = documentResults.find((d: any) => {
        const type = d.document_type?.toLowerCase() || "";
        return type === 'ownership_document' || type === 'ownership documents' || type === 'ownership document' || type.includes('ownership') || type === 'other';
      });


      setCensorDocId(censorDoc?.id || null);
      setCensorDocName(censorDoc?.file_name || "");
      setCensorDocUrl(censorDoc?.file || censorDoc?.file_url || "");
      setCensorDocFile(null);

      setCopyrightDocId(copyrightDoc?.id || null);
      setCopyrightDocName(copyrightDoc?.file_name || "");
      setCopyrightDocUrl(copyrightDoc?.file || copyrightDoc?.file_url || "");
      setCopyrightDocFile(null);

      setOwnershipDocId(ownershipDoc?.id || null);
      setOwnershipDocName(ownershipDoc?.file_name || "");
      setOwnershipDocUrl(ownershipDoc?.file || ownershipDoc?.file_url || "");
      setOwnershipDocFile(null);

      const actorOptions = castResults.map((c: any) => {
        const actorId = c.actor?.id ?? c.actor_id ?? c.id;
        const actorName = c.actor?.name ?? c.actor_name ?? c.character_name;
        return actorId && actorName ? { value: actorId.toString(), label: actorName } : null;
      }).filter(Boolean) as any[];
      setNewFilmCast(actorOptions);
      setNewFilmDocumentType(documentResults[0]?.document_type || "");
      setOriginalDocumentType(documentResults[0]?.document_type || "");
      setNewFilmDocumentName(documentResults[0]?.file_name || documentResults[0]?.file_url || "");
      setEditingDocumentId(documentResults[0]?.id || null);
      setNewFilmDocumentFile(null);
      setNewFilmRightHolderType(holderResults[0]?.rights_holder_type || "");
      setNewFilmRightHolderPercentage(holderResults[0]?.ownership_percentage?.toString() || "");
      setRightHolderFilm(filmDetails.title ? { value: filmDetails.id.toString(), label: filmDetails.title } : null);
      setRightHolderMember(holderResults[0]?.member ? { value: typeof holderResults[0].member === "number" ? holderResults[0].member.toString() : holderResults[0].member.id.toString(), label: holderResults[0]?.member_name || holderResults[0]?.member?.full_name || "" } : null);
      setRightHolderType(holderResults[0]?.rights_holder_type || "");
      setRightHolderPercentage(holderResults[0]?.ownership_percentage?.toString() || "");
      setShowFilmModal(true);

      const shareRes = await fetch(`${API_ROOT}/film-shares/?film=${film.id}`, { credentials: "include" });
      if (shareRes.ok) {
        const shareData = await shareRes.json();
        const shareResults = shareData.results || shareData;
        if (shareResults.length > 0) {
          setFilmSharedWithNames(shareResults.map((s: any) => s.shared_with_name).filter((n: any) => n).join(', '));
          setFilmSharePercentage(shareResults[0].share_percentage?.toString() || "");
        } else {
          setFilmSharedWithNames(""); setFilmSharePercentage("");
        }
      } else {
        setFilmSharedWithNames(""); setFilmSharePercentage("");
      }
    } catch (e) {
      console.error("Error fetching film details", e);
      setEditingFilm(film); setNewFilmTitle(film.title); setNewFilmLanguage(film.language || ""); setNewFilmReleaseYear(film.release_year?.toString() || ""); setNewFilmCertificate(film.censor_certificate_no || ""); setNewFilmReleaseDate(film.release_date || "");
    }
  };

  const handleUpdateFilm = async () => {
    if (!editingFilm) return;
    if (!newFilmTitle.trim()) return showSnackbar("Film title is required.", "error");

    if (filmSharedWithNames.trim()) {
      const percentageValue = filmSharePercentage ? parseFloat(filmSharePercentage) : null;
      if (percentageValue !== null) {
        if (Number.isNaN(percentageValue) || percentageValue < 0 || percentageValue > 100) {
          return showSnackbar("Share percentage must be between 0 and 100.", "error");
        }
        const names = filmSharedWithNames.split(',').map(n => n.trim()).filter(n => n);
        if (percentageValue * names.length > 100) {
          return showSnackbar(`Total share percentage cannot exceed 100%. Each of the ${names.length} names gets ${percentageValue}%, totaling ${percentageValue * names.length}%.`, "error");
        }
      }
    }

    setFilmSubmitting(true);
    try {
      const filmData: any = { 
        title: newFilmTitle, 
        language: newFilmLanguage, 
        release_year: Number(newFilmReleaseYear), 
        censor_certificate_no: newFilmCertificate,
        producer_name: newFilmProducerName,
        director_name: newFilmDirectorName,
        duration: newFilmDuration
      };
      if (newFilmReleaseDate) filmData.release_date = newFilmReleaseDate;

      const updatedFilm = await filmService.updateFilm(editingFilm.id, filmData);
      setFilmsList((prev) => prev.map((f) => f.id === editingFilm.id ? updatedFilm : f));

      await syncFilmCast(editingFilm.id, newFilmCast);
      const rightHolderWarning = await syncFilmRightHolder(editingFilm.id);
      await saveFilmDocument(editingFilm.id, 'censor_certificate', censorDocFile, censorDocId);
      await saveFilmDocument(editingFilm.id, 'copyright_certificate', copyrightDocFile, copyrightDocId);
      await saveFilmDocument(editingFilm.id, 'ownership_document', ownershipDocFile, ownershipDocId);

      if (filmSharedWithNames.trim()) {
        const percentageValue = filmSharePercentage ? parseFloat(filmSharePercentage) : null;
        if (percentageValue !== null && (Number.isNaN(percentageValue) || percentageValue < 0 || percentageValue > 100)) return showSnackbar("Share percentage must be between 0 and 100.", "error");

        const existingShareRes = await fetch(`${API_ROOT}/film-shares/?film=${editingFilm.id}`, { credentials: "include" });
        if (existingShareRes.ok) {
          const existingShareData = await existingShareRes.json();
          for (const existingShare of (existingShareData.results || existingShareData)) {
            await fetch(`${API_ROOT}/film-shares/${existingShare.id}/`, { method: "DELETE", credentials: "include" });
          }
        }

        const names = filmSharedWithNames.split(',').map(n => n.trim()).filter(n => n);
        for (const name of names) {
          try {
            const shareResponse = await fetch(`${API_ROOT}/film-shares/`, {
              method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ film: editingFilm.id, shared_with_name: name, share_percentage: percentageValue }),
            });
            if (!shareResponse.ok) throw new Error(await shareResponse.text());
            const createdShare = await shareResponse.json();
            setFilmShares((prev) => [createdShare, ...prev]);
          } catch (e: any) {
            console.error(`Failed to create film share for ${name}:`, e);
          }
        }
      }

      resetFilmForm();
      showSnackbar(rightHolderWarning ? `Film updated successfully. ${rightHolderWarning}` : "Film updated successfully.", "success");
    } catch (e: any) {
      showSnackbar(e.response?.data?.detail || e.message || "Failed to update film.", "error");
    } finally {
      setFilmSubmitting(false);
    }
  };

  const handleCancelEdit = () => resetFilmForm();

  const handleDeleteFilm = (film: FilmItem) => {
    setFilmToDelete(film);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!filmToDelete) return;
    const isLastFilm = filmsList.length === 1;
    try {
      await filmService.deleteFilm(filmToDelete.id);
      setFilmsList((prev) => prev.filter((f) => f.id !== filmToDelete.id));
      setFilmsTotalCount(prev => Math.max(0, prev - 1));
      showSnackbar("Film deleted successfully.", "success");
      setShowDeleteModal(false);
      setFilmToDelete(null);
      
      if (isLastFilm) {
        // Membership is revoked, force redirect to membership form
        setTimeout(() => {
          window.location.href = "/membership-form";
        }, 500);
      }
    } catch (e: any) {
      showSnackbar(e.response?.data?.detail || e.message || "Failed to delete film.", "error");
    }
  };

  const handleFilmsPageChange = (newPage: number) => setFilmsPage(newPage);

  const value: DashboardContextType = {
    role, section, changeSection, isLoading, user, isMember, isPendingMember,
    filmsList, setFilmsList, royaltyDistributions, filmsTotalCount, filmsPage, filmsPageSize, handleFilmsPageChange,
    castMembers, documents, rightHolders, setRightHolders, filmShares, royaltyDetails,
    newFilmTitle, setNewFilmTitle, newFilmLanguage, setNewFilmLanguage, newFilmReleaseYear, setNewFilmReleaseYear,
    newFilmCertificate, setNewFilmCertificate, newFilmReleaseDate, setNewFilmReleaseDate, newFilmCast, setNewFilmCast,
    
    newFilmProducerName, setNewFilmProducerName, newFilmDirectorName, setNewFilmDirectorName, newFilmDuration, setNewFilmDuration,
    censorDocFile, setCensorDocFile, censorDocName, setCensorDocName, censorDocUrl, setCensorDocUrl, censorDocId, setCensorDocId,
    copyrightDocFile, setCopyrightDocFile, copyrightDocName, setCopyrightDocName, copyrightDocUrl, setCopyrightDocUrl, copyrightDocId, setCopyrightDocId,
    ownershipDocFile, setOwnershipDocFile, ownershipDocName, setOwnershipDocName, ownershipDocUrl, setOwnershipDocUrl, ownershipDocId, setOwnershipDocId,
    isViewOnly, setIsViewOnly,

    newFilmDocumentType, setNewFilmDocumentType, newFilmDocumentName, setNewFilmDocumentName, newFilmDocumentFile, setNewFilmDocumentFile,
    newFilmRightHolderMember, setNewFilmRightHolderMember, newFilmRightHolderType, setNewFilmRightHolderType, newFilmRightHolderPercentage, setNewFilmRightHolderPercentage,
    filmSharedWithNames, setFilmSharedWithNames, filmSharePercentage, setFilmSharePercentage,
    editingFilm, showFilmModal, setShowFilmModal, filmSubmitting,
    rightHolderFilm, setRightHolderFilm, rightHolderMember, setRightHolderMember, rightHolderType, setRightHolderType,
    rightHolderPercentage, setRightHolderPercentage, rightHolderFormError, rightHolderFormSuccess, rightHolderSubmitting,
    selectedFinancialYearFilter, setSelectedFinancialYearFilter, showDeleteModal, setShowDeleteModal, filmToDelete,
    loadActorOptions, onCreateActor, loadFilmOptions, onCreateFilm, loadRightHolderMemberOptions, onCreateRightHolderMember,
    fetchData, resetFilmForm, resetRightHolderForm, handleCreateFilm, handleEditFilm, handleUpdateFilm, handleCancelEdit, handleDeleteFilm, handleConfirmDelete, handleCreateRightHolder
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
