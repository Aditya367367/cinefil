import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { Navbar, type Page } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/HomePage";
import { DashboardPage } from "./components/DashboardPage";
import { GoverningBoard } from "./components/GoverningBoard";
import { HonoraryBoard } from "./components/HonoraryBoard";
import { CommitteePage } from "./components/CommitteePage";
import { LegalAdvisorPage } from "./components/LegalAdvisorPage";
import { ProducersPage } from "./components/ProducersPage";
import { MembershipFormPage } from "./components/MembershipFormPage";
import { FilmsPage } from "./components/FilmsPage";
import { SchemesPage } from "./components/SchemesPage";
import { ContactPage } from "./components/ContactPage";
import { LicenseFormPage } from "./components/LicenseFormPage";
import { LoginPage } from "./components/LoginPage";
import { ProfilePage } from "./components/ProfilePage";

import { SignupPage } from "./components/SignupPage";
import { GovernancePage } from "./components/GovernancePage";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import { LoadingScreen } from "./components/LoadingScreen";

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
  "signup",
  "mentor-dashboard",
  "member-dashboard",
  "profile",
];

function pathToPage(path: string): Page | string {
  const normalized = path.replace(/^\/+|\/+$/g, "");
  if (normalized.startsWith('profile/')) {
    const slug = normalized.substring('profile/'.length);
    return `profile/${slug}`;
  }
  if (normalized.startsWith('member-dashboard/')) {
    return normalized; // Keep the full path for dashboard sub-routes
  }
  if (normalized.startsWith('mentor-dashboard/')) {
    return normalized; // Keep the full path for dashboard sub-routes
  }
  return normalized === "" ? "home" : (validPages.includes(normalized as Page) ? (normalized as Page) : "home");
}

function pageToPath(page: Page | string) {
  return page === "home" ? "/" : `/${page}`;
}

function renderPage(page: Page | string, navigate: (p: Page | string) => void) {
  switch (page) {
    case "home":            return <HomePage onNavigate={navigate} />;
    case "governance":      return <GovernancePage />;
    case "governing-board": return <GoverningBoard onNavigate={navigate} />;
    case "honorary-board":  return <HonoraryBoard onNavigate={navigate} />;
    case "committee":       return <CommitteePage onNavigate={navigate} />;
    case "legal-advisor":   return <LegalAdvisorPage onNavigate={navigate} />;
    case "producers-owners":return <ProducersPage onNavigate={navigate} />;
    case "membership-form": return <MembershipFormPage />;
    case "films":           return <FilmsPage />;
    case "schemes":         return <SchemesPage />;
    case "contact":         return <ContactPage />;
    case "license-form":    return <LicenseFormPage />;
    case "login":           return <LoginPage onNavigate={navigate} />;
    case "profile":         return <ProfilePage onNavigate={navigate} />;
    case "signup":          return <SignupPage onNavigate={navigate} />;
    default:
      if (page.startsWith('member-dashboard/')) {
        const section = (page.split('/')[1] || 'home') as any;
        return <DashboardPage role="member" onNavigate={navigate} initialSection={section} />;
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
    const newPath = pageToPath(page);
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
      
      if (isAuthenticated && (currentPage === 'login' || currentPage === 'signup')) {
        // Redirect logged-in users to home
        navigate('home');
      } else if (!isAuthenticated && (currentPage === 'member-dashboard' || currentPage === 'mentor-dashboard' || currentPage === 'profile')) {
        // Redirect unauthenticated users away from protected pages
        navigate('login');
      } else if (isAuthenticated && currentPage === 'member-dashboard' && !isMember) {
        // Redirect non-approved members away from dashboard
        navigate('membership-form');
      }
    }
  }, [isAuthenticated, currentPage, isLoading, user]);

  if (isLoading || isPageLoading) {
    
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f4f5f7" }}>
      <Navbar currentPage={currentPage as Page} onNavigate={navigate} />
      <main className="flex-1">
        {renderPage(currentPage, navigate)}
      </main>
      {!currentPage.startsWith('mentor-dashboard') && !currentPage.startsWith('member-dashboard') && currentPage !== "profile" && (
        <Footer onNavigate={navigate} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SnackbarProvider>
          <MainApp />
        </SnackbarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}