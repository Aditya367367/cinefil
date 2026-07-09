import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { Navbar, type Page } from "./components/pages/Navbar";
import { Footer } from "./components/pages/Footer";
import { HomePage } from "./components/pages/HomePage";
import { DashboardPage } from "./components/pages/DashboardPage";
import { GoverningBoard } from "./components/pages/GoverningBoard";
import { HonoraryBoard } from "./components/pages/HonoraryBoard";
import { CommitteePage } from "./components/pages/CommitteePage";
import { LegalAdvisorPage } from "./components/pages/LegalAdvisorPage";
import { ProducersPage } from "./components/pages/ProducersPage";
import { MembershipFormPage } from "./components/pages/MembershipFormPage";
import { FilmsPage } from "./components/pages/FilmsPage";
import { SchemesPage } from "./components/pages/SchemesPage";
import { ContactPage } from "./components/pages/ContactPage";
import { LicenseFormPage } from "./components/pages/LicenseFormPage";
import { LoginPage } from "./components/pages/LoginPage";
import { ForgotPasswordPage } from "./components/pages/ForgotPasswordPage";
import { ChangePasswordPage } from "./components/pages/ChangePasswordPage";
import { ProfilePage } from "./components/pages/ProfilePage";
import { GovernancePage } from "./components/pages/GovernancePage";
import { OfficerDashboardPage } from "./components/pages/OfficerDashboardPage";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { LoadingScreen } from "./components/pages/LoadingScreen";
import { CookieConsent } from "./components/ui/CookieConsent";
import { LanguageProvider } from "./contexts/LanguageContext";

const validPages: Page[] = [
  "home",
  "governance",
  "governing-board",
  "honorary-board",
  "committee",
  "legal-advisor",
  "producers-owners",
  "membership-form",
  "films",
  "schemes",
  "contact",
  "license-form",
  "login",
  "mentor-dashboard",
  "member-dashboard",
  "officer-dashboard",
  "profile",
  "forgot-password",
  "change-password",
];

function pathToPage(path: string): Page | string {
  const normalized = path.replace(/^\/+|\/+$/g, "");
  if (normalized.startsWith('profile/')) {
    return normalized; // Keep the full profile path including slug!
  }
  if (normalized.startsWith('member-dashboard/')) {
    return normalized; // Keep the full path for dashboard sub-routes
  }
  if (normalized.startsWith('officer-dashboard/')) {
    return normalized; // Keep the full path for dashboard sub-routes
  }
  if (normalized.startsWith('mentor-dashboard/')) {
    return normalized; // Keep the full path for dashboard sub-routes
  }
  return normalized === "" ? "home" : (validPages.includes(normalized as Page) ? (normalized as Page) : "home");
}

function pageToPath(page: Page | string, user?: any) {
  if (page === "home") return "/";
  if (page === "profile" && user) {
    const userSlug = user.member_slug || user.slug || `${user.username || user.id}-${user.id}`;
    return `/profile/${userSlug}`;
  }
  if (page.startsWith('profile/')) return `/${page}`;
  return `/${page}`;
}

function renderPage(page: Page | string, navigate: (p: Page | string) => void) {
  switch (page) {
    case "home": return <HomePage onNavigate={navigate} />;
    case "governance": return <GovernancePage />;
    case "governing-board": return <GoverningBoard onNavigate={navigate} />;
    case "honorary-board": return <HonoraryBoard onNavigate={navigate} />;
    case "committee": return <CommitteePage onNavigate={navigate} />;
    case "legal-advisor": return <LegalAdvisorPage onNavigate={navigate} />;
    case "producers-owners": return <ProducersPage onNavigate={navigate} />;
    case "membership-form": return <MembershipFormPage />;
    case "films": return <FilmsPage />;
    case "schemes": return <SchemesPage />;
    case "contact": return <ContactPage />;
    case "license-form": return <LicenseFormPage />;
    case "login": return <LoginPage onNavigate={navigate} />;
    case "forgot-password": return <ForgotPasswordPage onNavigate={navigate} />;
    case "change-password": return <ChangePasswordPage onNavigate={navigate} />;
    case "profile": return <ProfilePage onNavigate={navigate} />;
    default:
      if (page.startsWith('member-dashboard/')) {
        const section = (page.split('/')[1] || 'home') as any;
        return <DashboardPage role="member" onNavigate={navigate} initialSection={section} />;
      }
      if (page.startsWith('officer-dashboard/')) {
        return <OfficerDashboardPage onNavigate={navigate} />;
      }
      if (page.startsWith('mentor-dashboard/')) {
        const section = (page.split('/')[1] || 'home') as any;
        return <DashboardPage role="member" onNavigate={navigate} initialSection={section} />;
      }
      if (page.startsWith('profile/')) {
        return <ProfilePage onNavigate={navigate} />;
      }
      if (page === 'mentor-dashboard') return <DashboardPage role="member" onNavigate={navigate} />;
      if (page === 'member-dashboard') return <DashboardPage role="member" onNavigate={navigate} />;
      if (page === 'officer-dashboard') return <OfficerDashboardPage onNavigate={navigate} />;
      return <HomePage onNavigate={navigate} />;
  }
}

