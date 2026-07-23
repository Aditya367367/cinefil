import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  CalendarRange,
  Edit3,
  Eye,
  Lock,
  MapPin,
  Save,
  BadgeCheck,
  UserRound,
  ChevronRight,
  X,
  Film,
  FileText,
  Award,
  AlertCircle,
  Globe,
  ExternalLink,
  Crown,
  ShieldCheck,
  Mail,
  Phone,
  Building2,
  Sparkles,
  Share2,
  CheckCircle2,
} from "lucide-react";
import type { Page } from "./Navbar";
import { Footer } from "./Footer";
import { useAuth } from "../../../context/AuthContext";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { authService } from "../../../services/authService";
import { memberService } from "../../../services/memberService";
import { handleApiError } from "../../../utils/errorHandler";

interface ProfilePageProps {
  onNavigate: (page: Page) => void;
}

type ProfileDraft = {
  name: string;
  role: string;
  headline: string;
  location: string;
  dob: string;
  about: string;
  phone: string;
  photo?: File | null;
  username: string;
};

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user: loggedInUser, refreshProfile } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const [minimumLoading, setMinimumLoading] = useState(true);

  const [draft, setDraft] = useState<ProfileDraft>({
    name: "",
    role: "",
    headline: "",
    location: "",
    dob: "",
    about: "",
    phone: "",
    photo: null,
    username: "",
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  const isOwnProfile = !!(
    loggedInUser &&
    profileUser &&
    (
      loggedInUser.member_id === profileUser.id ||
      loggedInUser.email === profileUser.email ||
      (profileUser.slug && (profileUser.slug === loggedInUser.member_slug || profileUser.slug === loggedInUser.slug))
    )
  );

  useEffect(() => {
    const pathname = window.location.pathname;
    const slug = pathname.split("/").pop();

    const loggedInSlug = loggedInUser
      ? loggedInUser.member_slug ||
        loggedInUser.slug ||
        `${loggedInUser.username || loggedInUser.id}-${loggedInUser.id}`
      : null;

    const isSelf =
      !slug ||
      slug === "profile" ||
      (loggedInUser &&
        (slug === loggedInSlug ||
          slug === loggedInUser.member_slug ||
          slug === loggedInUser.slug ||
          slug === loggedInUser.username ||
          slug === String(loggedInUser.id) ||
          slug === String(loggedInUser.member_id)));

    const targetSlug = !slug || slug === "profile" ? loggedInSlug : slug;

    if (targetSlug) {
      if (
        !profileUser ||
        (profileUser.slug !== targetSlug &&
          String(profileUser.id) !== targetSlug &&
          profileUser.username !== targetSlug &&
          (!isSelf || profileUser.id !== loggedInUser?.member_id))
      ) {
        memberService
          .getMemberBySlug(targetSlug)
          .then((data) => setProfileUser(data))
          .catch((err) => {
            console.error("Failed to load member profile by slug", err);
            if (isSelf) {
              if (loggedInUser?.member_id) {
                memberService
                  .getMember(loggedInUser.member_id)
                  .then((data) => setProfileUser(data))
                  .catch((e) => {
                    console.error("Failed to load member profile by ID", e);
                    setProfileUser(loggedInUser);
                  });
              } else {
                setProfileUser(loggedInUser);
              }
            } else {
              setProfileNotFound(true);
            }
          });
      }
    } else if (loggedInUser) {
      setProfileUser(loggedInUser);
    }

    if (isSelf && loggedInSlug) {
      const profileUrl = `/profile/${loggedInSlug}`;
      if (pathname !== profileUrl) {
        window.history.replaceState({}, "", profileUrl);
      }
    }

    const timer = setTimeout(() => {
      setMinimumLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [loggedInUser, profileUser]);

  useEffect(() => {
    if (profileUser) {
      setDraft({
        name: profileUser.full_name || "",
        role: profileUser.role || "member",
        headline: profileUser.role_title || "",
        location: profileUser.location || "Mumbai, India",
        dob: profileUser.dob || "June 17, 2004",
        about: profileUser.biography || "",
        phone: profileUser.phone || "",
        photo: null,
        username: profileUser.username || profileUser.generated_username || profileUser.slug || "",
      });
    }
  }, [profileUser]);

  const openEditor = () => {
    if (profileUser) {
      setDraft({
        name: profileUser.full_name || "",
        role: profileUser.role || "member",
        headline: profileUser.role_title || "",
        location: profileUser.location || "Mumbai, India",
        dob: profileUser.dob || "June 17, 2004",
        about: profileUser.biography || "",
        phone: profileUser.phone || "",
        photo: null,
        username: profileUser.username || profileUser.generated_username || profileUser.slug || "",
      });
      setEditOpen(true);
    }
  };

  const saveEditor = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("full_name", draft.name);
      formData.append("role_title", draft.headline);
      formData.append("biography", draft.about);
      formData.append("phone", draft.phone);
      if (draft.photo) {
        formData.append("photo", draft.photo);
      }
      formData.append("location", draft.location);
      formData.append("dob", draft.dob);
      formData.append("username", draft.username);

      const response = await authService.updateProfile(formData);

      setProfileUser(response.member);
      await refreshProfile();
      setEditOpen(false);
      showSnackbar("Profile updated successfully!", "success");
      setPhotoPreview(null);
    } catch (e) {
      showSnackbar(handleApiError(e), "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (profileNotFound && !profileUser && !minimumLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl space-y-5">
          <div className="mx-auto w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-100">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Profile Not Found</h2>
          <p className="text-sm text-slate-500 font-medium">
            The requested member profile could not be resolved or the member does not exist in our systems.
          </p>
          <button
            onClick={() => onNavigate("home" as any)}
            className="w-full py-3 bg-[#1e3a5f] hover:bg-slate-800 text-white font-bold rounded-xl transition shadow-sm"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (!profileUser || minimumLoading) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-48 bg-slate-200 rounded-3xl animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl space-y-4 animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-20 bg-slate-200 rounded w-full" />
            </div>
            <div className="bg-white p-6 rounded-3xl space-y-4 animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-1/2" />
              <div className="h-10 bg-slate-200 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isPrime = profileUser.is_prime || profileUser.is_member_prime || loggedInUser?.is_prime;

  // Check access control for Officer-only profiles
  const profileIsOfficer = profileUser.is_membership_executive || profileUser.is_rights_verification_officer || profileUser.is_legal_officer || profileUser.is_ceo_authorised_officer || profileUser.is_membership_committee_member || ['admin', 'membership_executive', 'rights_verification_officer', 'legal_officer', 'ceo', 'membership_committee'].includes(profileUser.role || '');
  const profileIsMember = profileUser.is_member === true || profileUser.membership_status === 'approved' || profileUser.role === 'member';

  const isOfficerOnly = profileIsOfficer && !profileIsMember;
  const isAccessBlocked = isOfficerOnly && !isOwnProfile;

  if (isAccessBlocked) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl space-y-5">
          <div className="mx-auto w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-100">
            <Lock size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Private Profile</h2>
          <p className="text-sm text-slate-500 font-medium">
            This profile belongs to an administrator/officer and is not publicly accessible.
          </p>
          <button
            onClick={() => onNavigate("home" as any)}
            className="w-full py-3 bg-[#1e3a5f] hover:bg-slate-800 text-white font-bold rounded-xl transition shadow-sm"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Cover Header Banner */}
      <div className="relative bg-gradient-to-r from-[#1e3a5f] via-[#0f2540] to-[#1e3a5f] text-white pt-12 pb-24 px-4 sm:px-8 overflow-hidden">
        {/* Abstract Background Design Elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#c5a059]/10 blur-3xl" />
        
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <button
            onClick={() => onNavigate("home" as any)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-xl backdrop-blur-md transition"
          >
            <ArrowLeft size={14} /> Back to Society Portal
          </button>

          <div className="flex items-center gap-2">
            {isPrime ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold backdrop-blur-md">
                <Crown size={14} className="text-amber-400" />
                Prime Society Member
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-xs font-bold backdrop-blur-md">
                <ShieldCheck size={14} className="text-blue-400" />
                Associate Member
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Profile Body Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-16 space-y-8 relative z-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: Main Profile Info & Portfolio */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Identity Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                
                {/* Photo Avatar */}
                <div className="relative shrink-0">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-slate-900 border-4 border-white shadow-xl flex items-center justify-center text-white relative">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : profileUser.photo_url ? (
                      <img src={profileUser.photo_url} alt={profileUser.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <UserRound size={64} className="text-slate-400" />
                    )}
                  </div>
                  {isPrime && (
                    <div className="absolute -top-2 -right-2 p-1.5 bg-amber-500 text-slate-900 rounded-full shadow-lg border-2 border-white" title="Prime Member Verified">
                      <Crown size={16} />
                    </div>
                  )}
                </div>

                {/* Identity Details */}
                <div className="flex-1 text-center sm:text-left min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60">
                      Registered Cinematograph Member
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      @{profileUser.username || profileUser.generated_username || profileUser.slug || "member"}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center sm:justify-start gap-2">
                    <span>{profileUser.full_name}</span>
                    <BadgeCheck size={22} className="text-blue-600 shrink-0" title="Verified Member" />
                  </h1>

                  <p className="text-sm font-semibold text-slate-600">
                    {profileUser.role_title || "Film Producer / Rights Owner"}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} className="text-amber-500" />
                      {profileUser.location || "Mumbai, India"}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarRange size={14} className="text-amber-500" />
                      Member since {profileUser.dob ? new Date(profileUser.dob).getFullYear() : "2024"}
                    </span>
                  </div>
                </div>

                {/* Edit Button for Profile Owner */}
                {isOwnProfile && (
                  <button
                    onClick={openEditor}
                    className="sm:self-start inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-[#1e3a5f] hover:text-white text-slate-800 rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0"
                    type="button"
                  >
                    <Edit3 size={14} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Biography Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <FileText size={18} className="text-amber-500" />
                <span>Biography & Executive Overview</span>
              </h3>
              
              {profileUser.biography ? (
                <div className="text-sm leading-relaxed text-slate-600 font-normal">
                  <p className={isBioExpanded ? "" : "line-clamp-4"}>
                    {profileUser.biography}
                  </p>
                  {profileUser.biography.length > 200 && (
                    <button
                      onClick={() => setIsBioExpanded(!isBioExpanded)}
                      className="mt-2 text-xs font-bold text-[#1e3a5f] hover:underline focus:outline-none"
                      type="button"
                    >
                      {isBioExpanded ? "Show Less" : "Read Full Biography"}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                  No biography added yet.
                </p>
              )}
            </div>

            {/* Registered Works / Film Catalogue Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Film size={18} className="text-amber-500" />
                  <span>Registered Film Portfolio</span>
                </h3>
                {profileUser.films && profileUser.films.length > 0 && (
                  <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    {profileUser.films.length} Titles
                  </span>
                )}
              </div>

              {profileUser.films && profileUser.films.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profileUser.films.map((film: any) => (
                    <div
                      key={film.id}
                      className="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-4 hover:border-amber-400/60 hover:bg-white transition-all duration-200 space-y-2 group"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#1e3a5f] transition-colors line-clamp-1">
                          {film.title}
                        </h4>
                        {film.release_year && (
                          <span className="text-[10px] font-bold bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md shrink-0">
                            {film.release_year}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Globe size={12} className="text-amber-500" />
                          {film.language || "Hindi"}
                        </span>
                        {film.censor_certificate_no && (
                          <span className="font-mono text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                            Cert: #{film.censor_certificate_no}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <Film size={28} className="mx-auto text-slate-300" />
                  <p className="text-xs font-semibold text-slate-600">No films catalogued yet under this profile.</p>
                </div>
              )}
            </div>

            {/* Quick Actions (If Own Profile) */}
            {isOwnProfile && (
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onNavigate("member-dashboard" as any)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a5f] hover:bg-slate-800 text-white rounded-2xl text-xs font-bold shadow-md transition-all"
                >
                  <Sparkles size={16} /> Open Member Dashboard
                </button>
                <button
                  onClick={() => onNavigate("change-password" as any)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl text-xs font-bold transition-all shadow-2xs"
                >
                  <Lock size={16} /> Security & Password
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Account Verification, Links & Society Actions */}
          <div className="space-y-6">
            
            {/* Account & Verification Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600" />
                <span>Account & Verification</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-medium text-slate-500">Membership Tier</span>
                  <span className="font-bold text-[#1e3a5f]">
                    {isPrime ? "Prime Society Member" : "Associate Member"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-medium text-slate-500">Member Ref ID</span>
                  <span className="font-mono font-bold text-slate-800">
                    {profileUser.membership_number || `CL-${profileUser.id?.toString().padStart(4, '0')}`}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-medium text-slate-500">Identity Status</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Links & Contact Info */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                <Globe size={18} className="text-amber-500" />
                <span>Official Links & Contact</span>
              </h3>

              <div className="space-y-2.5">
                {profileUser.email && (
                  <a
                    href={`mailto:${profileUser.email}`}
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 text-xs font-semibold text-slate-700 transition"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail size={15} className="text-slate-400 shrink-0" />
                      <span className="truncate">{profileUser.email}</span>
                    </div>
                    <ExternalLink size={14} className="text-slate-400 shrink-0" />
                  </a>
                )}

                {profileUser.phone && (
                  <a
                    href={`tel:${profileUser.phone}`}
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 text-xs font-semibold text-slate-700 transition"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Phone size={15} className="text-slate-400 shrink-0" />
                      <span className="truncate">{profileUser.phone}</span>
                    </div>
                    <ExternalLink size={14} className="text-slate-400 shrink-0" />
                  </a>
                )}

                {profileUser.social_links && profileUser.social_links.length > 0 ? (
                  profileUser.social_links.map((link: any) => (
                    <a
                      key={link.id}
                      href={link.profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-amber-50/50 hover:bg-amber-100/60 rounded-xl border border-amber-200/60 text-xs font-bold text-amber-900 transition"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Globe size={15} className="text-amber-600 shrink-0" />
                        <span className="capitalize truncate">{link.platform}</span>
                      </div>
                      <ExternalLink size={14} className="text-amber-600 shrink-0" />
                    </a>
                  ))
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-xs text-slate-400 font-medium">No additional social links attached.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Society Shortcuts */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                <Award size={18} className="text-[#1e3a5f]" />
                <span>Society Directory Shortcuts</span>
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => onNavigate("films" as Page)}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-[#1e3a5f] hover:text-white rounded-xl border border-slate-100 text-xs font-bold text-slate-700 transition group"
                >
                  <span className="flex items-center gap-2">
                    <Film size={15} className="text-amber-500 group-hover:text-amber-400" />
                    Public CPL Film Catalog
                  </span>
                  <ChevronRight size={16} />
                </button>

                <button
                  onClick={() => onNavigate("members" as Page)}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-[#1e3a5f] hover:text-white rounded-xl border border-slate-100 text-xs font-bold text-slate-700 transition group"
                >
                  <span className="flex items-center gap-2">
                    <UserRound size={15} className="text-amber-500 group-hover:text-amber-400" />
                    CINEFIL Members Directory
                  </span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* EDIT PROFILE MODAL */}
      {editOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4 py-6">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-[#1e3a5f] text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 text-slate-900 rounded-xl font-bold">
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight">Edit Member Profile</h3>
                  <p className="text-[11px] text-amber-300">Update public presentation details & biography</p>
                </div>
              </div>

              <button
                onClick={() => setEditOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <div className="grid gap-4 px-6 py-6 max-h-[calc(100vh-14rem)] overflow-y-auto">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Display Username
                  <input
                    value={draft.username}
                    onChange={(event) => setDraft((value) => ({ ...value, username: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </label>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Full Name
                  <input
                    value={draft.name}
                    onChange={(event) => setDraft((value) => ({ ...value, name: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Phone Number
                  <input
                    value={draft.phone}
                    onChange={(event) => setDraft((value) => ({ ...value, phone: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </label>

                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Location / City
                  <input
                    value={draft.location}
                    onChange={(event) => setDraft((value) => ({ ...value, location: event.target.value }))}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                  />
                </label>
              </div>

              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Profile Picture Display
                <input
                  type="file"
                  onChange={(event) => {
                    const file = event.target.files ? event.target.files[0] : null;
                    setDraft((value) => ({ ...value, photo: file }));
                    if (file) {
                      setPhotoPreview(URL.createObjectURL(file));
                    } else {
                      setPhotoPreview(null);
                    }
                  }}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 font-medium outline-none focus:bg-white focus:border-amber-500 transition"
                />
              </label>

              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Professional Title / Designation
                <input
                  value={draft.headline}
                  onChange={(event) => setDraft((value) => ({ ...value, headline: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                />
              </label>

              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Biography / Career Overview
                <textarea
                  value={draft.about}
                  onChange={(event) => setDraft((value) => ({ ...value, about: event.target.value }))}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 font-medium outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition resize-none"
                />
              </label>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={saveEditor}
                disabled={isSaving}
                className="px-5 py-2 bg-[#1e3a5f] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                type="button"
              >
                <Save size={14} />
                {isSaving ? "Saving Changes..." : "Save Profile"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer onNavigate={onNavigate} />
    </div>
  );
}