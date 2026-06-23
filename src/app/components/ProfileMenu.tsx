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
  ScrollText
} from "lucide-react";
import type { Page } from "./Navbar";
import { useAuth } from "../../context/AuthContext";

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

  // Menu items for authenticated users
  const authMenuItems: Array<{
    label: string;
    page: Page;
    icon: React.ReactNode;
    section?: string;
  }> = [
    { label: "Home", page: "home", icon: <Home size={16} />, section: "Navigation" },
    { label: "Governance", page: "governance", icon: <Scale size={16} />, section: "Navigation" },
    { label: "Member Dashboard", page: "member-dashboard", icon: <LayoutDashboard size={16} />, section: "Member" },
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
    { label: "Login", page: "login", icon: <LogIn size={16} />, section: "Auth" },
    { label: "Signup", page: "signup", icon: <UserPlus size={16} />, section: "Auth" },
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
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-full overflow-hidden text-xs font-bold text-white bg-cover bg-center"
          style={{
            backgroundImage: isAuthenticated && user?.photo_url ? `url(${user.photo_url})` : 'none',
            backgroundColor: dark ? 'rgba(24,56,88,0.5)' : '#183858',
          }}
        >
          {isAuthenticated && user && !user.photo_url && getInitials(user.full_name)}
          {!isAuthenticated && <CircleUserRound size={20} />}
        </span>
        {showLabel && <span className="hidden sm:inline font-medium">Profile</span>}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-3 w-[18rem] overflow-hidden rounded-[1.5rem] border shadow-2xl z-50"
          style={{
            background: panelBg,
            borderColor: dark ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.08)",
          }}
        >
          <div className="px-5 py-4 border-b" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)" }}>
            <div className="flex items-center gap-3">
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white font-bold bg-cover bg-center"
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
                  {isAuthenticated && user ? user.full_name : "Guest User"}
                </p>
                <p className={`text-xs ${panelText}`}>
                  {isAuthenticated && user ? `${user.role} account` : "Join CINEFIL Today"}
                </p>
              </div>
            </div>
          </div>

          <div className="py-2 max-h-96 overflow-y-auto">
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
                    className={`px-5 pt-3 pb-1.5 text-xs uppercase font-bold tracking-wider ${
                      dark ? "text-white/50" : "text-slate-500"
                    }`}
                  >
                    {sectionName}
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
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                });

                isFirst = false;
              });

              return result;
            })()}
          </div>

          {isAuthenticated && (
            <div className="border-t px-5 py-4" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)" }}>
              <button
                onClick={handleLogoutClick}
                className="flex w-full items-center gap-3 text-left text-sm font-medium transition-colors hover:bg-white/5 focus:outline-none focus:bg-white/5 rounded px-2 py-1"
                style={{ color: "#ef4444" }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}