function MainApp() {
  const [currentPage, setCurrentPage] = useState<Page | string>(() => pathToPage(window.location.pathname));
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(false);

  const navigate = (page: Page | string) => {
    console.log("=== NAVIGATION DEBUG ===");
    console.log("Navigating from:", currentPage);
    console.log("Navigating to:", page);
    console.log("Auth isLoading:", isLoading);
    setIsPageLoading(true);
    const newPath = pageToPath(page, user);
    window.history.pushState({ page }, "", newPath);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setIsPageLoading(false), 1000);
  };

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const page = event.state?.page ? (event.state.page as Page) : pathToPage(window.location.pathname);
      setCurrentPage(page);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const currentPath = pageToPath(currentPage);
    if (window.location.pathname !== currentPath) {
      window.history.replaceState({ page: currentPage }, "", currentPath);
    }
  }, [currentPage]);

  // Auth routing protection
  useEffect(() => {
    if (!isLoading) {
      const isMember = user?.is_member === true || user?.membership_status === 'approved' || user?.role === 'member';
      const isOfficer = user?.is_membership_executive || user?.is_rights_verification_officer || user?.is_legal_officer || user?.is_ceo_authorised_officer || user?.is_membership_committee_member || ['admin', 'membership_executive', 'rights_verification_officer', 'legal_officer', 'ceo', 'membership_committee'].includes(user?.role || '');

      if (isAuthenticated && currentPage === 'login') {
        if (isOfficer) {
          navigate('officer-dashboard');
        } else if (isMember) {
          navigate('member-dashboard');
        } else {
          navigate('membership-form');
        }
      } else if (!isAuthenticated && (currentPage === 'member-dashboard' || currentPage === 'officer-dashboard' || currentPage === 'mentor-dashboard' || (currentPage === 'profile' && (window.location.pathname === '/profile' || window.location.pathname === '/profile/')))) {
        // Redirect unauthenticated users away from protected pages
        navigate('login');
      } else if (isAuthenticated && currentPage === 'member-dashboard' && !isMember && !isOfficer) {
        // Redirect non-approved members away from dashboard
        navigate('membership-form');
      } else if (isAuthenticated && currentPage === 'officer-dashboard' && !isOfficer) {
        navigate('membership-form');
      }
    }
  }, [isAuthenticated, currentPage, isLoading, user]);

  if (isLoading || isPageLoading) {

    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f4f5f7" }}>
      {currentPage !== 'login' && currentPage !== 'forgot-password' && currentPage !== 'change-password' && <Navbar currentPage={currentPage as Page} onNavigate={navigate} />}
      <main className="flex-1">
        {renderPage(currentPage, navigate)}
      </main>
      {currentPage !== 'login' && currentPage !== 'forgot-password' && currentPage !== 'change-password' && !currentPage.startsWith('mentor-dashboard') && !currentPage.startsWith('member-dashboard') && !currentPage.startsWith('officer-dashboard') && !currentPage.startsWith('profile') && (
        <Footer onNavigate={navigate} />
      )}
      <CookieConsent />
      
    </div>
  );

}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SnackbarProvider>
          <LanguageProvider>
            <MainApp />
          </LanguageProvider>
        </SnackbarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}