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
} from "lucide-react";
import type { Page } from "./Navbar";
import { Footer } from "./Footer";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { memberService } from "../../services/memberService";
import { handleApiError } from "../../utils/errorHandler";

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
};

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user: loggedInUser, refreshProfile } = useAuth();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (loggedInUser && (loggedInUser as any).slug) {
      memberService.getMemberBySlug((loggedInUser as any).slug)
        .then(data => setProfileUser(data))
        .catch(err => {
          console.error("Failed to load member profile", err);
          setError("Failed to load member profile");
        });
    } else if (loggedInUser) {
      setProfileUser(loggedInUser);
    }

    const timer = setTimeout(() => {
      setMinimumLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [loggedInUser]);

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
      });
      setEditOpen(true);
    }
  };

  const saveEditor = async () => {
    setIsSaving(true);
    setMessage(null);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('full_name', draft.name);
      formData.append('role_title', draft.headline);
      formData.append('biography', draft.about);
      formData.append('phone', draft.phone);
      if (draft.photo) {
        formData.append('photo', draft.photo);
      }

      const response = await authService.updateProfile(formData);

      setProfileUser(response.member);
      await refreshProfile();
      setEditOpen(false);
      setMessage("Profile updated successfully!");
      setPhotoPreview(null);
    } catch (e) {
      setError(handleApiError(e));
    } finally {
      setIsSaving(false);
    }
  };

  if (!profileUser || minimumLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-[#eef2f7] px-3 py-5 sm:px-4 sm:py-8 lg:px-6" style={{ fontFamily: "var(--font-body)" }}>
        <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
            <section className="rounded-[1.5rem] sm:rounded-[2rem] border border-[rgba(24,56,88,0.14)] bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6 lg:p-8">
              <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-start">
                <div className="h-36 w-full max-w-[9rem] shrink-0 rounded-[1.5rem] bg-slate-200 animate-pulse sm:h-44 sm:max-w-[11rem] sm:w-44" />
                <div className="min-w-0 flex-1 space-y-3 sm:space-y-4">
                  <div className="h-3 sm:h-4 bg-slate-200 rounded w-1/4 animate-pulse" />
                  <div className="h-6 sm:h-8 bg-slate-200 rounded w-3/4 animate-pulse" />
                  <div className="h-4 sm:h-5 bg-slate-200 rounded w-1/2 animate-pulse" />
                  <div className="flex gap-3 sm:gap-4">
                    <div className="h-3 sm:h-4 bg-slate-200 rounded w-1/3 animate-pulse" />
                    <div className="h-3 sm:h-4 bg-slate-200 rounded w-1/4 animate-pulse" />
                  </div>
                  <div className="pt-3 sm:pt-4 border-t border-slate-100">
                    <div className="h-4 sm:h-5 bg-slate-200 rounded w-1/4 animate-pulse mb-2" />
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="h-2.5 sm:h-3 bg-slate-200 rounded animate-pulse" />
                      <div className="h-2.5 sm:h-3 bg-slate-200 rounded w-5/6 animate-pulse" />
                      <div className="h-2.5 sm:h-3 bg-slate-200 rounded w-4/5 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <aside className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:block lg:space-y-6">
              <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-[rgba(24,56,88,0.14)] bg-white p-4 sm:p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <div className="h-5 sm:h-6 bg-slate-200 rounded w-1/3 animate-pulse mb-2" />
                <div className="h-2.5 sm:h-3 bg-slate-200 rounded w-1/2 animate-pulse mb-4 sm:mb-5" />
                <div className="space-y-3 sm:space-y-3.5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-xl bg-slate-50 border border-slate-100 px-3 sm:px-4 py-2 sm:py-3">
                      <div className="h-2 bg-slate-200 rounded w-1/4 animate-pulse mb-1" />
                      <div className="h-3 sm:h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
                    </div>
                  ))}
                </div>
                <div className="h-8 sm:h-10 bg-slate-200 rounded-xl animate-pulse mt-4 sm:mt-5" />
              </div>
              <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-[rgba(24,56,88,0.14)] bg-white p-4 sm:p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <div className="h-5 sm:h-6 bg-slate-200 rounded w-1/3 animate-pulse mb-3 sm:mb-4" />
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 sm:p-4">
                  <div className="h-3 sm:h-4 bg-slate-200 rounded w-1/3 animate-pulse mb-2" />
                  <div className="h-2.5 sm:h-3 bg-slate-200 rounded w-full animate-pulse" />
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
      <div className="min-h-[calc(100vh-5rem)] bg-[#eef2f7] px-3 py-5 sm:px-4 sm:py-8 lg:px-6" style={{ fontFamily: "var(--font-body)" }}>
        <div className="mx-auto w-full max-w-7xl space-y-6">
          
          {message && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm font-medium shadow-sm transition-all animate-fade-in">
              {message}
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm font-medium shadow-sm transition-all animate-fade-in">
              {error}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
            <section className="rounded-[2rem] border border-[rgba(24,56,88,0.14)] bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6 lg:p-8 transition-all hover:shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="relative h-44 w-full max-w-[11rem] shrink-0 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#0f2540] via-[#183858] to-[#1e4570] p-1.5 sm:h-44 sm:w-44 shadow-md">
                  <div className="flex h-full w-full items-center justify-center rounded-[1.5rem] bg-white/10 text-white relative overflow-hidden">
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
                  {loggedInUser?.id === profileUser?.id && (
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
                    <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "var(--cinefil-gold)" }}>
                      Member Profile
                    </span>
                    <span className="rounded-full bg-slate-100 border border-slate-200/60 px-3 py-0.5 text-xs font-semibold text-[var(--cinefil-navy)] capitalize">
                      {profileUser.role}
                    </span>
                  </div>

                  <h1 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">{profileUser.full_name}</h1>
                  <p className="mt-1 text-base font-medium text-slate-600">{profileUser.role_title || "Managing Director / Producer"}</p>

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

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <h2 className="text-lg font-bold text-slate-900 tracking-wide">Biography</h2>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600 font-normal">{profileUser.biography || "No biography added yet."}</p>
                  </div>

                  {loggedInUser?.id === profileUser?.id && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={openEditor}
                        className="inline-flex items-center gap-2 rounded-xl bg-[var(--cinefil-navy)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 hover:shadow-md active:scale-98 transition-all"
                        type="button"
                      >
                        <Eye size={16} />
                        Edit Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <aside className="grid gap-6 sm:grid-cols-2 lg:block lg:space-y-6">
              <div className="rounded-[2rem] border border-[rgba(24,56,88,0.14)] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <h2 className="text-xl font-bold text-slate-900 tracking-wide">Account Details</h2>
                <p className="mt-1 text-xs text-slate-400 font-medium">Profile summary and access settings.</p>

                <div className="mt-5 space-y-3.5">
                  <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--cinefil-navy)] opacity-70">Status</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">Active Producer / Owner</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Profile ID</p>
                    <p className="mt-0.5 text-sm font-mono font-semibold text-slate-800">CL-2025-{profileUser.id.toString().padStart(3, '0')}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Email Address</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800 truncate">{profileUser.email}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Phone</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">{profileUser.phone || "Not configured"}</p>
                  </div>
                </div>

                {/* <button
                  onClick={() => onNavigate("member-dashboard")}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--cinefil-navy)] px-4 py-3 text-sm font-bold text-white shadow-sm hover:opacity-95 active:scale-98 transition-all"
                  type="button"
                >
                  Back to Dashboard
                </button> */}
              </div>

              <div className="rounded-[2rem] border border-[rgba(24,56,88,0.14)] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <h3 className="text-lg font-bold text-slate-900 tracking-wide">Verification Status</h3>
                <div className="mt-4 rounded-xl bg-emerald-50/50 border border-emerald-100 p-4">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <BadgeCheck size={18} className="text-emerald-600 shrink-0" />
                    <span className="text-sm font-bold">Profile Verified</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-emerald-700 font-medium">
                    Your profile credentials have been formally verified by the society administration board.
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-[rgba(24,56,88,0.14)] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:col-span-2 lg:col-span-1">
                <h3 className="text-lg font-bold text-slate-900 tracking-wide flex items-center gap-2">
                  <Award size={20} className="text-[var(--cinefil-gold)]" />
                  Quick Actions
                </h3>
                <div className="mt-4 space-y-2.5">
                  {[
                    { label: "View Showcase Films", page: "films", icon: Film },
                    { label: "Royalty Reports", page: "member-dashboard", icon: FileText },
                    { label: "Membership Info", page: "membership-form", icon: Award },
                  ].map(({ label, page, icon: Icon }) => (
                    <button
                      key={label}
                      onClick={() => onNavigate(page as Page)}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-[var(--cinefil-navy)] hover:bg-slate-100/50"
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
              <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl border border-slate-100 animate-scale-up">
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
                      Legal Full Name
                      <input
                        value={draft.name}
                        onChange={(event) => setDraft((value) => ({ ...value, name: event.target.value }))}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 font-medium outline-none focus:bg-white focus:border-[var(--cinefil-navy)] transition-all shadow-inner"
                      />
                    </label>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Phone Number
                      <input
                        value={draft.phone}
                        onChange={(event) => setDraft((value) => ({ ...value, phone: event.target.value }))}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 font-medium outline-none focus:bg-white focus:border-[var(--cinefil-navy)] transition-all shadow-inner"
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
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 font-medium outline-none focus:bg-white focus:border-[var(--cinefil-navy)] transition-all"
                    />
                  </label>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Professional Headline Title
                    <input
                      value={draft.headline}
                      onChange={(event) => setDraft((value) => ({ ...value, headline: event.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 font-medium outline-none focus:bg-white focus:border-[var(--cinefil-navy)] transition-all shadow-inner"
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Primary Location
                      <input
                        value={draft.location}
                        onChange={(event) => setDraft((value) => ({ ...value, location: event.target.value }))}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 font-medium outline-none focus:bg-white focus:border-[var(--cinefil-navy)] transition-all shadow-inner"
                      />
                    </label>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Date of Birth
                      <input
                        value={draft.dob}
                        onChange={(event) => setDraft((value) => ({ ...value, dob: event.target.value }))}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 font-medium outline-none focus:bg-white focus:border-[var(--cinefil-navy)] transition-all shadow-inner"
                      />
                    </label>
                  </div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    About Biography / Professional Track Record
                    <textarea
                      value={draft.about}
                      onChange={(event) => setDraft((value) => ({ ...value, about: event.target.value }))}
                      rows={4}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 font-medium outline-none focus:bg-white focus:border-[var(--cinefil-navy)] transition-all shadow-inner resize-none"
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:justify-end">
                  <button
                    onClick={() => setEditOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEditor}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--cinefil-navy)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-50 transition-all"
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