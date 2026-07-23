import { useState, useEffect, useRef } from "react";
import { Bell, CheckSquare, FileText, LayoutDashboard, Globe, LogOut } from "lucide-react";
import { ProfileMenu } from "./ProfileMenu";
import { useAuth } from "../../../context/AuthContext";
import { notificationService } from "../../../services/notificationService";
import { useTranslation } from "../../contexts/LanguageContext";

export type Page =
  | "home"
  | "governance"
  | "governing-board"
  | "honorary-board"
  | "committee"
  | "legal-advisor"
  | "producers-owners"
  | "membership-form"
  | "films"
  | "schemes"
  | "contact"
  | "license-form"
  | "login"
  | "mentor-dashboard"
  | "member-dashboard"
  | "officer-dashboard"
  | "profile"
  | "forgot-password"
  | "change-password";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const { language, setLanguage, t } = useTranslation();

  const handleLogoutClick = async () => {
    try {
      await logout();
      onNavigate("home" as Page);
    } catch (e) {
      console.error("Logout failed", e);
    }
  };
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showMembership, setShowMembership] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);
  const membershipDropdownRef = useRef<HTMLDivElement>(null);

  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationService.getUnreadCount();
      if (res.success) {
        setUnreadCount(res.unread_count);
      }
    } catch (e) {
      // Quietly ignore auth errors
    }
  };

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationService.getNotifications();
      // Django returns a paginated list of results or list directly
      if (res.results) {
        setNotifications(res.results);
      } else {
        setNotifications(res);
      }
    } catch (e) {
      // Fail silently
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      fetchNotifications();
      const interval = setInterval(fetchUnreadCount, 30000); // refresh every 30s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (menuDropdownRef.current && !menuDropdownRef.current.contains(event.target as Node)) {
        setShowMenuDropdown(false);
      }
      if (membershipDropdownRef.current && !membershipDropdownRef.current.contains(event.target as Node)) {
        setShowMembership(false);
      }
    };
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleBellClick = async () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      await fetchNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setUnreadCount(0);
      fetchNotifications();
    } catch (e) {
      // Silent error
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    try {
      if (!notif.is_read) {
        await notificationService.markRead(notif.id);
        fetchUnreadCount();
      }
      setShowDropdown(false);
      if (notif.link) {
        // If relative link, navigate via SPA router
        if (notif.link.startsWith("/")) {
          const pageName = notif.link.replace("/", "") as Page;
          onNavigate(pageName);
        } else {
          window.location.href = notif.link;
        }
      }
    } catch (e) {
      // Ignore
    }
  };

  const isOfficer = user?.is_membership_executive || user?.is_rights_verification_officer || user?.is_legal_officer || user?.is_ceo_authorised_officer || user?.is_membership_committee_member || ['admin', 'membership_executive', 'rights_verification_officer', 'legal_officer', 'ceo', 'membership_committee'].includes(user?.role || '');

  const isMember = user?.is_member === true || user?.membership_status === 'approved' || user?.role === 'member';

  const officerDashboardLabel = user?.is_ceo_authorised_officer || user?.role === 'ceo' ? 'CEO Dashboard' :
    user?.is_membership_executive || user?.role === 'membership_executive' ? 'Executive Dashboard' :
      user?.is_legal_officer || user?.role === 'legal_officer' ? 'Legal Dashboard' :
        user?.is_rights_verification_officer || user?.role === 'rights_verification_officer' ? 'Verification Dashboard' :
          'Officer Dashboard';


  return (
    <nav
      className="sticky top-0 z-50 border-b border-white/10 shadow-lg"
      style={{
        background: "linear-gradient(180deg, #0f2540 0%, #183858 100%)",
        backdropFilter: "blur(10px)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate(isOfficer ? "officer-dashboard" : "home")}
          className="flex items-center gap-3 transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-lg p-1"
          aria-label="Go to home"
        >
          <img
            src="/dist/assets/Cinefil-New-Logo-Small-Header-150x150-C1KSNnOQ.png"
            alt="Cinefil logo"
            className="h-12 w-12 object-cover"
            style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}
          />
        </button>

        {/* Navigation Links */}
        {!isAuthenticated && (
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-white/80">
            <button onClick={() => onNavigate("home")} className={`hover:text-white transition-colors ${currentPage === 'home' ? 'text-white font-bold' : ''}`}>{t("Home")}</button>

            <div className="relative" ref={menuDropdownRef}>
              <button
                onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                {t("Governance")} ▾
              </button>
              {showMenuDropdown && (
                <div className="absolute left-0 mt-3 w-48 rounded-none border border-white/10 shadow-2xl bg-gradient-to-b from-[#0f2540] to-[#183858] py-2 z-[70]">
                  <button onClick={() => { onNavigate("governance"); setShowMenuDropdown(false); }} className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors">{t("Governance")}</button>
                  <button onClick={() => { onNavigate("governing-board"); setShowMenuDropdown(false); }} className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors">{t("Governing Board")}</button>
                  <button onClick={() => { onNavigate("honorary-board"); setShowMenuDropdown(false); }} className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors">{t("Honorary Board")}</button>
                  <button onClick={() => { onNavigate("committee"); setShowMenuDropdown(false); }} className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors">{t("Committee")}</button>
                  <button onClick={() => { onNavigate("legal-advisor"); setShowMenuDropdown(false); }} className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors">{t("Legal Advisor")}</button>
                </div>
              )}
            </div>

            <div className="relative" ref={membershipDropdownRef}>
              <button
                onClick={() => setShowMembership(!showMembership)}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                {t("Join Cinefil")} ▾
              </button>
              {showMembership && (
                <div className="absolute left-0 mt-3 w-48 rounded-none border border-white/10 shadow-2xl bg-gradient-to-b from-[#0f2540] to-[#183858] py-2 z-[70]">
                  <button onClick={() => { onNavigate("membership-form"); setShowMembership(false); }} className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors">{t("Membership Form")}</button>
                  <button onClick={() => { onNavigate("license-form"); setShowMembership(false); }} className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors">{t("License Form")}</button>
                </div>
              )}
            </div>


            <button onClick={() => onNavigate("schemes")} className={`hover:text-white transition-colors ${currentPage === 'schemes' ? 'text-white font-bold' : ''}`}>{t("Schemes")}</button>
            <button onClick={() => onNavigate("films")} className={`hover:text-white transition-colors ${currentPage === 'films' ? 'text-white font-bold' : ''}`}>{t("Works")}</button>
            <button onClick={() => onNavigate("contact")} className={`hover:text-white transition-colors ${currentPage === 'contact' ? 'text-white font-bold' : ''}`}>{t("Contact")}</button>
          </div>
        )}

        <div className="flex items-center gap-3 relative">
          {!isAuthenticated && (
            <>
              {/* Language Switcher */}
              {/* <button
                onClick={() => setLanguage(language === "EN" ? "HI" : "EN")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs font-bold text-white transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <Globe size={14} />
                <span>{language === "EN" ? "हिन्दी" : "English"}</span>
              </button> */}

              <button
                onClick={() => onNavigate("login")}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--cinefil-gold)] px-4 py-2 text-sm font-bold text-[#0a1e35] hover:bg-[var(--cinefil-gold-hover)] transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                {t("Member Login")}
              </button>
            </>
          )}

          {isAuthenticated && isMember && !isOfficer && (
            <button
              onClick={() => onNavigate("member-dashboard")}
              className="hidden lg:inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label="Member Dashboard"
            >
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">Member Dashboard</span>
            </button>
          )}

          {isAuthenticated && isOfficer && (
            <button
              onClick={() => onNavigate("officer-dashboard")}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--cinefil-gold)] bg-[var(--cinefil-gold)]/10 px-4 py-2 text-sm font-medium text-[var(--cinefil-gold)] hover:bg-[var(--cinefil-gold)]/20 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--cinefil-gold)]/50"
              aria-label="Officer Dashboard"
            >
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">
                {officerDashboardLabel}
              </span>
            </button>
          )}

          {(!isAuthenticated || (!user?.is_member && !isOfficer)) && (
            <button
              onClick={() => onNavigate("membership-form")}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-white/20 hidden lg:inline-flex"
              aria-label="Membership Form"
            >
              <FileText size={16} />
              <span className="hidden sm:inline">Membership Application</span>
            </button>
          )}

          {isAuthenticated && (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={handleBellClick}
                className="relative h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/85 inline-flex hover:bg-white/5 transition-all focus:outline-none focus:ring-2 focus:ring-white/20"
                aria-label="Notifications"
                type="button"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-[#0a1e35]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showDropdown && (
                <div className="fixed left-4 right-4 top-[80px] sm:absolute sm:left-auto sm:right-0 sm:top-auto mt-2 sm:mt-3 sm:w-96 overflow-hidden rounded-none border border-white/10 shadow-2xl bg-gradient-to-b from-[#0f2540] to-[#183858] text-white z-[70]">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <span className="text-sm font-bold">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400/50 rounded px-2 py-1"
                      >
                        <CheckSquare size={13} />
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-white/50">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`px-4 py-3 cursor-pointer hover:bg-white/5 transition ${!notif.is_read ? 'bg-white/[0.03]' : ''}`}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleNotificationClick(notif);
                            }
                          }}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className={`text-xs font-bold ${!notif.is_read ? 'text-amber-400' : 'text-white/80'}`}>
                              {notif.title}
                            </span>
                            {!notif.is_read && (
                              <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-white/75 mt-1 leading-relaxed">{notif.message}</p>
                          <span className="text-[10px] text-white/40 block mt-2">
                            {new Date(notif.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {isAuthenticated && isOfficer ? (
            <button
              onClick={handleLogoutClick}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 px-3.5 py-2 text-xs font-bold text-rose-400 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/30 cursor-pointer"
              aria-label="Logout"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <div className={!isAuthenticated ? "lg:hidden" : ""}>
              <ProfileMenu currentPage={currentPage} onNavigate={onNavigate} dark />
            </div>
          )}
        </div>
      </div>
    </nav >
  );
}