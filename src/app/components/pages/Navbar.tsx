import { useState, useEffect, useRef } from "react";
import { Bell, CheckSquare, FileText, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ProfileMenu } from "./ProfileMenu";
import { useAuth } from "../../../context/AuthContext";
import { notificationService } from "../../../services/notificationService";
import { useTranslation } from "../../contexts/LanguageContext";
import LogoImage from "../../../imports/Cinefil-New-Logo-Small-Header-150x150.png";

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
  const { t } = useTranslation();

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
      const interval = setInterval(fetchUnreadCount, 30000);
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

  const isOfficer =
    user?.is_membership_executive ||
    user?.is_rights_verification_officer ||
    user?.is_legal_officer ||
    user?.is_ceo_authorised_officer ||
    user?.is_membership_committee_member ||
    [
      "admin",
      "membership_executive",
      "rights_verification_officer",
      "legal_officer",
      "ceo",
      "membership_committee",
    ].includes(user?.role || "");

  const isMember = user?.is_member === true || user?.membership_status === "approved" || user?.role === "member";

  const officerDashboardLabel =
    user?.is_ceo_authorised_officer || user?.role === "ceo"
      ? "CEO Dashboard"
      : user?.is_membership_executive || user?.role === "membership_executive"
      ? "Executive Dashboard"
      : user?.is_legal_officer || user?.role === "legal_officer"
      ? "Legal Dashboard"
      : user?.is_rights_verification_officer || user?.role === "rights_verification_officer"
      ? "Verification Dashboard"
      : "Officer Dashboard";

  const isGovernanceActive = [
    "governance",
    "governing-board",
    "honorary-board",
    "committee",
    "legal-advisor",
  ].includes(currentPage);

  const isJoinActive = ["membership-form", "license-form"].includes(currentPage);

  return (
    <nav
      className="sticky top-0 z-50 border-b border-white/10 shadow-xl"
      style={{
        background: "linear-gradient(180deg, rgba(15, 37, 64, 0.95) 0%, rgba(24, 56, 88, 0.95) 100%)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <button
          onClick={() => onNavigate(isOfficer ? "officer-dashboard" : "home")}
          className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 focus:outline-none rounded-xl p-1 cursor-pointer"
          aria-label="Go to home"
        >
          <img
            src={LogoImage}
            alt="Cinefil Logo"
            className="h-12 w-12 object-contain rounded-md"
            style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.5))" }}
          />
          <div className="text-left hidden sm:block">
            <span className="text-white font-extrabold tracking-wider text-base leading-none block font-display">
              CINEFIL
            </span>
            <span className="text-[10px] text-[var(--cinefil-gold)] tracking-widest uppercase font-semibold">
              Copyright Society
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        {!isAuthenticated && (
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-white/80">
            {/* Home */}
            <button
              onClick={() => onNavigate("home")}
              className={`px-3.5 py-2 rounded-xl transition-all relative ${
                currentPage === "home"
                  ? "text-white font-bold bg-white/10 shadow-inner"
                  : "hover:text-white hover:bg-white/5"
              }`}
            >
              {t("Home")}
              {currentPage === "home" && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-[var(--cinefil-gold)]"
                />
              )}
            </button>

            {/* Governance Dropdown */}
            <div className="relative" ref={menuDropdownRef}>
              <button
                onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  isGovernanceActive
                    ? "text-white font-bold bg-white/10 shadow-inner"
                    : "hover:text-white hover:bg-white/5"
                }`}
              >
                {t("Governance")}
                <ChevronDown size={14} className={`transition-transform duration-200 ${showMenuDropdown ? "rotate-180 text-[var(--cinefil-gold)]" : ""}`} />
                {isGovernanceActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-[var(--cinefil-gold)]"
                  />
                )}
              </button>

              <AnimatePresence>
                {showMenuDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-56 rounded-2xl border border-white/15 shadow-2xl bg-[#0f2540] py-2 z-[70] backdrop-blur-xl overflow-hidden"
                  >
                    {[
                      { label: t("Governance Overview"), page: "governance" as Page },
                      { label: t("Governing Board"), page: "governing-board" as Page },
                      { label: t("Honorary Board"), page: "honorary-board" as Page },
                      { label: t("Committee"), page: "committee" as Page },
                      { label: t("Legal Advisor"), page: "legal-advisor" as Page },
                    ].map((item) => (
                      <button
                        key={item.page}
                        onClick={() => {
                          onNavigate(item.page);
                          setShowMenuDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between ${
                          currentPage === item.page
                            ? "bg-[var(--cinefil-gold)]/20 text-[var(--cinefil-gold)]"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Join Cinefil Dropdown */}
            <div className="relative" ref={membershipDropdownRef}>
              <button
                onClick={() => setShowMembership(!showMembership)}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  isJoinActive
                    ? "text-white font-bold bg-white/10 shadow-inner"
                    : "hover:text-white hover:bg-white/5"
                }`}
              >
                {t("Join Cinefil")}
                <ChevronDown size={14} className={`transition-transform duration-200 ${showMembership ? "rotate-180 text-[var(--cinefil-gold)]" : ""}`} />
                {isJoinActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-[var(--cinefil-gold)]"
                  />
                )}
              </button>

              <AnimatePresence>
                {showMembership && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-56 rounded-2xl border border-white/15 shadow-2xl bg-[#0f2540] py-2 z-[70] backdrop-blur-xl overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        onNavigate("membership-form");
                        setShowMembership(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors ${
                        currentPage === "membership-form"
                          ? "bg-[var(--cinefil-gold)]/20 text-[var(--cinefil-gold)]"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {t("Membership Application")}
                    </button>
                    <button
                      onClick={() => {
                        onNavigate("license-form");
                        setShowMembership(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors ${
                        currentPage === "license-form"
                          ? "bg-[var(--cinefil-gold)]/20 text-[var(--cinefil-gold)]"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {t("License Application (CPL)")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Schemes */}
            <button
              onClick={() => onNavigate("schemes")}
              className={`px-3.5 py-2 rounded-xl transition-all relative ${
                currentPage === "schemes"
                  ? "text-white font-bold bg-white/10 shadow-inner"
                  : "hover:text-white hover:bg-white/5"
              }`}
            >
              {t("Schemes")}
              {currentPage === "schemes" && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-[var(--cinefil-gold)]"
                />
              )}
            </button>

            {/* Works */}
            <button
              onClick={() => onNavigate("films")}
              className={`px-3.5 py-2 rounded-xl transition-all relative ${
                currentPage === "films"
                  ? "text-white font-bold bg-white/10 shadow-inner"
                  : "hover:text-white hover:bg-white/5"
              }`}
            >
              {t("Works")}
              {currentPage === "films" && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-[var(--cinefil-gold)]"
                />
              )}
            </button>

            {/* Contact */}
            <button
              onClick={() => onNavigate("contact")}
              className={`px-3.5 py-2 rounded-xl transition-all relative ${
                currentPage === "contact"
                  ? "text-white font-bold bg-white/10 shadow-inner"
                  : "hover:text-white hover:bg-white/5"
              }`}
            >
              {t("Contact")}
              {currentPage === "contact" && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-[var(--cinefil-gold)]"
                />
              )}
            </button>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3 relative">
          {!isAuthenticated && (
            <>
              <button
                onClick={() => onNavigate("login")}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--cinefil-gold)] to-[var(--cinefil-gold-light)] px-5 py-2.5 text-xs sm:text-sm font-bold text-[var(--cinefil-navy)] hover:shadow-lg hover:shadow-[var(--cinefil-gold)]/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-md"
              >
                {t("Member Login")}
              </button>
            </>
          )}

          {isAuthenticated && isMember && !isOfficer && (
            <button
              onClick={() => onNavigate("member-dashboard")}
              className="hidden lg:inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-white/20 transition-all cursor-pointer shadow-sm"
              aria-label="Member Dashboard"
            >
              <LayoutDashboard size={16} className="text-[var(--cinefil-gold)]" />
              <span>Member Dashboard</span>
            </button>
          )}

          {isAuthenticated && isOfficer && (
            <button
              onClick={() => onNavigate("officer-dashboard")}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--cinefil-gold)] bg-[var(--cinefil-gold)]/15 px-4 py-2.5 text-xs sm:text-sm font-bold text-[var(--cinefil-gold)] hover:bg-[var(--cinefil-gold)]/25 transition-all shadow-md cursor-pointer"
              aria-label="Officer Dashboard"
            >
              <LayoutDashboard size={16} />
              <span>{officerDashboardLabel}</span>
            </button>
          )}

          {(!isAuthenticated || (!user?.is_member && !isOfficer)) && (
            <button
              onClick={() => onNavigate("membership-form")}
              className="hidden xl:inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white/90 hover:bg-white/10 transition-all cursor-pointer"
              aria-label="Membership Form"
            >
              <FileText size={15} className="text-[var(--cinefil-gold)]" />
              <span>Apply for Membership</span>
            </button>
          )}

          {/* Notifications Bell */}
          {isAuthenticated && (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={handleBellClick}
                className="relative h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white/90 inline-flex hover:bg-white/10 transition-all cursor-pointer"
                aria-label="Notifications"
                type="button"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-[#0f2540] animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="fixed left-4 right-4 top-[80px] sm:absolute sm:left-auto sm:right-0 sm:top-auto mt-3 sm:w-96 overflow-hidden rounded-2xl border border-white/15 shadow-2xl bg-[#0f2540] text-white z-[70] backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--cinefil-gold)]">
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
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
                            className={`px-4 py-3 cursor-pointer hover:bg-white/10 transition ${
                              !notif.is_read ? "bg-white/[0.04]" : ""
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span
                                className={`text-xs font-bold ${
                                  !notif.is_read ? "text-[var(--cinefil-gold)]" : "text-white/80"
                                }`}
                              >
                                {notif.title}
                              </span>
                              {!notif.is_read && (
                                <span className="h-2 w-2 rounded-full bg-[var(--cinefil-gold)] shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-xs text-white/70 mt-1 leading-relaxed">{notif.message}</p>
                            <span className="text-[10px] text-white/40 block mt-2">
                              {new Date(notif.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Logout for Officers / ProfileMenu for Members & Mobile */}
          {isAuthenticated && isOfficer ? (
            <button
              onClick={handleLogoutClick}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/15 hover:bg-rose-500/25 px-3.5 py-2 text-xs font-bold text-rose-300 transition-all cursor-pointer shadow-sm"
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
    </nav>
  );
}
