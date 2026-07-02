import { useState, useEffect } from "react";
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

    const loggedInSlug = loggedInUser ? (loggedInUser.member_slug || loggedInUser.slug || `${loggedInUser.username || loggedInUser.id}-${loggedInUser.id}`) : null;
    
    const isSelf = !slug || slug === "profile" || (loggedInUser && (
      slug === loggedInSlug ||
      slug === loggedInUser.member_slug ||
      slug === loggedInUser.slug ||
      slug === loggedInUser.username ||
      slug === String(loggedInUser.id) ||
      slug === String(loggedInUser.member_id)
    ));

    const targetSlug = (!slug || slug === "profile") ? loggedInSlug : slug;

    if (targetSlug) {
      if (!profileUser || (
        profileUser.slug !== targetSlug &&
        String(profileUser.id) !== targetSlug &&
        profileUser.username !== targetSlug &&
        (!isSelf || profileUser.id !== loggedInUser?.member_id)
      )) {
        memberService
          .getMemberBySlug(targetSlug)
          .then((data) => setProfileUser(data))
          .catch((err) => {
            console.error("Failed to load member profile by slug", err);
            if (isSelf && loggedInUser?.member_id) {
              memberService.getMember(loggedInUser.member_id)
                .then((data) => setProfileUser(data))
                .catch((e) => {
                  console.error("Failed to load member profile by ID", e);
                  setProfileUser(loggedInUser);
                });
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
    }, 1500);

    return () => clearTimeout(timer);
  }, [loggedInUser, profileUser]);

  useEffect(() => {
    if (profileUser) {
      setDraft({
        name: profileUser.full_name || "",
        role: profileUser.role || "member",
        headline: profileUser.role_title || "",
        location: profileUser.location || "India",
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
        location: profileUser.location || "India",
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
      formData.append('full_name', draft.name);
      formData.append('role_title', draft.headline);
      formData.append('biography', draft.about);
      formData.append('phone', draft.phone);
      if (draft.photo) {
        formData.append('photo', draft.photo);
      }
      formData.append('location', draft.location);
      formData.append('dob', draft.dob);
      formData.append('username', draft.username);

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
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-tr from-[#f1f5f9] via-[#eef2f7] to-[#e2e8f0] flex items-center justify-center p-4 sm:p-6" style={{ fontFamily: "var(--font-body)" }}>
        <div className="max-w-md w-full text-center bg-white/70 backdrop-blur-md p-8 rounded-xl border border-white/60 shadow-[0_12px_40px_rgba(15,23,42,0.04)] space-y-5">
          <div className="mx-auto w-16 h-16 bg-rose-50/50 border border-rose-200/60 text-rose-500 rounded-lg flex items-center justify-center">
            <AlertCircle size={36} />
          </div>
          <h2 className="text-xl font-bold" style={{ color: "var(--cinefil-navy)", fontFamily: "var(--font-heading)" }}>
            Profile Not Found
          </h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            The requested member profile could not be resolved or the member does not exist in our systems.
          </p>
          <button
            onClick={() => onNavigate("home" as any)}
            className="w-full py-3 bg-[var(--cinefil-navy)] hover:bg-slate-800 text-white font-bold rounded-lg transition-colors duration-200"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (!profileUser || minimumLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-tr from-[#f1f5f9] via-[#eef2f7] to-[#e2e8f0] px-3 py-5 sm:px-4 sm:py-8 lg:px-6" style={{ fontFamily: "var(--font-body)" }}>
        <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
            <section className="rounded-xl border border-white/60 bg-white/70 backdrop-blur-md p-4 shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:p-6 lg:p-8">
              <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-start">
                <div className="h-36 w-full max-w-[9rem] shrink-0 rounded-lg bg-slate-200/80 animate-pulse sm:h-44 sm:max-w-[11rem] sm:w-44" />
                <div className="min-w-0 flex-1 space-y-3 sm:space-y-4">
                  <div className="h-3 sm:h-4 bg-slate-200/80 rounded w-1/4 animate-pulse" />
                  <div className="h-6 sm:h-8 bg-slate-200/80 rounded w-3/4 animate-pulse" />
                  <div className="h-4 sm:h-5 bg-slate-200/80 rounded w-1/2 animate-pulse" />
                  <div className="flex gap-3 sm:gap-4">
                    <div className="h-3 sm:h-4 bg-slate-200/80 rounded w-1/3 animate-pulse" />
                    <div className="h-3 sm:h-4 bg-slate-200/80 rounded w-1/4 animate-pulse" />
                  </div>
                  <div className="pt-3 sm:pt-4 border-t border-slate-100">
                    <div className="h-4 sm:h-5 bg-slate-200/80 rounded w-1/4 animate-pulse mb-2" />
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="h-2.5 sm:h-3 bg-slate-200/80 rounded animate-pulse" />
                      <div className="h-2.5 sm:h-3 bg-slate-200/80 rounded w-5/6 animate-pulse" />
                      <div className="h-2.5 sm:h-3 bg-slate-200/80 rounded w-4/5 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <aside className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:block lg:space-y-6">
              <div className="rounded-xl border border-white/60 bg-white/70 backdrop-blur-md p-4 sm:p-6 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
                <div className="h-5 sm:h-6 bg-slate-200/80 rounded w-1/3 animate-pulse mb-2" />
                <div className="h-2.5 sm:h-3 bg-slate-200/80 rounded w-1/2 animate-pulse mb-4 sm:mb-5" />
                <div className="space-y-3 sm:space-y-3.5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-lg bg-slate-50/50 border border-slate-100/80 px-3 sm:px-4 py-2 sm:py-3">
                      <div className="h-2 bg-slate-200/80 rounded w-1/4 animate-pulse mb-1" />
                      <div className="h-3 sm:h-4 bg-slate-200/80 rounded w-1/2 animate-pulse" />
                    </div>
                  ))}
                </div>
                <div className="h-8 sm:h-10 bg-slate-200/80 rounded-lg animate-pulse mt-4 sm:mt-5" />
              </div>
              <div className="rounded-xl border border-white/60 bg-white/70 backdrop-blur-md p-4 sm:p-6 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
                <div className="h-5 sm:h-6 bg-slate-200/80 rounded w-1/3 animate-pulse mb-3 sm:mb-4" />
                <div className="rounded-lg bg-slate-50/50 border border-slate-100/80 p-3 sm:p-4">
                  <div className="h-3 sm:h-4 bg-slate-200/80 rounded w-1/3 animate-pulse mb-2" />
                  <div className="h-2.5 sm:h-3 bg-slate-200/80 rounded w-full animate-pulse" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-tr from-[#f1f5f9] via-[#eef2f7] to-[#e2e8f0] px-3 py-5 sm:px-4 sm:py-8 lg:px-6" style={{ fontFamily: "var(--font-body)" }}>
        <div className="mx-auto w-full max-w-7xl space-y-6">



          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <section className="rounded-xl border border-white/60 bg-white/70 backdrop-blur-md p-4 shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:p-6 lg:p-8 transition-all hover:shadow-[0_16px_48px_rgba(15,23,42,0.06)]">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="relative h-44 w-full max-w-[11rem] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#0f2540] via-[#183858] to-[#1e4570] p-1 sm:h-44 sm:w-44 shadow-sm border border-white/25">
                  <div className="flex h-full w-full items-center justify-center rounded-lg bg-white/10 text-white relative overflow-hidden">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : profileUser.photo_url ? (
                      <img src={profileUser.photo_url} alt={profileUser.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <svg className="absolute w-full h-full opacity-10" viewBox="0 0 100 100" fill="currentColor">
                          <circle cx="20" cy="20" r="15" />
                          <path d="M 50 50 Q 60 40, 70 50 T 90 50" stroke="currentColor" fill="none" strokeWidth="2" />
                          <rect x="30" y="70" width="40" height="20" rx="5" />
                        </svg>
                        <UserRound size={56} className="relative z-10 text-white/90" />
                      </>
                    )}
                  </div>
                  {isOwnProfile && (
                    <button
                      onClick={openEditor}
                      className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--cinefil-navy)] shadow-md hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all"
                      type="button"
                    >
                      <Edit3 size={15} />
                    </button>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--cinefil-gold)" }}>
                      Member Profile
                    </span>
                    <span className="rounded bg-[#183858]/5 border border-[#183858]/10 px-2.5 py-0.5 text-xs font-bold text-[var(--cinefil-navy)] capitalize tracking-wide">
                      {profileUser.role || "member"}
                    </span>
                  </div>

                  <h1 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">{profileUser.full_name}</h1>
                  <p className="mt-1 text-base font-medium text-slate-600">{profileUser.role_title || "Managing Director / Producer"}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Username:</span>
                      <span className="font-semibold text-slate-700">@{profileUser.username || profileUser.generated_username || profileUser.slug || "N/A"}</span>
                    </span>

                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} className="text-slate-400" />
                      {profileUser.location || "India"}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarRange size={14} className="text-slate-400" />
                      {profileUser.dob || "June 17, 2004"}
                    </span>
                  </div>

                  {profileUser.social_links && profileUser.social_links.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {profileUser.social_links.map((link: any) => {
                        const getPlatformColor = (platform: string) => {
                          const p = platform.toLowerCase();
                          if (p.includes('linkedin')) return 'bg-blue-50/50 text-blue-700 border-blue-200/50 hover:bg-blue-100/60';
                          if (p.includes('twitter') || p.includes('x.com')) return 'bg-slate-100/50 text-slate-800 border-slate-200/60 hover:bg-slate-200/60';
                          if (p.includes('facebook')) return 'bg-indigo-50/50 text-indigo-700 border-indigo-200/50 hover:bg-indigo-100/60';
                          if (p.includes('instagram')) return 'bg-pink-50/50 text-pink-700 border-pink-200/50 hover:bg-pink-100/60';
                          if (p.includes('youtube')) return 'bg-red-50/50 text-red-700 border-red-200/50 hover:bg-red-100/60';
                          return 'bg-slate-50/50 text-slate-700 border-slate-200/60 hover:bg-slate-150/60';
                        };
                        return (
                          <a
                            key={link.id}
                            href={link.profile_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1 rounded border px-2.5 py-1 text-xs font-semibold tracking-wide transition-all ${getPlatformColor(link.platform)}`}
                          >
                            <span className="capitalize">{link.platform}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-6 border-t border-slate-100/80 pt-5">
                    <h2 className="text-lg font-bold text-slate-900 tracking-wide">Biography</h2>
                    {profileUser.biography ? (
                      <div className="mt-2 text-sm leading-relaxed text-slate-600 font-normal">
                        <p className={isBioExpanded ? "" : "line-clamp-3"}>
                          {profileUser.biography}
                        </p>
                        {profileUser.biography.length > 180 && (
                          <button
                            onClick={() => setIsBioExpanded(!isBioExpanded)}
                            className="mt-1 text-xs font-bold text-[var(--cinefil-gold)] hover:underline focus:outline-none"
                            type="button"
                          >
                            {isBioExpanded ? "Read Less" : "Read More"}
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 font-normal">No biography added yet.</p>
                    )}
                  </div>

                  <div className="mt-8 border-t border-slate-100/80 pt-6">
                    <h2 className="text-lg font-bold text-slate-900 tracking-wide flex items-center gap-2">
                      <Film size={20} className="text-[var(--cinefil-gold)]" />
                      Works (Registered Films)
                    </h2>
                    {profileUser.films && profileUser.films.length > 0 ? (
                      <div className="mt-4 space-y-3">
                        {profileUser.films.slice(0, 4).map((film: any) => (
                          <div
                            key={film.id}
                            className="rounded-lg border border-white/60 bg-white/40 backdrop-blur-xs p-3 transition-all hover:border-[var(--cinefil-gold)]/60 hover:bg-white/80 hover:shadow-xs group w-full"
                          >
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 font-medium w-full">
                              <h3 className="font-bold text-slate-800 group-hover:text-[var(--cinefil-navy)] transition-colors text-sm mr-2">
                                {film.title || "Untitled Film"}
                              </h3>
                              {film.release_year && (
                                <span className="rounded bg-slate-100 border border-slate-200/50 px-1.5 py-0.5 font-bold text-slate-600 text-[10px]">
                                  {film.release_year}
                                </span>
                              )}
                              {film.language && (
                                <span className="text-slate-600 font-semibold">• {film.language}</span>
                              )}
                              {film.duration && (
                                <span className="text-slate-500 font-semibold">• {film.duration}</span>
                              )}
                              {film.director_name && (
                                <span className="text-slate-500">
                                  • Dir: <span className="font-semibold text-slate-700">{film.director_name}</span>
                                </span>
                              )}
                              {film.producer_name && (
                                <span className="text-slate-500">
                                  • Prod: <span className="font-semibold text-slate-700">{film.producer_name}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        ))}

                        {profileUser.films.length > 4 && (
                          <div className="mt-3 flex justify-end">
                            <button
                              onClick={() => onNavigate("member-dashboard/films")}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--cinefil-gold)] hover:underline focus:outline-none"
                              type="button"
                            >
                              View More Works →
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-slate-400 font-medium">No films registered under this member yet.</p>
                    )}
                  </div>

                  {isOwnProfile && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={openEditor}
                        className="inline-flex items-center gap-2 rounded-lg bg-[var(--cinefil-navy)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 hover:shadow-md active:scale-98 transition-all"
                        type="button"
                      >
                        <Edit3 size={16} />
                        Edit Profile
                      </button>
                      <button
                        onClick={() => onNavigate("change-password")}
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--cinefil-navy)] px-5 py-2.5 text-sm font-semibold text-[var(--cinefil-navy)] hover:bg-slate-50 active:scale-98 transition-all"
                        type="button"
                      >
                        <Lock size={16} />
                        Change Password
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <aside className="grid gap-6 sm:grid-cols-2 lg:block lg:space-y-6">
              <div className="rounded-xl border border-white/60 bg-white/70 backdrop-blur-md p-6 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
                <h2 className="text-xl font-bold text-slate-900 tracking-wide">Account Details</h2>
                <p className="mt-1 text-xs text-slate-400 font-medium">Profile summary and access settings.</p>

                <div className="mt-5 space-y-3">
                  <div className="rounded-lg bg-white/40 border border-slate-200/40 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--cinefil-navy)] opacity-70">Status</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">Active Producer / Owner</p>
                  </div>
                  <div className="rounded-lg bg-white/40 border border-slate-200/40 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Profile ID</p>
                    <p className="mt-0.5 text-sm font-mono font-semibold text-slate-800">CL-2025-{profileUser.id.toString().padStart(3, '0')}</p>
                  </div>
                  <div className="rounded-lg bg-white/40 border border-slate-200/40 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Email Address</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800 truncate">{profileUser.email}</p>
                  </div>
                  <div className="rounded-lg bg-white/40 border border-slate-200/40 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Phone</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">{profileUser.phone || "Not configured"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/60 bg-white/70 backdrop-blur-md p-6 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
                <h3 className="text-lg font-bold text-slate-900 tracking-wide">Verification Status</h3>
                {profileUser?.is_email_verified && profileUser?.is_mobile_verified ? (
                  <div className="mt-4 rounded-lg bg-emerald-50/40 border border-emerald-100/50 p-4">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <BadgeCheck size={18} className="text-emerald-600 shrink-0" />
                      <span className="text-sm font-bold">Profile Verified</span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-emerald-700 font-medium">
                      Your profile credentials have been formally verified by the society.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 rounded-lg bg-amber-50/40 border border-amber-100/50 p-4">
                    <div className="flex items-center gap-2 text-amber-800">
                      <AlertCircle size={18} className="text-amber-600 shrink-0" />
                      <span className="text-sm font-bold">Profile Not Verified</span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-amber-700 font-medium">
                      Your profile credentials have not been formally verified by the society yet. Please verify your email and mobile number.
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-white/60 bg-white/70 backdrop-blur-md p-6 shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:col-span-2 lg:col-span-1">
                <h3 className="text-lg font-bold text-slate-900 tracking-wide flex items-center gap-2">
                  <Award size={20} className="text-[var(--cinefil-gold)]" />
                  Quick Actions
                </h3>
                <div className="mt-4 space-y-2">
                  {[
                    { label: "View Showcase Films", page: "films", icon: Film },
                    { label: "Royalty Reports", page: "member-dashboard", icon: FileText },
                    { label: "Membership Info", page: "membership-form", icon: Award },
                  ].map(({ label, page, icon: Icon }) => (
                    <button
                      key={label}
                      onClick={() => onNavigate(page as Page)}
                      className="flex w-full items-center justify-between rounded-lg border border-slate-200/40 bg-white/40 px-4 py-3 text-left text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-[var(--cinefil-navy)] hover:bg-white/80"
                      type="button"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon size={16} className="text-[var(--cinefil-navy)] opacity-80" />
                        {label}
                      </span>
                      <ChevronRight size={16} className="text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {editOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-md transition-all">
              <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl border border-slate-100 animate-scale-up">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--cinefil-gold)" }}>
                      Management Console
                    </p>
                    <h2 className="mt-0.5 text-xl font-bold text-slate-900 tracking-wide">Update Profile Settings</h2>
                  </div>
                  <button
                    onClick={() => setEditOpen(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
                    type="button"
                    aria-label="Close configuration window"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid gap-4 px-6 py-5 max-h-[calc(100vh-14rem)] overflow-y-auto">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Username (Display ID)
                      <input
                        value={draft.username}
                        onChange={(event) => setDraft((value) => ({ ...value, username: event.target.value }))}
                        className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 font-medium outline-none focus:bg-white focus:border-[var(--cinefil-navy)] transition-all shadow-inner"
                      />
                    </label>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Legal Full Name
                      <input
                        value={draft.name}
                        onChange={(event) => setDraft((value) => ({ ...value, name: event.target.value }))}
                        className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 font-medium outline-none focus:bg-white focus:border-[var(--cinefil-navy)] transition-all shadow-inner"
                      />
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Phone Number
                      <input
                        value={draft.phone}
                        onChange={(event) => setDraft((value) => ({ ...value, phone: event.target.value }))}
                        className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 font-medium outline-none focus:bg-white focus:border-[var(--cinefil-navy)] transition-all shadow-inner"
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
                      className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 font-medium outline-none focus:bg-white focus:border-[var(--cinefil-navy)] transition-all"
                    />
                  </label>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Professional Headline Title
                    <input
                      value={draft.headline}
                      onChange={(event) => setDraft((value) => ({ ...value, headline: event.target.value }))}
                      className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 font-medium outline-none focus:bg-white focus:border-[var(--cinefil-navy)] transition-all shadow-inner"
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Primary Location
                      <input
                        value={draft.location}
                        onChange={(event) => setDraft((value) => ({ ...value, location: event.target.value }))}
                        className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 font-medium outline-none focus:bg-white focus:border-[var(--cinefil-navy)] transition-all shadow-inner"
                      />
                    </label>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Date of Birth
                      <input
                        value={draft.dob}
                        onChange={(event) => setDraft((value) => ({ ...value, dob: event.target.value }))}
                        className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 font-medium outline-none focus:bg-white focus:border-[var(--cinefil-navy)] transition-all shadow-inner"
                      />
                    </label>
                  </div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    About Biography / Professional Track Record
                    <textarea
                      value={draft.about}
                      onChange={(event) => setDraft((value) => ({ ...value, about: event.target.value }))}
                      rows={4}
                      className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 font-medium outline-none focus:bg-white focus:border-[var(--cinefil-navy)] transition-all shadow-inner resize-none"
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:justify-end">
                  <button
                    onClick={() => setEditOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEditor}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--cinefil-navy)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-50 transition-all"
                    type="button"
                  >
                    <Save size={15} />
                    {isSaving ? "Saving Config..." : "Save Modifications"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </>
  );
}