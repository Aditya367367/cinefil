import { useState, useEffect } from "react";
import {
  BadgeDollarSign,
  BarChart3,
  CalendarRange,
  ChevronRight,
  Film,
  Home,
  IndianRupee,
  LayoutDashboard,
  ListChecks,
  ReceiptText,
  ShieldCheck,
  Users,
  FileText,
  Share2,
  UserCheck,
  ScrollText,
} from "lucide-react";
import AsyncCreatableSelect from 'react-select/async-creatable';
import type { Page } from "./Navbar";
import { filmService } from "@/services/filmService";
import { useAuth } from "../../context/AuthContext";
import { API_ROOT } from "../../services/api";
import { useActorSearch, useFilmSearch, useRightHolderMemberSearch } from "../../hooks/useSearch";
import { useSnackbar } from "../contexts/SnackbarContext";
import { DashboardPageSkeleton } from "./DashboardPageSkeleton";

type DashboardRole = "member";
type DashboardSection = "home" | "films" | "cast" | "documents" | "right-holders" | "shares" | "royalty-details" | "payments";

interface DashboardPageProps {
  role: DashboardRole;
  onNavigate: (page: Page) => void;
  initialSection?: DashboardSection;
}

interface FilmItem {
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

interface RoyaltyDetail {
  id: number;
  film_title: string;
  royalty_amount: string;
}

interface RoyaltyDistributionItem {
  id: number;
  financial_year_name: string;
  total_amount: string;
  calculated_total?: string | number;
  distribution_date: string;
  notes?: string;
  details?: RoyaltyDetail[];
}

interface SelectOption {
  value: string;
  label: string;
}

export function DashboardPage({ role, onNavigate, initialSection }: DashboardPageProps) {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [section, setSection] = useState<DashboardSection>(initialSection || "home");

  // Function to change section and update URL
  const changeSection = (newSection: DashboardSection) => {
    setSection(newSection);
    const dashboardPath = role === 'member' ? 'member-dashboard' : 'mentor-dashboard';
    const newPath = newSection === 'home' ? `/${dashboardPath}` : `/${dashboardPath}/${newSection}`;
    window.history.pushState({ section: newSection }, "", newPath);
  };

  // Sync URL with section on mount and popstate
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const path = window.location.pathname;
      const sectionMatch = path.match(/member-dashboard\/([^\/]+)/) || path.match(/mentor-dashboard\/([^\/]+)/);
      if (sectionMatch) {
        const newSection = sectionMatch[1] as DashboardSection;
        setSection(newSection);
      } else if (path.includes('member-dashboard') || path.includes('mentor-dashboard')) {
        setSection('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Set initial URL on mount
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

  // Extended film form state
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

  // Film share fields in film form
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

  useEffect(() => {
    if (user?.member_id && user?.full_name) {
      setNewFilmRightHolderMember({
        value: user.member_id.toString(),
        label: user.full_name,
      });
    }
  }, [user?.member_id, user?.full_name]);

  useEffect(() => {
    if (section === "films" && isMember) {
      fetchData();
    }
  }, [filmsPage, filmsPageSize]);

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
    setNewFilmRightHolderMember(null);
    setNewFilmRightHolderType("");
    setNewFilmRightHolderPercentage("");
    setFilmSharedWithNames("");
    setFilmSharePercentage("");
    setShowFilmModal(false);
  };

  const resetRightHolderForm = () => {
    setRightHolderFilm(null);
    setRightHolderMember(null);
    setRightHolderType("");
    setRightHolderPercentage("");
    setRightHolderFormError(null);
    setRightHolderFormSuccess(null);
  };

  const saveFilmDocument = async (filmId: number, documentType: string, file: File | null, documentId: number | null, originalDocumentType: string) => {
    // Only save if document type or file has changed
    if (!file && documentType === originalDocumentType) {
      return;
    }

    const buildFormData = () => {
      const formData = new FormData();
      formData.append("member_film", filmId.toString());
      if (documentType) {
        formData.append("document_type", documentType);
      }
      if (file) {
        formData.append("file", file);
        formData.append("file_name", file.name);
      }
      return formData;
    };

    const attemptSave = async (method: "POST" | "PUT", url: string) => {
      const res = await fetch(url, {
        method,
        credentials: "include",
        body: buildFormData(),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return { ok: false, status: res.status, errorText };
      }

      return { ok: true, status: res.status, errorText: "" };
    };

    if (documentId) {
      const updateResult = await attemptSave("PUT", `${API_ROOT}/documents/${documentId}/`);
      if (updateResult.ok) {
        return;
      }
      if (updateResult.status !== 404) {
        throw new Error(updateResult.errorText);
      }
    }

    const createResult = await attemptSave("POST", `${API_ROOT}/documents/`);
    if (!createResult.ok) {
      throw new Error(createResult.errorText);
    }
  };

  const syncFilmCast = async (filmId: number, castOptions: any[]) => {
    const existingCastRes = await fetch(`${API_ROOT}/cast-members/?member_film=${filmId}`, {
      credentials: "include",
    });

    if (existingCastRes.ok) {
      const existingCastData = await existingCastRes.json();
      const existingCastResults = existingCastData.results || existingCastData;
      for (const existingCast of existingCastResults) {
        await fetch(`${API_ROOT}/cast-members/${existingCast.id}/`, {
          method: "DELETE",
          credentials: "include",
        });
      }
    }

    for (const actorOption of castOptions) {
      const castRes = await fetch(`${API_ROOT}/cast-members/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          member_film: filmId,
          actor_id: Number(actorOption.value),
          character_name: actorOption.label,
        }),
      });

      if (!castRes.ok) {
        throw new Error(await castRes.text());
      }
    }
  };

  const syncFilmRightHolder = async (filmId: number) => {
    if (!newFilmRightHolderMember?.value || !newFilmRightHolderType.trim()) {
      return null;
    }

    const percentageValue = newFilmRightHolderPercentage ? parseFloat(newFilmRightHolderPercentage) : null;
    if (percentageValue !== null && (Number.isNaN(percentageValue) || percentageValue > 100)) {
      throw new Error("Ownership percentage cannot exceed 100.");
    }

    const existingHolderRes = await fetch(`${API_ROOT}/right-holders/?member_film=${filmId}`, {
      credentials: "include",
    });

    if (existingHolderRes.ok) {
      const existingHolderData = await existingHolderRes.json();
      const existingHolderResults = existingHolderData.results || existingHolderData;
      for (const existingHolder of existingHolderResults) {
        await fetch(`${API_ROOT}/right-holders/${existingHolder.id}/`, {
          method: "DELETE",
          credentials: "include",
        });
      }
    }

    const holderRes = await fetch(`${API_ROOT}/right-holders/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        member_film: filmId,
        member: Number(newFilmRightHolderMember.value),
        rights_holder_type: newFilmRightHolderType,
        ownership_percentage: percentageValue,
      }),
    });

    if (!holderRes.ok) {
      throw new Error(await holderRes.text());
    }

    return null;
  };

  const handleCreateRightHolder = async () => {
    setRightHolderFormError(null);
    setRightHolderFormSuccess(null);

    if (!rightHolderFilm?.value) {
      setRightHolderFormError("Member film is required.");
      return;
    }
    if (!rightHolderMember?.value) {
      setRightHolderFormError("Member is required.");
      return;
    }
    if (!rightHolderType.trim()) {
      setRightHolderFormError("Rights holder type is required.");
      return;
    }
    const percentageValue = rightHolderPercentage ? parseFloat(rightHolderPercentage) : null;
    if (percentageValue !== null && (Number.isNaN(percentageValue) || percentageValue > 100)) {
      setRightHolderFormError("Ownership percentage cannot exceed 100.");
      return;
    }

    setRightHolderSubmitting(true);
    try {
      const response = await fetch(`${API_ROOT}/right-holders/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          member_film: Number(rightHolderFilm.value),
          member: Number(rightHolderMember.value),
          rights_holder_type: rightHolderType,
          ownership_percentage: percentageValue,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

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

    return {
      cast: castData?.results || castData || [],
      documents: docData?.results || docData || [],
    };
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filmsRes = await filmService.getFilmsPaginated({ page: filmsPage, page_size: filmsPageSize });
      const royaltiesRes = await filmService.getMyRoyalties();

      // Set state
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

      // Fetch additional data
      const castRes = await fetch(`${API_ROOT}/cast-members/`, {
        credentials: 'include',
      });
      if (castRes.ok) {
        const castData = await castRes.json();
        setCastMembers(castData.results || castData);
      }

      const docRes = await fetch(`${API_ROOT}/documents/`, {
        credentials: 'include',
      });
      if (docRes.ok) {
        const docData = await docRes.json();
        setDocuments(docData.results || docData);
      }

      const holderRes = await fetch(`${API_ROOT}/right-holders/`, {
        credentials: "include",
      });
      if (holderRes.ok) {
        const holderData = await holderRes.json();
        setRightHolders(holderData.results || holderData);
      }

      const shareRes = await fetch(`${API_ROOT}/film-shares/`, {
        credentials: 'include',
      });
      if (shareRes.ok) {
        const shareData = await shareRes.json();
        setFilmShares(shareData.results || shareData);
      }

      const royaltyDetailRes = await fetch(`${API_ROOT}/royalty-details/`, {
        credentials: 'include',
      });
      if (royaltyDetailRes.ok) {
        const royaltyDetailData = await royaltyDetailRes.json();
        setRoyaltyDetails(royaltyDetailData.results || royaltyDetailData);
      }
    } catch (e) {
      console.error("Error fetching dashboard data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalSettled = royaltyDistributions.reduce((acc, curr) => acc + parseFloat(curr.total_amount), 0);
  const filmCount = filmsList.length;
  const isMember = user?.is_member === true || user?.role === 'member';
  const isPendingMember = user?.membership_status === 'pending';

  const title = "Member Dashboard";
  const subtitle = isMember
    ? "Manage producer and other owner summaries, film rights, and payment history."
    : "You are not yet an approved member. Complete the membership application to unlock member privileges.";

  const handleCreateFilm = async () => {
    if (!newFilmTitle.trim()) {
      showSnackbar("Film title is required.", "error");
      return;
    }
    if (!newFilmReleaseYear.trim() || Number.isNaN(Number(newFilmReleaseYear))) {
      showSnackbar("Valid release year is required.", "error");
      return;
    }

    setFilmSubmitting(true);
    try {
      const filmData: any = {
        title: newFilmTitle,
        language: newFilmLanguage,
        release_year: Number(newFilmReleaseYear),
        censor_certificate_no: newFilmCertificate,
      };

      // Add release date if provided
      if (newFilmReleaseDate) {
        filmData.release_date = newFilmReleaseDate;
      }

      const film = await filmService.createFilm(filmData);
      setFilmsList((prev) => [film, ...prev]);
      await syncFilmCast(film.id, newFilmCast);
      const rightHolderWarning = await syncFilmRightHolder(film.id);
      await saveFilmDocument(film.id, newFilmDocumentType, newFilmDocumentFile, null, "");

      // Create film shares if shared_with_names is provided
      console.log("=== FILM SHARE DEBUG: Creating shares for film ID:", film.id);
      console.log("=== FILM SHARE DEBUG: Share names:", filmSharedWithNames);
      console.log("=== FILM SHARE DEBUG: Share percentage:", filmSharePercentage);
      if (filmSharedWithNames.trim()) {
        const percentageValue = filmSharePercentage ? parseFloat(filmSharePercentage) : null;
        if (percentageValue !== null && (Number.isNaN(percentageValue) || percentageValue < 0 || percentageValue > 100)) {
          showSnackbar("Share percentage must be between 0 and 100.", "error");
          return;
        }

        // Split names by comma and create shares for each
        const names = filmSharedWithNames.split(',').map(n => n.trim()).filter(n => n);
        console.log("=== FILM SHARE DEBUG: Parsed names:", names);

        for (const name of names) {
          try {
            console.log("=== FILM SHARE DEBUG: Creating share for name:", name, "film ID:", film.id);
            const shareResponse = await fetch(`${API_ROOT}/film-shares/`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                film: film.id,
                shared_with_name: name,
                share_percentage: percentageValue,
              }),
            });

            if (!shareResponse.ok) {
              console.error("=== FILM SHARE DEBUG: Share creation failed for:", name);
              throw new Error(await shareResponse.text());
            }

            const createdShare = await shareResponse.json();
            console.log("=== FILM SHARE DEBUG: Share created successfully:", createdShare);
            setFilmShares((prev) => [createdShare, ...prev]);
          } catch (e: any) {
            console.error(`=== FILM SHARE DEBUG: Failed to create film share for ${name}:`, e);
            // Don't fail the entire film creation if share creation fails
          }
        }
      }

      // Reset form
      resetFilmForm();
      showSnackbar(rightHolderWarning ? `Film added successfully. ${rightHolderWarning}` : "Film added successfully.", "success");
    } catch (e: any) {
      showSnackbar(e.response?.data?.detail || e.message || "Failed to add film. Make sure you are an approved member.", "error");
    } finally {
      setFilmSubmitting(false);
    }
  };

  const handleEditFilm = async (film: FilmItem) => {
    try {
      const filmDetails = await filmService.getFilm(film.id);
      const relatedData = await fetchFilmRelations(film.id);
      // Always use relatedData.cast since it's properly filtered by member_film
      const castResults = relatedData.cast;
      const documentResults = filmDetails.documents?.length ? filmDetails.documents : relatedData.documents;
      const holderResults = filmDetails.right_holders?.length
        ? filmDetails.right_holders
        : rightHolders.filter((holder) => {
            const holderFilmId = typeof holder.member_film === "number" ? holder.member_film : holder.member_film?.id;
            return holderFilmId === film.id;
          });

      setEditingFilm(filmDetails);
      setNewFilmTitle(filmDetails.title || "");
      setNewFilmLanguage(filmDetails.language || "");
      setNewFilmReleaseYear(filmDetails.release_year?.toString() || "");
      setNewFilmCertificate(filmDetails.censor_certificate_no || "");
      setNewFilmReleaseDate(filmDetails.release_date || "");
      const actorOptions = castResults
          .map((c: any) => {
            const actorId = c.actor?.id ?? c.actor_id ?? c.id;
            const actorName = c.actor?.name ?? c.actor_name ?? c.character_name;
            return actorId && actorName ? { value: actorId.toString(), label: actorName } : null;
          })
          .filter(Boolean) as any[];
      setNewFilmCast(actorOptions);
      setNewFilmDocumentType(documentResults[0]?.document_type || "");
      setOriginalDocumentType(documentResults[0]?.document_type || "");
      setNewFilmDocumentName(documentResults[0]?.file_name || documentResults[0]?.file_url || "");
      setEditingDocumentId(documentResults[0]?.id || null);
      setNewFilmDocumentFile(null);
      setNewFilmRightHolderType(holderResults[0]?.rights_holder_type || "");
      setNewFilmRightHolderPercentage(holderResults[0]?.ownership_percentage?.toString() || "");
      setRightHolderFilm(filmDetails.title ? { value: filmDetails.id.toString(), label: filmDetails.title } : null);
      setRightHolderMember(holderResults[0]?.member
        ? {
            value: typeof holderResults[0].member === "number"
              ? holderResults[0].member.toString()
              : holderResults[0].member.id.toString(),
            label: holderResults[0]?.member_name || holderResults[0]?.member?.full_name || "",
          }
        : null);
      setRightHolderType(holderResults[0]?.rights_holder_type || "");
      setRightHolderPercentage(holderResults[0]?.ownership_percentage?.toString() || "");
      setShowFilmModal(true);

      // Populate film share fields
      console.log("=== FILM SHARE DEBUG: Loading shares for film ID:", film.id);
      const shareRes = await fetch(`${API_ROOT}/film-shares/?film=${film.id}`, {
        credentials: "include",
      });

      if (shareRes.ok) {
        const shareData = await shareRes.json();
        const shareResults = shareData.results || shareData;
        console.log("=== FILM SHARE DEBUG: Share results:", shareResults);
        if (shareResults.length > 0) {
          const names = shareResults.map((s: any) => s.shared_with_name).filter((n: any) => n).join(', ');
          console.log("=== FILM SHARE DEBUG: Setting share names:", names);
          console.log("=== FILM SHARE DEBUG: Setting share percentage:", shareResults[0].share_percentage);
          setFilmSharedWithNames(names);
          setFilmSharePercentage(shareResults[0].share_percentage?.toString() || "");
        } else {
          console.log("=== FILM SHARE DEBUG: No shares found, clearing fields");
          setFilmSharedWithNames("");
          setFilmSharePercentage("");
        }
      } else {
        console.log("=== FILM SHARE DEBUG: Failed to fetch shares, clearing fields");
        setFilmSharedWithNames("");
        setFilmSharePercentage("");
      }
    } catch (e) {
      console.error("Error fetching film details for editing", e);
      setEditingFilm(film);
      setNewFilmTitle(film.title);
      setNewFilmLanguage(film.language || "");
      setNewFilmReleaseYear(film.release_year?.toString() || "");
      setNewFilmCertificate(film.censor_certificate_no || "");
      setNewFilmReleaseDate(film.release_date || "");
    }
  };

  const handleUpdateFilm = async () => {
    if (!editingFilm) return;

    if (!newFilmTitle.trim()) {
      showSnackbar("Film title is required.", "error");
      return;
    }

    setFilmSubmitting(true);
    try {
      const filmData: any = {
        title: newFilmTitle,
        language: newFilmLanguage,
        release_year: Number(newFilmReleaseYear),
        censor_certificate_no: newFilmCertificate,
      };

      if (newFilmReleaseDate) {
        filmData.release_date = newFilmReleaseDate;
      }

      const updatedFilm = await filmService.updateFilm(editingFilm.id, filmData);
      setFilmsList((prev) => prev.map((f) => f.id === editingFilm.id ? updatedFilm : f));

      await syncFilmCast(editingFilm.id, newFilmCast);
      const rightHolderWarning = await syncFilmRightHolder(editingFilm.id);
      await saveFilmDocument(editingFilm.id, newFilmDocumentType, newFilmDocumentFile, editingDocumentId, originalDocumentType);

      // Update or create film shares if shared_with_names is provided
      if (filmSharedWithNames.trim()) {
        const percentageValue = filmSharePercentage ? parseFloat(filmSharePercentage) : null;
        if (percentageValue !== null && (Number.isNaN(percentageValue) || percentageValue < 0 || percentageValue > 100)) {
          showSnackbar("Share percentage must be between 0 and 100.", "error");
          return;
        }

        // Delete existing shares for this film
        const existingShareRes = await fetch(`${API_ROOT}/film-shares/?film=${editingFilm.id}`, {
          credentials: "include",
        });

        if (existingShareRes.ok) {
          const existingShareData = await existingShareRes.json();
          const existingShareResults = existingShareData.results || existingShareData;

          for (const existingShare of existingShareResults) {
            await fetch(`${API_ROOT}/film-shares/${existingShare.id}/`, {
              method: "DELETE",
              credentials: "include",
            });
          }
        }

        // Split names by comma and create shares for each
        const names = filmSharedWithNames.split(',').map(n => n.trim()).filter(n => n);

        for (const name of names) {
          try {
            const shareResponse = await fetch(`${API_ROOT}/film-shares/`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                film: editingFilm.id,
                shared_with_name: name,
                share_percentage: percentageValue,
              }),
            });

            if (!shareResponse.ok) {
              throw new Error(await shareResponse.text());
            }

            const createdShare = await shareResponse.json();
            setFilmShares((prev) => [createdShare, ...prev]);
          } catch (e: any) {
            console.error(`Failed to create film share for ${name}:`, e);
            // Don't fail the entire film update if share creation fails
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

  const handleCancelEdit = () => {
    resetFilmForm();
  };

  const handleDeleteFilm = (film: FilmItem) => {
    setFilmToDelete(film);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!filmToDelete) return;

    try {
      await filmService.deleteFilm(filmToDelete.id);
      setFilmsList((prev) => prev.filter((f) => f.id !== filmToDelete.id));
      setFilmsTotalCount(prev => Math.max(0, prev - 1));
      showSnackbar("Film deleted successfully.", "success");
      setShowDeleteModal(false);
      setFilmToDelete(null);
    } catch (e: any) {
      showSnackbar(e.response?.data?.detail || e.message || "Failed to delete film.", "error");
    }
  };

  const filmsTotalPages = Math.ceil(filmsTotalCount / filmsPageSize);

  const handleFilmsPageChange = (newPage: number) => {
    setFilmsPage(newPage);
  };

  if (isLoading) {
    return <DashboardPageSkeleton />;
  }

  // Generate summary cards dynamically
  const summaryCards = [
    { label: "Summary reports", value: royaltyDistributions.length.toString(), detail: "Active financial year summaries" },
    { label: "Films tracked", value: filmCount.toString(), detail: `${filmCount} films registered in catalog` },
    { label: "Total Settlement", value: `₹${totalSettled.toLocaleString('en-IN')}`, detail: "Dues settled to date" },
    { label: "Last Payment", value: royaltyDistributions.length > 0 ? `₹${parseFloat(royaltyDistributions[0].total_amount).toLocaleString('en-IN')}` : "₹0", detail: royaltyDistributions.length > 0 ? `Released on ${new Date(royaltyDistributions[0].distribution_date).toLocaleDateString()}` : "No payment released yet" },
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)]" style={{ fontFamily: "var(--font-body)", background: "#f8fafc" }}>
      <div className="mx-auto flex max-w-full gap-0 pb-6 pt-0 min-h-screen bg-slate-50">
        {/* Full-Screen Height Corner-Pinned Sidebar Grid Container */}
        <aside
          className="hidden w-[290px] shrink-0 p-6 lg:flex flex-col justify-between border-r border-slate-200/20"
          style={{ 
            background: "linear-gradient(180deg, #1e3a5f 0%, #1a304f 100%)", 
            boxShadow: "2px 0 10px rgba(0,0,0,0.08)" 
          }}
        >
          <div>
            <div className="mb-8 border-b border-white/10 pb-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300/80">Dashboard Suite</p>
              <h2 className="mt-2 text-xl font-black text-white tracking-tight">{title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-white/70 font-medium">{subtitle}</p>
            </div>

            <nav className="space-y-1.5">
              <button
                onClick={() => changeSection("home")}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  section === "home" 
                    ? "text-white bg-white/15 shadow-sm" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Home size={16} />
                <span>Home</span>
              </button>
              <button
                onClick={() => changeSection("films")}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  section === "films" 
                    ? "text-white bg-white/15 shadow-sm" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Film size={16} />
                <span>Films</span>
              </button>
              <button
                onClick={() => changeSection("payments")}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  section === "payments" 
                    ? "text-white bg-white/15 shadow-sm" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <IndianRupee size={16} />
                <span>Payment</span>
              </button>
            </nav>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/70">
            <div className="flex items-center gap-2 text-blue-300">
              <ShieldCheck size={14} strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Secure Access Matrix</span>
            </div>
            <p className="mt-2 text-[11px] font-medium leading-relaxed text-white/60">
              All summary, film, and payment records are shown in one workflow so members can review their royalty position quickly.
            </p>
          </div>
        </aside>

        {/* Content Workspace Area (Responsive Padding applied internally) */}
        <section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          
          {/* Mobile Overlay Top Navigation Block */}
          {/* Mobile Overlay Top Navigation Block */}
          <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs lg:hidden">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              Dashboard Workspace
            </p>
            <h2 className="mt-1 text-lg font-black text-gray-900 tracking-tight">{title}</h2>
            <p className="mt-1 text-xs text-gray-500 font-medium">{subtitle}</p>
            
            {/* Horizontal Scrollable Responsive Tags Container */}
            <div className="mt-4 flex flex-wrap items-center gap-2 pb-2 pt-0.5"> 
               {[ 
                 ["Home", "home", <Home size={14} />], 
                 ["Films", "films", <Film size={14} />], 
                //  ["Royalty", "royalty-details", <ScrollText size={14} />], 
                 ["Payment", "payments", <IndianRupee size={14} />], 
               ].map(([label, key, icon]) => { 
                 const isActive = section === key; 
                 return ( 
                   <button 
                     key={key as string} 
                     onClick={() => changeSection(key as DashboardSection)} 
                     className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ease-out active:scale-95" 
                     style={{ 
                       borderColor: isActive ? "#2563eb" : "rgba(15,23,42,0.08)", 
                       backgroundColor: isActive ? "#eff6ff" : "#f8fafc", 
                       color: isActive ? "#2563eb" : "#475569", 
                       boxShadow: isActive ? "0 2px 4px rgba(37,99,235,0.06)" : "none", 
                     }} 
                   >
                    <span className={isActive ? "text-blue-600" : "text-slate-400"}>
                      {icon}
                    </span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 lg:p-6 shadow-sm">
            <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Member area
                </p>
                <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
                <p className="mt-2 max-w-3xl text-xs sm:text-sm leading-relaxed text-gray-600">{subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3">
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-500">Current FY</p>
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-gray-900">2025-26</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3">
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-500">Member role</p>
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-gray-900 capitalize">{user?.membership_type_name || user?.role || "Producer"}</p>
                </div>
              </div>
            </div>

            {!isMember && (
              <div className="mb-4 sm:mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 sm:p-5 text-gray-800">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold">You are not an approved member yet.</p>
                    <p className="mt-2 text-xs sm:text-sm text-gray-600">
                      {isPendingMember
                        ? "Your membership application is pending review. Once it's approved, your dashboard will unlock full member access."
                        : "Your account is authenticated, but membership approval is required before dashboard features are unlocked."
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate("membership-form")}
                    className="inline-flex items-center justify-center rounded-lg bg-white px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-900 transition hover:bg-gray-100 border border-gray-200"
                  >
                    {isPendingMember ? "View application status" : "Open membership application"}
                  </button>
                </div>
              </div>
            )}

            {!isMember && (
              <div className="rounded-lg border border-gray-200 bg-white p-5 sm:p-8 text-center shadow-sm">
                <p className="text-xs sm:text-sm font-semibold text-gray-900">Member dashboard access is available after approval.</p>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">Please complete your membership application and wait for admin approval to unlock film registration, payment history, and royalty summaries.</p>
                <button
                  onClick={() => onNavigate("membership-form")}
                  className="mt-4 sm:mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {isPendingMember ? "View application status" : "Open membership application"}
                </button>
              </div>
            )}

            {section === "home" && isMember && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                  {summaryCards.map((card) => (
                    <div key={card.label} className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-2 sm:gap-3">
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-600">{card.label}</p>
                          <p className="mt-2 text-xl sm:text-2xl font-bold text-gray-900">{card.value}</p>
                        </div>
                        <span className="inline-flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shadow-sm">
                          <BarChart3 size={18} className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                        </span>
                      </div>
                      <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs leading-relaxed text-gray-500">{card.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 sm:gap-6 xl:grid-cols-[1.4fr_0.9fr]">
                  <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-2 sm:gap-3">
                      <div>
                        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-blue-600">
                          Summary report
                        </p>
                        <h3 className="mt-2 text-lg sm:text-xl font-bold text-gray-900">Royalty overview by film</h3>
                      </div>
                      <LayoutDashboard size={20} className="text-gray-400 w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </div>
                    <div className="mt-5 space-y-4">
                      {filmsList.slice(0, 3).map((film, index) => {
                        // Calculate ownership percentage from film shares (not right_holders)
                        console.log("=== OWNERSHIP DEBUG ===");
                        console.log("Film:", film.title, "ID:", film.id);
                        console.log("All film shares:", filmShares);
                        
                        // Find shares for this specific film
                        const filmSharesForFilm = filmShares.filter((share: any) => share.film === film.id);
                        console.log("Shares for this film:", filmSharesForFilm);
                        
                        const ownershipPercentage = filmSharesForFilm && filmSharesForFilm.length > 0
                          ? (typeof filmSharesForFilm[0].share_percentage === 'number'
                              ? filmSharesForFilm[0].share_percentage
                              : parseFloat(filmSharesForFilm[0].share_percentage || '0'))
                          : 100; // Default to 100% if no shares

                        console.log("Calculated ownership percentage:", ownershipPercentage);

                        return (
                          <div key={film.id} className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
                            <div className="flex items-start justify-between gap-2 sm:gap-3">
                              <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{film.title}</p>
                                <p className="mt-1 text-[10px] sm:text-sm text-gray-500 truncate">
                                  {film.cast && film.cast.length > 0 ? film.cast.map(c => c.actor_name).join(", ") : "Cast info not set"}
                                </p>
                              </div>
                              <span className="rounded-full bg-blue-50 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-blue-600 shrink-0">
                                {ownershipPercentage}%
                              </span>
                            </div>
                            <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3">
                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                                <div
                                  className="h-full rounded-full bg-blue-500"
                                  style={{
                                    width: `${Math.min(ownershipPercentage, 100)}%`,
                                  }}
                                />
                              </div>
                              <span className="text-[10px] sm:text-sm font-semibold text-gray-700 shrink-0">FY 2024-25</span>
                            </div>
                          </div>
                        );
                      })}
                      {filmsList.length === 0 && (
                        <p className="text-xs sm:text-sm text-gray-400 text-center py-3 sm:py-4">No films registered yet.</p>
                      )}
                      {filmsList.length > 0 && (
                        <button
                          onClick={() => changeSection("films")}
                          className="mt-3 sm:mt-4 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
                        >
                          View more films
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="inline-flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Users size={18} className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </span>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-blue-600">
                          Member mix
                        </p>
                        <h3 className="mt-1 text-base sm:text-lg font-bold text-gray-900">Cast and rights map</h3>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-4">
                      {[
                        "Producer split shown as 50% / 50% when a film has two producers",
                        "100% share appears when one member holds the full right",
                        "Cast and other names can be added alongside each film record",
                      ].map((point) => (
                        <div key={point} className="flex gap-2 sm:gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
                          <ListChecks size={18} className="mt-0.5 text-blue-600 w-4 h-4 sm:w-4.5 sm:h-4.5" />
                          <p className="text-xs sm:text-sm leading-relaxed text-gray-600">{point}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => changeSection("films")}
                      className="mt-4 sm:mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-blue-700 bg-blue-600"
                    >
                      Open film ledger
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

           {section === "films" && isMember && (
  <div className="space-y-4 sm:space-y-6 animate-fade-in">
    {/* Page Header Area */}
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
          <Film size={22} />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Film Rights & Allocation
          </p>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-0.5">
            Cast, Owners, & Royalty Management
          </h1>
        </div>
      </div>
      
      {!isMember ? null : (
        <button
          onClick={() => {
            setEditingFilm(null);
            // Clear your film form state metrics so it acts as a fresh addition frame
            setNewFilmTitle("");
            setNewFilmLanguage("");
            setNewFilmReleaseYear(new Date().getFullYear().toString());
            setNewFilmReleaseDate("");
            setNewFilmCertificate("");
            setNewFilmCast([]);
            setNewFilmDocumentType("");
            setNewFilmDocumentFile(null);
            setFilmSharedWithNames("");
            setFilmSharePercentage("");
            setShowFilmModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm w-fit shrink-0"
          type="button"
        >
          <span className="text-base font-normal">+</span>
          <span>Add New Film</span>
        </button>
      )}
    </div>

    {/* Non-Approved Member Warning Fallback */}
    {!isMember && (
      <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-gray-800 shadow-2xs">
        <p className="font-bold text-sm sm:text-base">Film registration is available only to approved members.</p>
        <p className="mt-2 text-xs sm:text-sm text-gray-600">
          {isPendingMember
            ? "Your membership application is pending. Once approved, you can add films here."
            : "Submit a membership application from the membership page to gain access."}
        </p>
        <button
          onClick={() => onNavigate("membership-form")}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-xs sm:text-sm font-bold text-gray-900 transition hover:bg-gray-100 border border-gray-200 shadow-2xs"
        >
          {isPendingMember ? "View membership status" : "Open membership application"}
        </button>
      </div>
    )}

    {/* Registered Film Catalog Ledger Grid View */}
  <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
  {/* Header Section */}
  <div className="flex items-center gap-2 mb-5">
    <BadgeDollarSign size={16} className="text-blue-600 shrink-0" />
    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
      Registered Film Ledger Catalogue
    </h3>
  </div>

  {/* Table / Card List Layout Container */}
  <div className="overflow-hidden rounded-xl bg-gray-50/50">
    
    {/* 1. DESKTOP VIEW: Native Standard HTML Table (Visible on lg screens and above) */}
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest border-b border-gray-800">
          <tr>
            <th className="p-4 pl-6">Film Production</th>
            <th className="p-4">Censor Cert No.</th>
            <th className="p-4">Core Language</th>
            <th className="p-4 text-center">Release Year</th>
            <th className="p-4 text-right pr-6">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-xs font-medium text-gray-700 bg-white">
          {filmsList.map((film) => (
            <tr key={film.id} className="hover:bg-gray-50/80 transition-colors">
              <td className="p-4 pl-6">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 text-sm tracking-tight">{film.title}</span>
                  <span className="mt-0.5 font-mono text-[10px] text-gray-400">
                    ID: #{film.id}
                  </span>
                </div>
              </td>
              <td className="p-4 font-mono text-gray-600 max-w-[180px] truncate">
                {film.censor_certificate_no || "—"}
              </td>
              <td className="p-4">
                <span className="inline-block rounded-lg border border-gray-200/50 bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-800">
                  {film.language || "N/A"}
                </span>
              </td>
              <td className="p-4 text-center font-semibold text-gray-600">
                {film.release_year || "—"}
              </td>
              <td className="p-4 text-right pr-6">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      handleEditFilm(film);
                      setShowFilmModal(true);
                    }}
                    className="inline-flex items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-600 border border-blue-200/60 text-blue-700 hover:text-white px-3.5 py-1.5 text-xs font-bold transition-all shadow-2xs"
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteFilm(film)}
                    className="inline-flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-600 border border-red-200/60 text-red-700 hover:text-white px-3.5 py-1.5 text-xs font-bold transition-all shadow-2xs"
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* 2. MOBILE & TABLET VIEW: Modern Card Component Matrix (Visible below lg screens) */}
    <div className="block lg:hidden divide-y divide-gray-200 bg-white">
      {filmsList.map((film) => (
        <div key={film.id} className="p-4 sm:p-5 hover:bg-gray-50/50 transition-colors space-y-4">
          
          {/* Card Header: Title & Edit Action Link */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="font-bold text-gray-900 text-sm sm:text-base tracking-tight break-words">
                {film.title}
              </h4>
              <p className="mt-0.5 font-mono text-[10px] text-gray-400">
                System Key: #{film.id}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  handleEditFilm(film);
                  setShowFilmModal(true);
                }}
                className="inline-flex items-center justify-center rounded-xl bg-blue-50 active:bg-blue-600 border border-blue-200/40 text-blue-700 active:text-white px-3.5 py-2 text-xs font-bold transition-all shrink-0"
                type="button"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteFilm(film)}
                className="inline-flex items-center justify-center rounded-xl bg-red-50 active:bg-red-600 border border-red-200/40 text-red-700 active:text-white px-3.5 py-2 text-xs font-bold transition-all shrink-0"
                type="button"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Card Attributes Grid Metadata Segment */}
          <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
            {/* Cert No. Column Box */}
            <div className="flex flex-col justify-center min-w-0 border-r border-gray-200/60 pr-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Censor No
              </span>
              <span className="font-mono text-[11px] text-gray-700 font-semibold truncate">
                {film.censor_certificate_no || "—"}
              </span>
            </div>

            {/* Language Column Box */}
            <div className="flex flex-col justify-center min-w-0 border-r border-gray-200/60 px-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Language
              </span>
              <span className="text-[11px] text-gray-800 font-bold truncate">
                {film.language || "N/A"}
              </span>
            </div>

            {/* Release Year Column Box */}
            <div className="flex flex-col justify-center min-w-0 pl-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Year
              </span>
              <span className="text-[11px] text-gray-600 font-bold">
                {film.release_year || "—"}
              </span>
            </div>
          </div>

        </div>
      ))}
    </div>

    {/* Empty State Fallback Registry */}
    {filmsList.length === 0 && (
      <div className="p-10 text-center bg-white">
        <div className="inline-flex p-3 rounded-full bg-gray-50 text-gray-400 mb-3 border border-gray-100">
          <Film size={20} />
        </div>
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          No matching entries found
        </p>
        <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto">
          No validated production streams matched the search scope inside your workspace.
        </p>
      </div>
    )}

    {/* Pagination Controls */}
    {filmsTotalPages > 1 && (
      <div className="mt-4 px-4 sm:px-6 lg:px-8 py-4 bg-white border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-gray-500">
            Showing {((filmsPage - 1) * filmsPageSize) + 1} to {Math.min(filmsPage * filmsPageSize, filmsTotalCount)} of {filmsTotalCount} films
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFilmsPageChange(filmsPage - 1)}
              disabled={filmsPage === 1}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(filmsTotalPages, 5) }, (_, i) => {
                let pageNum;
                if (filmsTotalPages <= 5) {
                  pageNum = i + 1;
                } else if (filmsPage <= 3) {
                  pageNum = i + 1;
                } else if (filmsPage >= filmsTotalPages - 2) {
                  pageNum = filmsTotalPages - 4 + i;
                } else {
                  pageNum = filmsPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handleFilmsPageChange(pageNum)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      filmsPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handleFilmsPageChange(filmsPage + 1)}
              disabled={filmsPage === filmsTotalPages}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    )}

  </div>
</div>

    {/* POPUP ACTION MODAL OVERLAY (FOR BOTH FILM CREATION & MODIFICATION) */}
    {showFilmModal && (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-300 animate-scale-up">
          
          {/* Modal Branding Header */}
          <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-600 text-white rounded-lg">
                <Film size={16} />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider">
                {editingFilm ? "Modify Film Parameter Entry" : "Register New Production Ledger"}
              </h3>
            </div>
            <button
              onClick={() => setShowFilmModal(false)}
              className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded-lg transition-colors text-sm font-bold"
              type="button"
            >
              ✕
            </button>
          </div>

          {/* Modal Form Interface Core */}
          <div className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
            
            {/* Context parameters preview box for correction lifecycles */}
            {editingFilm && (
              <div className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-700 sm:grid-cols-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Cast loaded</p>
                  <p className="mt-1 font-semibold text-gray-900 truncate">
                    {newFilmCast.length > 0 ? newFilmCast.map((actor) => actor.label).join(", ") : "No cast found"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Document loaded</p>
                  <p className="mt-1 font-semibold text-gray-900 truncate">
                    {newFilmDocumentType
                      ? `${newFilmDocumentType}${newFilmDocumentName ? ` · ${newFilmDocumentName}` : ""}`
                      : (newFilmDocumentName || "No document found")}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Rights loaded</p>
                  <p className="mt-1 font-semibold text-gray-900 truncate">
                    {newFilmRightHolderMember?.label
                      ? `${newFilmRightHolderMember.label}${newFilmRightHolderType ? ` · ${newFilmRightHolderType}` : ""}${newFilmRightHolderPercentage ? ` · ${newFilmRightHolderPercentage}%` : ""}`
                      : "No right holder found"}
                  </p>
                </div>
              </div>
            )}

            {/* Main Fields Grid Layout */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Film Title
                <div className="mt-1.5 normal-case tracking-normal font-normal text-sm">
                  <AsyncCreatableSelect
                    value={newFilmTitle ? { value: newFilmTitle, label: newFilmTitle } : null}
                    inputValue={newFilmTitle}
                    onInputChange={(inputValue, meta) => {
                      console.log("=== FILM INPUT DEBUG ===");
                      console.log("Input value:", inputValue);
                      console.log("Meta action:", meta.action);
                      if (meta.action === "input-change") {
                        setNewFilmTitle(inputValue);
                      }
                      return inputValue;
                    }}
                    onChange={(selectedOption) => {
                      console.log("=== FILM SELECT DEBUG ===");
                      console.log("Selected option:", selectedOption);
                      setNewFilmTitle(selectedOption?.label || "");
                    }}
                    loadOptions={loadFilmOptions}
                    onCreateOption={async (inputValue) => {
                      console.log("=== FILM CREATION DEBUG START ===");
                      console.log("Input value:", inputValue);
                      console.log("onCreateFilm function:", onCreateFilm);
                      try {
                        console.log("Calling onCreateFilm...");
                        const createdFilm = await onCreateFilm(inputValue);
                        console.log("Film created successfully:", createdFilm);
                        console.log("Setting new film title to:", createdFilm.label);
                        setNewFilmTitle(createdFilm.label);
                        showSnackbar(`Film "${inputValue}" created successfully.`, "success");
                        console.log("=== FILM CREATION DEBUG END (SUCCESS) ===");
                      } catch (error: any) {
                        console.error("=== FILM CREATION DEBUG END (ERROR) ===");
                        console.error("Error creating film:", error);
                        console.error("Error response:", error?.response);
                        console.error("Error data:", error?.response?.data);
                        console.error("Error status:", error?.response?.status);
                        console.log("Falling back to local creation");
                        setNewFilmTitle(inputValue);
                        showSnackbar(`Film "${inputValue}" added locally.`, "success");
                      }
                    }}
                    classNamePrefix="react-select"
                    placeholder="Search or create film title..."
                    noOptionsMessage={() => "Type to search film titles..."}
                    formatCreateLabel={(inputValue) => `Create new film: "${inputValue}"`}
                    isClearable
                  />
                </div>
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Language
                <input
                  value={newFilmLanguage}
                  onChange={(e) => setNewFilmLanguage(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-blue-500 normal-case tracking-normal"
                  placeholder="e.g. Hindi"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Release Year
                <input
                  type="number"
                  value={newFilmReleaseYear}
                  onChange={(e) => setNewFilmReleaseYear(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-mono font-bold text-gray-900 outline-none focus:border-blue-500 normal-case tracking-normal"
                  placeholder="2026"
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Release Date
                <input
                  type="date"
                  value={newFilmReleaseDate}
                  onChange={(e) => setNewFilmReleaseDate(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-blue-500 normal-case tracking-normal"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Censor Certificate Number
                <input
                  value={newFilmCertificate}
                  onChange={(e) => setNewFilmCertificate(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-mono font-semibold text-gray-900 outline-none focus:border-blue-500 normal-case tracking-normal"
                  placeholder="Certificate number"
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Cast Members
                <div className="mt-1.5 normal-case tracking-normal font-normal text-sm">
                  <AsyncCreatableSelect
                    isMulti
                    value={newFilmCast}
                    onChange={(selectedOptions) => setNewFilmCast(selectedOptions as any[])}
                    loadOptions={loadActorOptions}
                    onCreateOption={async (inputValue) => {
                      try {
                        const newActor = await onCreateActor(inputValue);
                        setNewFilmCast([...newFilmCast, newActor]);
                      } catch (error) {
                        console.error('Error creating actor:', error);
                      }
                    }}
                    classNamePrefix="react-select"
                    placeholder="Search or create actors..."
                    noOptionsMessage={() => "Type to search actors..."}
                    formatCreateLabel={(inputValue) => `Create new actor: "${inputValue}"`}
                    isClearable
                  />
                </div>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 border-t border-gray-100 pt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Document Type
                <select
                  value={newFilmDocumentType}
                  onChange={(e) => setNewFilmDocumentType(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-blue-500 normal-case tracking-normal"
                >
                  <option value="">Select document type</option>
                  <option value="Censor Certificate">Censor Certificate</option>
                  <option value="Agreement">Agreement</option>
                  <option value="License">License</option>
                  <option value="Contract">Contract</option>
                  <option value="Registration">Registration</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Upload Verification Document
                <input
                  type="file"
                  onChange={(e) => setNewFilmDocumentFile(e.target.files?.[0] || null)}
                  className="mt-1.5 w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                />
                {newFilmDocumentName && (
                  <div className="mt-2 text-[10px] font-medium bg-gray-50 border border-gray-100 px-2 py-1 rounded-md text-gray-500 truncate normal-case tracking-normal">
                    Saved record file: {newFilmDocumentName}
                  </div>
                )}
                {newFilmDocumentFile && (
                  <p className="mt-1 text-[10px] font-semibold text-blue-600 normal-case tracking-normal">
                    Staged selection: {newFilmDocumentFile.name}
                  </p>
                )}
              </label>
            </div>

            {/* Strategic Distribution Equity Block Segment */}
            <div className="rounded-xl border border-gray-200 bg-slate-50/60 p-4 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                <Share2 size={13} />
                <span>Film Royalty Allocation Shares</span>
              </p>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Share Names (Comma-Separated)
                  <input
                    type="text"
                    value={filmSharedWithNames}
                    onChange={(e) => setFilmSharedWithNames(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-blue-500 normal-case tracking-normal"
                    placeholder="e.g. Shyam Raj, Pooja Harish"
                  />
                  <p className="mt-1.5 text-[10px] text-gray-400 font-medium normal-case tracking-normal leading-tight">
                    Enter multiple custodians split by standard layout commas.
                  </p>
                </label>

                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Share Percentage (Ownership)
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filmSharePercentage}
                    onChange={(e) => setFilmSharePercentage(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-mono font-bold text-gray-900 outline-none focus:border-blue-500 normal-case tracking-normal"
                    placeholder="50"
                  />
                  <p className="mt-1.5 text-[10px] text-gray-400 font-medium normal-case tracking-normal leading-tight">
                    This dynamically handles right holder allocation mappings across inputs.
                  </p>
                </label>
              </div>

              <div className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Shared By Manager Account
                <input
                  value={user?.full_name || ""}
                  disabled
                  readOnly
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-100 px-3.5 py-2.5 text-xs font-bold text-gray-500 outline-none normal-case tracking-normal"
                />
              </div>
            </div>

            {/* Modal Actions Footer Hub Trigger Controls */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5 text-xs font-bold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => {
                  if (editingFilm) handleCancelEdit();
                  setShowFilmModal(false);
                }}
                className="px-4 py-2.5 rounded-xl text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={async (e) => {
                  // Re-wrap matching execution calls
                  if (editingFilm) {
                    await handleUpdateFilm(e);
                  } else {
                    await handleCreateFilm(e);
                  }
                  setShowFilmModal(false);
                }}
                disabled={filmSubmitting}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md disabled:opacity-50"
                type="button"
              >
                {filmSubmitting
                  ? (editingFilm ? "Updating..." : "Submitting...")
                  : (editingFilm ? "Update Film Data" : "Save Entry to Catalog")}
              </button>
            </div>

          </div>
        </div>
      </div>
    )}

    {/* Delete Confirmation Modal */}
    {showDeleteModal && filmToDelete && (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-300 animate-scale-up">
          <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between border-b border-red-700">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-white/20 text-white rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Confirm Film Deletion
              </h3>
            </div>
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setFilmToDelete(null);
              }}
              className="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors text-sm font-bold"
              type="button"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-bold text-red-900 mb-1">
                Warning: This action cannot be undone
              </p>
              <p className="text-xs text-red-700 leading-relaxed">
                You are about to permanently delete the film <span className="font-bold">"{filmToDelete.title}"</span> from your catalog. All associated data including cast, documents, and right holders will be removed.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 text-xs font-bold uppercase tracking-wider pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setFilmToDelete(null);
                }}
                className="px-4 py-2.5 rounded-xl text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors shadow-md"
                type="button"
              >
                Yes, Delete Film
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
)}
            {section === "payments" && isMember && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="inline-flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <ReceiptText size={18} className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </span>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-blue-600">
                      Payment history
                    </p>
                    <h3 className="mt-1 text-xl sm:text-2xl font-bold text-gray-900">Financial years and settlement records</h3>
                  </div>
                </div>

                <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {royaltyDistributions.map((dist) => (
                    <div key={dist.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-5 shadow-sm">
                      <div className="flex items-center justify-between gap-2 sm:gap-3">
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-gray-500">{dist.financial_year_name}</p>
                          <p className="mt-2 text-lg sm:text-xl font-bold text-gray-900">₹{parseFloat(String(dist.calculated_total || dist.total_amount || 0)).toLocaleString('en-IN')}</p>
                        </div>
                        <span className="rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold bg-emerald-100 text-emerald-800">
                          Released
                        </span>
                      </div>
                      <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs leading-relaxed text-gray-500">{dist.notes || "Annual distribution release"}</p>
                    </div>
                  ))}
                  {royaltyDistributions.length === 0 && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-5 col-span-4 text-center text-xs sm:text-sm text-gray-400">
                      No distribution data found.
                    </div>
                  )}
                </div>

                <div className="grid gap-4 sm:gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                    <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-5 py-3 sm:py-4">
                      <div className="flex items-center justify-between gap-2 sm:gap-3">
                        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-blue-600">
                          Royalty Distributions breakdown
                        </p>
                        <select
                          value={selectedFinancialYearFilter}
                          onChange={(e) => setSelectedFinancialYearFilter(e.target.value)}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All Financial Years</option>
                          {royaltyDistributions.map((dist) => (
                            <option key={dist.id} value={dist.financial_year_name}>
                              {dist.financial_year_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200 bg-white">
                      {royaltyDistributions
                        .filter(dist => selectedFinancialYearFilter === "all" || dist.financial_year_name === selectedFinancialYearFilter)
                        .flatMap(dist => dist.details || [])
                        .map((detail) => (
                        <div key={detail.id} className="grid grid-cols-12 gap-4 px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm items-center">
                          <div className="col-span-6 font-medium text-gray-900">
                            {detail.film_title}
                          </div>
                          <div className="col-span-6 text-right font-semibold text-emerald-600">
                            ₹{parseFloat(detail.royalty_amount).toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))}
                      {royaltyDistributions
                        .filter(dist => selectedFinancialYearFilter === "all" || dist.financial_year_name === selectedFinancialYearFilter)
                        .flatMap(dist => dist.details || []).length === 0 && (
                        <div className="p-4 sm:p-5 text-center text-xs sm:text-sm text-gray-400">
                          No ledger items for selected filter.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="inline-flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <CalendarRange size={18} className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </span>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-blue-600">
                          FY tracker
                        </p>
                        <h3 className="mt-1 text-base sm:text-lg font-bold text-gray-900">Financial year snapshot</h3>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-5 space-y-3">
                      {royaltyDistributions.map((dist) => (
                        <div key={dist.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                          <div>
                            <p className="text-xs sm:text-sm font-semibold text-gray-900">{dist.financial_year_name}</p>
                            <p className="text-[10px] sm:text-xs text-gray-500">Released on {new Date(dist.distribution_date).toLocaleDateString()}</p>
                          </div>
                          <BadgeDollarSign size={18} className="text-blue-600 w-4 h-4 sm:w-4.5 sm:h-4.5" />
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => onNavigate("profile")}
                      className="mt-4 sm:mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-xs sm:text-sm font-semibold transition hover:bg-gray-50"
                      style={{ borderColor: "rgba(15,23,42,0.12)", color: "rgb(30 41 59)" }}
                    >
                      Open profile
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {section === "cast" && isMember && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(201,162,39,0.12)] text-[var(--cinefil-gold)]">
                    <Users size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--cinefil-gold)" }}>
                      Cast Members
                    </p>
                    <h3 className="mt-1 text-2xl font-bold text-slate-900">Manage film cast</h3>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.75rem] border border-slate-200">
                  <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--cinefil-gold)" }}>
                      Cast Members List
                    </p>
                  </div>
                  <div className="divide-y divide-slate-200 bg-white">
                    {castMembers.map((cast) => (
                      <div key={cast.id} className="grid grid-cols-12 gap-4 px-5 py-4 text-sm items-center">
                        <div className="col-span-6 font-medium text-slate-900">
                          {cast.actor?.name || cast.character_name || 'Unknown'}
                        </div>
                        <div className="col-span-4 text-slate-600">
                          {cast.character_name || 'N/A'}
                        </div>
                        <div className="col-span-2 text-right text-slate-500">
                          {cast.member_film?.title || 'N/A'}
                        </div>
                      </div>
                    ))}
                    {castMembers.length === 0 && (
                      <div className="p-5 text-center text-sm text-slate-400">
                        No cast members found.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {section === "documents" && isMember && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(79,70,229,0.1)] text-[#4f46e5]">
                    <FileText size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--cinefil-gold)" }}>
                      Documents
                    </p>
                    <h3 className="mt-1 text-2xl font-bold text-slate-900">Censor certificates & film documents</h3>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.75rem] border border-slate-200">
                  <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--cinefil-gold)" }}>
                      Documents List
                    </p>
                  </div>
                  <div className="divide-y divide-slate-200 bg-white">
                    {documents.map((doc) => (
                      <div key={doc.id} className="grid grid-cols-12 gap-4 px-5 py-4 text-sm items-center">
                        <div className="col-span-4 font-medium text-slate-900">
                          {doc.document_type || 'Document'}
                        </div>
                        <div className="col-span-5 text-slate-600">
                          {doc.file_name || 'N/A'}
                        </div>
                        <div className="col-span-3 text-right text-slate-500">
                          {doc.member_film?.title || 'N/A'}
                        </div>
                      </div>
                    ))}
                    {documents.length === 0 && (
                      <div className="p-5 text-center text-sm text-slate-400">
                        No documents found.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {section === "right-holders" && isMember && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(244,63,159,0.1)] text-[#f43f9f]">
                    <UserCheck size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--cinefil-gold)" }}>
                      Right Holders
                    </p>
                    <h3 className="mt-1 text-2xl font-bold text-slate-900">Film rights ownership</h3>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--cinefil-gold)" }}>
                        Add right holder
                      </p>
                      <h4 className="mt-1 text-lg font-bold text-slate-900">Attach a member to a film</h4>
                    </div>
                    <button
                      onClick={resetRightHolderForm}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      type="button"
                    >
                      Reset
                    </button>
                  </div>

                  {rightHolderFormError && (
                    <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                      {rightHolderFormError}
                    </div>
                  )}
                  {rightHolderFormSuccess && (
                    <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                      {rightHolderFormSuccess}
                    </div>
                  )}

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Member film
                      <AsyncCreatableSelect
                        value={rightHolderFilm}
                        onChange={(option) => setRightHolderFilm(option as SelectOption | null)}
                        loadOptions={loadFilmOptions}
                        onCreateOption={async (inputValue) => {
                          try {
                            const createdFilm = await onCreateFilm(inputValue);
                            setRightHolderFilm(createdFilm);
                          } catch (error) {
                            console.error("Error creating film:", error);
                            setRightHolderFormError("Could not create film title.");
                          }
                        }}
                        className="mt-2"
                        classNamePrefix="react-select"
                        placeholder="Search or create film title..."
                        noOptionsMessage={() => "Type to search film titles..."}
                        formatCreateLabel={(inputValue) => `Create new film: "${inputValue}"`}
                        isClearable
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Member
                      <AsyncCreatableSelect
                        value={rightHolderMember}
                        onChange={(option) => setRightHolderMember(option as SelectOption | null)}
                        loadOptions={loadRightHolderMemberOptions}
                        onCreateOption={async (inputValue) => {
                          try {
                            const createdCompany = await onCreateRightHolderMember(inputValue);
                            setRightHolderMember(createdCompany);
                            setRightHolderFormSuccess("Company created successfully.");
                            setRightHolderFormError(null);
                          } catch (error) {
                            console.error("Error creating company:", error);
                            setRightHolderFormError("Failed to create company.");
                          }
                        }}
                        className="mt-2"
                        classNamePrefix="react-select"
                        placeholder="Search member/company..."
                        noOptionsMessage={() => "Type to search member/company links..."}
                        formatCreateLabel={(inputValue) => `Create new company: "${inputValue}"`}
                        isClearable
                      />
                    </label>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Rights holder type
                      <input
                        value={rightHolderType}
                        onChange={(e) => setRightHolderType(e.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--cinefil-gold)]"
                        placeholder="Producer, Director, etc."
                      />
                    </label>
                            <label className="block text-sm font-medium text-slate-700">
                              Ownership percentage
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={rightHolderPercentage}
                                onChange={(e) => setRightHolderPercentage(e.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--cinefil-gold)]"
                                placeholder="50"
                              />
                    </label>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={handleCreateRightHolder}
                      disabled={rightHolderSubmitting}
                      className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-600 disabled:opacity-50"
                      type="button"
                    >
                      {rightHolderSubmitting ? "Saving..." : "Add right holder"}
                    </button>
                    <button
                      onClick={resetRightHolderForm}
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                      type="button"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.75rem] border border-slate-200">
                  <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--cinefil-gold)" }}>
                      Right Holders List
                    </p>
                  </div>
                  <div className="divide-y divide-slate-200 bg-white">
                    {rightHolders.map((holder) => (
                      <div key={holder.id} className="grid grid-cols-12 gap-4 px-5 py-4 text-sm items-center">
                        <div className="col-span-4 font-medium text-slate-900">
                          {holder.member_name || holder.member?.full_name || 'Unknown'}
                        </div>
                        <div className="col-span-4 text-slate-600">
                          {holder.rights_holder_type || 'N/A'}
                        </div>
                        <div className="col-span-2 text-center text-slate-700">
                          {holder.ownership_percentage ? `${holder.ownership_percentage}%` : 'N/A'}
                        </div>
                        <div className="col-span-2 text-right text-slate-500">
                          {holder.member_film?.title || 'N/A'}
                        </div>
                      </div>
                    ))}
                    {rightHolders.length === 0 && (
                      <div className="p-5 text-center text-sm text-slate-400">
                        No right holders found.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {section === "shares" && isMember && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(34,197,94,0.1)] text-[#22c55e]">
                    <Share2 size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--cinefil-gold)" }}>
                      Film Shares
                    </p>
                    <h3 className="mt-1 text-2xl font-bold text-slate-900">Shared films with other members</h3>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.75rem] border border-slate-200">
                  <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--cinefil-gold)" }}>
                      Film Shares List
                    </p>
                  </div>
                  <div className="divide-y divide-slate-200 bg-white">
                    {filmShares.map((share) => (
                      <div key={share.id} className="grid grid-cols-12 gap-4 px-5 py-4 text-sm items-center">
                        <div className="col-span-4 font-medium text-slate-900">
                          {share.film_title || share.film?.title || 'Unknown'}
                        </div>
                        <div className="col-span-4 text-slate-600">
                          {share.shared_with_name || share.shared_with?.full_name || 'Unknown'}
                        </div>
                        <div className="col-span-2 text-center">
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${share.permission === 'edit' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                            {share.permission || 'view'}
                          </span>
                        </div>
                        <div className="col-span-2 text-right text-slate-500">
                          {new Date(share.shared_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                    {filmShares.length === 0 && (
                      <div className="p-5 text-center text-sm text-slate-400">
                        No film shares found.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {section === "royalty-details" && isMember && (
  <div className="space-y-6 sm:space-y-8 animate-fade-in">
    {/* Section Branding Header block */}
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
          <ScrollText size={22} className="stroke-[2]" />
        </span>
        <div>
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest" style={{ color: "var(--cinefil-gold)" }}>
            Royalty Distribution
          </p>
          <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Royalty Ledger Statements <span className="text-slate-400 font-medium text-xs sm:text-sm tracking-normal">(Read-Only)</span>
          </h1>
        </div>
      </div>

      {/* Aggregate Financial Performance Highlight Badge */}
      <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl px-4 py-2 flex flex-col items-start md:items-end shrink-0">
        <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-600">Total Cleared Distributions</span>
        <span className="text-base sm:text-lg font-black text-emerald-700 tracking-tight mt-0.5">
          ₹{royaltyDetails.reduce((acc, curr) => acc + parseFloat(curr.royalty_amount || "0"), 0).toLocaleString('en-IN')}
        </span>
      </div>
    </div>

    {/* Primary Data Ledger Panel */}
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      {/* Table Header Section */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500">
            Audited Statement Registry
          </p>
        </div>
        <span className="text-[10px] bg-slate-200 text-slate-700 font-mono font-bold px-2 py-0.5 rounded-md">
          {royaltyDetails.length} Entries
        </span>
      </div>

      {/* Fully Fluid Responsive Ledger Matrix */}
      <div className="divide-y divide-slate-100">
        {/* Hidden Table Header Block for Desktop Contexts */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50/50 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">
          <div className="col-span-5">Film Production Title</div>
          <div className="col-span-4">Fiscal Audit Window</div>
          <div className="col-span-3 text-right">Disbursed Balance Weight</div>
        </div>

        {royaltyDetails.map((detail) => (
          <div 
            key={detail.id} 
            className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 sm:p-6 md:px-6 md:py-4 items-center hover:bg-slate-50/60 transition-colors"
          >
            {/* Column 1: Film Production Context Details */}
            <div className="col-span-1 md:col-span-5 flex items-center gap-2.5 min-w-0">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0 hidden md:block"></div>
              <div className="truncate">
                <p className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
                  {detail.film_title || detail.member_film?.title || 'Unknown Production Stream'}
                </p>
                <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1 py-0.2 rounded md:hidden mt-1 inline-block">
                  Ref ID: #{detail.id}
                </span>
              </div>
            </div>

            {/* Column 2: Audit Window Metadata */}
            <div className="col-span-1 md:col-span-4 flex items-center gap-1.5 md:gap-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 md:hidden">Cycle:</span>
              <p className="text-xs text-slate-600 font-semibold tracking-tight">
                {detail.distribution?.financial_year?.financial_year || 'N/A Verification Cycle'}
              </p>
            </div>

            {/* Column 3: Amount Values */}
            <div className="col-span-1 md:col-span-3 text-left md:text-right flex items-center justify-between md:justify-end border-t border-slate-100 md:border-t-0 pt-2.5 md:pt-0 mt-1 md:mt-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 md:hidden">Disbursed Weight:</span>
              <p className="text-sm sm:text-base font-black text-emerald-600 font-mono tracking-tight bg-emerald-50/40 md:bg-transparent px-2.5 py-1 md:p-0 rounded-lg">
                ₹{parseFloat(detail.royalty_amount || "0").toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        ))}

        {/* Empty Directory Fallback Configuration */}
        {royaltyDetails.length === 0 && (
          <div className="p-12 text-center bg-white">
            <ScrollText className="mx-auto h-8 w-8 text-slate-300 stroke-[1.5]" />
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mt-3">Zero Transaction History</p>
            <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs mx-auto">
              No individual legal settlement allocation balances have been returned during your active checking lifecycle.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
)}
          </div>
        </section>
      </div>
    </div>
  );
}