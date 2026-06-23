import { useState, useEffect, useRef } from "react";
import { Bell, CheckSquare } from "lucide-react";
import { ProfileMenu } from "./ProfileMenu";
import { useAuth } from "../../context/AuthContext";
import { notificationService } from "../../services/notificationService";

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
  | "signup"
  | "mentor-dashboard"
  | "member-dashboard"
  | "profile";

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
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);

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
          onClick={() => onNavigate("home")} 
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

        
        <div className="flex items-center gap-3 relative">
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
                <div className="absolute right-0 mt-3 w-80 sm:w-96 overflow-hidden rounded-[1.5rem] border border-white/10 shadow-2xl bg-gradient-to-b from-[#0f2540] to-[#183858] text-white z-[70]">
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
          <ProfileMenu currentPage={currentPage} onNavigate={onNavigate} dark />
        </div>
      </div>
    </nav>
  );
}