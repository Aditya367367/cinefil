import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  CircleUserRound,
  Home,
  LogOut,
  ReceiptText,
  Ticket,
  UserRound,
  Film,
  FileText,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Scale,
  Users,
  Award,
  Briefcase,
  ScrollText,
  Menu,
  Globe
} from "lucide-react";
import type { Page } from "./Navbar";
import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "../../contexts/LanguageContext";

interface ProfileMenuProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  dark?: boolean;
  showLabel?: boolean;
}

export function ProfileMenu({ currentPage, onNavigate, dark = false, showLabel = false }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useTranslation();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, []);

  const buttonText = dark ? "text-white/85" : "text-slate-700";
  const buttonBorder = dark ? "rgba(255,255,255,0.18)" : "rgba(15,23,42,0.12)";
  const panelBg = dark
    ? "linear-gradient(180deg, #0f2540 0%, #183858 100%)"
    : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)";
  const panelText = dark ? "text-white/80" : "text-slate-600";

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.map(p => p[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleLogoutClick = async () => {
    await logout();
    setOpen(false);
    onNavigate("home");
  };

  const officerDashboardLabel = user?.is_ceo_authorised_officer || user?.role === 'ceo' ? 'CEO Dashboard' :
    user?.is_membership_executive || user?.role === 'membership_executive' ? 'Executive Dashboard' :
      user?.is_legal_officer || user?.role === 'legal_officer' ? 'Legal Dashboard' :
        user?.is_rights_verification_officer || user?.role === 'rights_verification_officer' ? 'Verification Dashboard' :
          'Officer Dashboard';

  const isOfficer = user?.is_membership_executive || user?.is_rights_verification_officer || user?.is_legal_officer || user?.is_ceo_authorised_officer || user?.is_membership_committee_member || ['admin', 'membership_executive', 'rights_verification_officer', 'legal_officer', 'ceo', 'membership_committee'].includes(user?.role || '');

  const isMember = user?.is_member === true || user?.membership_status === 'approved' || user?.role === 'member';

  const mainRoleDisplay = () => {
    if (!user) return "";
    if (user.is_ceo_authorised_officer || user.role === 'ceo') return "CEO / Authorised Officer";
    if (user.is_legal_officer || user.role === 'legal_officer') return "Legal Officer";
    if (user.is_membership_executive || user.role === 'membership_executive') return "Membership Executive";
    if (user.is_rights_verification_officer || user.role === 'rights_verification_officer') return "Rights Verification Officer";
    if (user.is_membership_committee_member || user.role === 'membership_committee') return "Membership Committee";
    if (user.role === 'admin') return "Admin";
    if (user.is_member || user.role === 'member') return "Member";
    return "User";
  };

  // Menu items for authenticated users
  const authMenuItems: Array<{
    label: string;
    page: Page;
    icon: React.ReactNode;
    section?: string;
  }> = [
      { label: "Home", page: "home", icon: <Home size={16} />, section: "Navigation" },
      { label: "Governance", page: "governance", icon: <Scale size={16} />, section: "Navigation" },
      ...((isMember || !isOfficer) ? [{ label: "Member Dashboard", page: "member-dashboard" as Page, icon: <LayoutDashboard size={16} />, section: "Member" }] : []),
      ...(isOfficer ? [{ label: officerDashboardLabel, page: "officer-dashboard" as Page, icon: <LayoutDashboard size={16} />, section: "Member" }] : []),
      { label: "Profile", page: "profile", icon: <UserRound size={16} />, section: "Member" },
      { label: "Films", page: "films", icon: <Film size={16} />, section: "Member" },
      { label: "Membership Form", page: "membership-form", icon: <FileText size={16} />, section: "Membership" },
      { label: "Governing Board", page: "governing-board", icon: <Users size={16} />, section: "Team" },
      { label: "Honorary Advisory Board", page: "honorary-board", icon: <Award size={16} />, section: "Team" },
      { label: "Committee", page: "committee", icon: <Briefcase size={16} />, section: "Team" },
      { label: "Producers & Owners", page: "producers-owners", icon: <Briefcase size={16} />, section: "Membership" },
      { label: "Legal Advisor", page: "legal-advisor", icon: <Scale size={16} />, section: "Membership" },
      { label: "Schemes", page: "schemes", icon: <ScrollText size={16} />, section: "Resources" },
      { label: "License Form", page: "license-form", icon: <ReceiptText size={16} />, section: "Resources" },
      { label: "Contact", page: "contact", icon: <Ticket size={16} />, section: "Resources" },
    ];

  // Menu items for non-authenticated users
  const publicMenuItems: Array<{
    label: string;
    page: Page;
    icon: React.ReactNode;
    section?: string;
  }> = [
      { label: "Home", page: "home", icon: <Home size={16} />, section: "Navigation" },
      { label: "Films", page: "films", icon: <Film size={16} />, section: "Navigation" },
      { label: "Governance", page: "governance", icon: <Scale size={16} />, section: "Navigation" },
      { label: "Governing Board", page: "governing-board", icon: <Users size={16} />, section: "Team" },
      { label: "Honorary Advisory Board", page: "honorary-board", icon: <Award size={16} />, section: "Team" },
      { label: "Committee", page: "committee", icon: <Briefcase size={16} />, section: "Team" },
      { label: "Producers & Owners", page: "producers-owners", icon: <Briefcase size={16} />, section: "Membership" },
      { label: "Legal Advisor", page: "legal-advisor", icon: <Scale size={16} />, section: "Membership" },
      { label: "Schemes", page: "schemes", icon: <ScrollText size={16} />, section: "Resources" },
      { label: "License Form", page: "license-form", icon: <ReceiptText size={16} />, section: "Resources" },
      { label: "Contact", page: "contact", icon: <Ticket size={16} />, section: "Resources" },
      { label: "Membership Form", page: "membership-form", icon: <FileText size={16} />, section: "Membership" },
      { label: "Member Login", page: "login", icon: <LogIn size={16} />, section: "Auth" },
    ];

  const currentItems = isAuthenticated ? authMenuItems : publicMenuItems;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((value) => !value)}
        className={`flex items-center gap-2 rounded-full border px-2 py-1.5 text-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white/20 ${buttonText}`}
        style={{ borderColor: buttonBorder }}
        aria-label="Profile menu"
      >
        {isAuthenticated ? (
          <>
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-full overflow-hidden text-xs font-bold text-white bg-cover bg-center"
              style={{
                backgroundImage: user?.photo_url ? `url(${user.photo_url})` : 'none',
                backgroundColor: dark ? 'rgba(24,56,88,0.5)' : '#183858',
              }}
            >
              {!user?.photo_url && getInitials(user?.full_name || "")}
            </span>
            {showLabel && <span className="hidden sm:inline font-medium">Profile</span>}
            <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </>
        ) : (
          <Menu size={24} className={buttonText} />
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-3 w-[18rem] overflow-hidden rounded-none border shadow-2xl z-50"
          style={{
            background: panelBg,
            borderColor: dark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.08)",
          }}
        >
          {isMobile && isAuthenticated && (currentPage.startsWith("member-dashboard") || currentPage.startsWith("mentor-dashboard")) ? (
            <>
              {/* Mentor profile photo - click goes to profile */}
              <div
                className="px-5 py-5 border-b flex flex-col items-center text-center cursor-pointer hover:bg-white/5 transition-colors"
                style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)" }}
                onClick={() => {
                  onNavigate("profile");
                  setOpen(false);
                }}
              >
                <span
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full text-white font-bold bg-cover bg-center ring-2 ring-[var(--cinefil-gold)]/60"
                  style={{
                    backgroundImage: user?.photo_url ? `url(${user.photo_url})` : 'none',
                    backgroundColor: '#0f2540',
                  }}
                >
                  {!user?.photo_url && getInitials(user?.full_name || "")}
                </span>
                <p className={`mt-2.5 text-sm font-bold ${dark ? "text-white" : "text-slate-900"}`}>
                  {user?.full_name}
                </p>

              </div>

              {/* Tags list: films, royalty, form, home */}
              <div className="py-2">
                <button
                  onClick={() => {
                    onNavigate("member-dashboard/home");
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition-all hover:bg-white/5"
                  style={{
                    color: (currentPage === "member-dashboard" || currentPage === "member-dashboard/home") ? "var(--cinefil-gold-active)" : dark ? "rgba(255,255,255,0.82)" : "rgb(30 41 59)"
                  }}
                >
                  <Home size={16} className={dark ? "text-white/60" : "text-slate-500"} />
                  <span className="font-semibold">{t("Home")}</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate("member-dashboard/films");
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition-all hover:bg-white/5"
                  style={{
                    color: currentPage === "member-dashboard/films" ? "var(--cinefil-gold-active)" : dark ? "rgba(255,255,255,0.82)" : "rgb(30 41 59)"
                  }}
                >
                  <Film size={16} className={dark ? "text-white/60" : "text-slate-500"} />
                  <span className="font-semibold">{t("Films")}</span>
                </button>

                {user?.is_prime && (
                  <button
                    onClick={() => {
                      onNavigate("member-dashboard/payments");
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition-all hover:bg-white/5"
                    style={{
                      color: currentPage === "member-dashboard/payments" ? "var(--cinefil-gold-active)" : dark ? "rgba(255,255,255,0.82)" : "rgb(30 41 59)"
                    }}
                  >
                    <ReceiptText size={16} className={dark ? "text-white/60" : "text-slate-500"} />
                    <span className="font-semibold">{t("Payments")}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onNavigate("member-dashboard/membership-details");
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition-all hover:bg-white/5"
                  style={{
                    color: currentPage === "member-dashboard/membership-details" ? "var(--cinefil-gold-active)" : dark ? "rgba(255,255,255,0.82)" : "rgb(30 41 59)"
                  }}
                >
                  <FileText size={16} className={dark ? "text-white/60" : "text-slate-500"} />
                  <span className="font-semibold">{t("Membership Details")}</span>
                </button>

                <div
                  style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)" }}
                  className="border-t my-1"
                />

                <button
                  onClick={() => {
                    onNavigate("home");
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition-all text-blue-300 hover:text-white hover:bg-white/5"
                >
                  <Home size={16} />
                  <span className="font-semibold">{t("Back to main website")}</span>
                </button>
              </div>

              <div className="border-t px-5 py-4" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)" }}>
                <button
                  onClick={handleLogoutClick}
                  className="flex w-full items-center gap-3 text-left text-sm font-medium transition-colors hover:bg-white/5 rounded px-2 py-1"
                  style={{ color: "#ef4444" }}
                >
                  <LogOut size={16} />
                  {t("Logout")}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="px-5 py-4 border-b" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)" }}>
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-12 w-12 items-center justify-center rounded-none text-white font-bold bg-cover bg-center"
                    style={{
                      backgroundImage: isAuthenticated && user?.photo_url ? `url(${user.photo_url})` : 'none',
                      backgroundColor: '#0f2540',
                    }}
                  >
                    {isAuthenticated && user && !user.photo_url && getInitials(user.full_name)}
                    {!isAuthenticated && 'GU'}
                  </span>
                  <div>
                    <p className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                      {isAuthenticated && user ? user.full_name : t("Guest User")}
                    </p>
                    <p className={`text-xs ${panelText}`}>
                      {isAuthenticated && user ? `${t(mainRoleDisplay())} account` : t("Join CINEFIL Today")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-2 max-h-96 overflow-y-auto scrollbar-none">
                {(() => {
                  const sections = new Map<string, typeof currentItems>();
                  currentItems.forEach((item) => {
                    const section = item.section || "Navigation";
                    if (!sections.has(section)) {
                      sections.set(section, []);
                    }
                    sections.get(section)?.push(item);
                  });

                  let isFirst = true;
                  const result: React.ReactNode[] = [];

                  sections.forEach((items, sectionName) => {
                    if (!isFirst) {
                      result.push(
                        <div
                          key={`divider-${sectionName}`}
                          style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)" }}
                          className="border-t my-1"
                        />
                      );
                    }

                    result.push(
                      <p
                        key={`section-${sectionName}`}
                        className={`px-5 pt-3 pb-1.5 text-xs uppercase font-bold tracking-wider ${dark ? "text-white/50" : "text-slate-500"
                          }`}
                      >
                        {t(sectionName)}
                      </p>
                    );

                    items.forEach((item) => {
                      const active = currentPage === item.page;
                      result.push(
                        <button
                          key={item.label}
                          onClick={() => {
                            onNavigate(item.page);
                            setOpen(false);
                          }}
                          className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition-all hover:bg-white/5 focus:outline-none focus:bg-white/5"
                          style={{
                            color: active ? "var(--cinefil-gold-active)" : dark ? "rgba(255,255,255,0.82)" : "rgb(30 41 59)",
                            backgroundColor: active
                              ? dark
                                ? "rgba(201,162,39,0.12)"
                                : "rgba(24,56,88,0.08)"
                              : "transparent",
                          }}
                        >
                          <span className={active ? "text-[var(--cinefil-gold-active)]" : panelText}>{item.icon}</span>
                          <span className="font-medium">{t(item.label)}</span>
                        </button>
                      );
                    });

                    isFirst = false;
                  });

                  return result;
                })()}
              </div>

              {/* <div className="border-t px-5 py-3 flex items-center justify-between" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)" }}>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500" style={{ color: dark ? "rgba(255,255,255,0.5)" : "" }}>
              <Globe size={13} />
              <span>{t("Language")}</span>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setLanguage("EN")}
                className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${language === "EN" ? "bg-[var(--cinefil-gold)] text-slate-900" : dark ? "bg-white/5 text-white/70 hover:bg-white/10" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("HI")}
                className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${language === "HI" ? "bg-[var(--cinefil-gold)] text-slate-900" : dark ? "bg-white/5 text-white/70 hover:bg-white/10" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                HI
              </button>
            </div>
          </div> */}

              {isAuthenticated && (
                <div className="border-t px-5 py-4" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)" }}>
                  <button
                    onClick={handleLogoutClick}
                    className="flex w-full items-center gap-3 text-left text-sm font-medium transition-colors hover:bg-white/5 focus:outline-none focus:bg-white/5 rounded px-2 py-1"
                    style={{ color: "#ef4444" }}
                  >
                    <LogOut size={16} />
                    {t("Logout")}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}