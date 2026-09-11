import { useEffect, useState, lazy, Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { Navbar, type Page } from "./components/pages/Navbar";
import { Footer } from "./components/pages/Footer";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { SnackbarProvider, useSnackbar } from "./contexts/SnackbarContext";
import { LoadingScreen } from "./components/pages/LoadingScreen";
import { GenericPageSkeleton } from "./components/pages/GenericPageSkeleton";
import { CookieConsent } from "./components/ui/CookieConsent";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AnimatePresence } from "motion/react";
import { PageTransition } from "../components/ui/PageTransition";

// Lazy-loaded page components for fast initial load & route-level code splitting
const HomePage = lazy(() => import("./components/pages/HomePage").then((m) => ({ default: m.HomePage })));
const DashboardPage = lazy(() => import("./components/pages/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const GoverningBoard = lazy(() => import("./components/pages/GoverningBoard").then((m) => ({ default: m.GoverningBoard })));
const HonoraryBoard = lazy(() => import("./components/pages/HonoraryBoard").then((m) => ({ default: m.HonoraryBoard })));
const CommitteePage = lazy(() => import("./components/pages/CommitteePage").then((m) => ({ default: m.CommitteePage })));
const LegalAdvisorPage = lazy(() => import("./components/pages/LegalAdvisorPage").then((m) => ({ default: m.LegalAdvisorPage })));
const ProducersPage = lazy(() => import("./components/pages/ProducersPage").then((m) => ({ default: m.ProducersPage })));
const MembershipFormPage = lazy(() => import("./components/pages/MembershipFormPage").then((m) => ({ default: m.MembershipFormPage })));
const FilmsPage = lazy(() => import("./components/pages/FilmsPage").then((m) => ({ default: m.FilmsPage })));
const SchemesPage = lazy(() => import("./components/pages/SchemesPage").then((m) => ({ default: m.SchemesPage })));
const ContactPage = lazy(() => import("./components/pages/ContactPage").then((m) => ({ default: m.ContactPage })));
const LicenseFormPage = lazy(() => import("./components/pages/LicenseFormPage").then((m) => ({ default: m.LicenseFormPage })));
const LoginPage = lazy(() => import("./components/pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const ForgotPasswordPage = lazy(() => import("./components/pages/ForgotPasswordPage").then((m) => ({ default: m.ForgotPasswordPage })));
const ChangePasswordPage = lazy(() => import("./components/pages/ChangePasswordPage").then((m) => ({ default: m.ChangePasswordPage })));
const ProfilePage = lazy(() => import("./components/pages/ProfilePage").then((m) => ({ default: m.ProfilePage })));
const GovernancePage = lazy(() => import("./components/pages/GovernancePage").then((m) => ({ default: m.GovernancePage })));
const OfficerDashboardPage = lazy(() => import("./components/pages/OfficerDashboardPage").then((m) => ({ default: m.OfficerDashboardPage })));

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
  const { showSnackbar } = useSnackbar();

  const navigate = (page: Page | string) => {
    const newPath = pageToPath(page, user);
    window.history.pushState({ page }, "", newPath);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const isOfficer = user?.is_membership_executive || user?.is_rights_verification_officer || user?.is_legal_officer || user?.is_ceo_authorised_officer || user?.is_membership_committee_member || ['admin', 'membership_executive', 'rights_verification_officer', 'legal_officer', 'ceo', 'membership_committee'].includes(user?.role || '');

  // Auth routing protection
  useEffect(() => {
    if (!isLoading) {
      const isMember = user?.is_member === true || user?.membership_status === 'approved' || user?.role === 'member';

      if (isAuthenticated && isOfficer) {
        if (!currentPage.startsWith('officer-dashboard')) {
          navigate('officer-dashboard');
        }
      } else if (isAuthenticated && currentPage === 'login') {
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
        showSnackbar("you are not a member please fill the form first to get membership and access the dashboard", "error");
        navigate('membership-form');
      } else if (isAuthenticated && currentPage === 'officer-dashboard' && !isOfficer) {
        navigate('membership-form');
      } else if (isAuthenticated && currentPage === 'member-dashboard/payments' && !user?.is_prime) {
        showSnackbar("Payments section is only accessible for Prime Members.", "error");
        navigate('member-dashboard');
      }
    }
  }, [isAuthenticated, currentPage, isLoading, user, isOfficer]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f4f5f7" }}>
      {currentPage !== 'login' && currentPage !== 'forgot-password' && currentPage !== 'change-password' && <Navbar currentPage={currentPage as Page} onNavigate={navigate} />}
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <PageTransition pageKey={currentPage} key={currentPage}>
            <Suspense fallback={<GenericPageSkeleton />}>
              {renderPage(currentPage, navigate)}
            </Suspense>
          </PageTransition>
        </AnimatePresence>
      </main>
      {currentPage !== 'login' && currentPage !== 'forgot-password' && currentPage !== 'change-password' && !currentPage.startsWith('mentor-dashboard') && !currentPage.startsWith('member-dashboard') && !currentPage.startsWith('officer-dashboard') && !currentPage.startsWith('profile') && !isOfficer && (
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