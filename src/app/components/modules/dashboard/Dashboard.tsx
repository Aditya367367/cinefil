import React, { useState } from "react";
import { DashboardProvider, DashboardRole, DashboardSection, useDashboard } from "./context/DashboardContext";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { DashboardPageSkeleton } from "./components/DashboardPageSkeleton";
import { SectionHome } from "./sections/SectionHome";
import { SectionFilms } from "./sections/SectionFilms";
import { SectionCast } from "./sections/SectionCast";
import { SectionDocuments } from "./sections/SectionDocuments";
import { SectionRightHolders } from "./sections/SectionRightHolders";
import { SectionShares } from "./sections/SectionShares";
import { SectionRoyaltyDetails } from "./sections/SectionRoyaltyDetails";
import { SectionPayments } from "./sections/SectionPayments";
import { SectionMembershipDetails } from "./sections/SectionMembershipDetails";
import { Menu, X, Home, Film, IndianRupee, User, ShieldCheck } from "lucide-react";

interface DashboardProps {
  role: DashboardRole;
  onNavigate: (page: any) => void;
  initialSection?: DashboardSection;
}

function DashboardContent({ onNavigate }: { onNavigate: (page: any) => void }) {
  const { isLoading, section, changeSection, user } = useDashboard();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-50 overflow-hidden">
        <DashboardSidebar />
        <div className="flex-1 w-full relative">
          <DashboardPageSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden font-sans selection:bg-blue-200">
      {/* Desktop Sidebar */}
      <DashboardSidebar />


      {/* Main Content Area */}
      <div className="flex-1 w-full relative flex flex-col min-h-screen">


        <div className="absolute inset-0 bg-slate-50 -z-10" />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 lg:px-12 w-full max-w-7xl mx-auto custom-scrollbar relative z-0">
          <div className="mx-auto w-full pb-20">
            {section === "home" && <SectionHome />}
            {section === "films" && <SectionFilms />}
            {section === "cast" && <SectionCast />}
            {section === "documents" && <SectionDocuments />}
            {section === "right-holders" && <SectionRightHolders />}
            {section === "shares" && <SectionShares />}
            {section === "royalty-details" && <SectionRoyaltyDetails />}
            {section === "payments" && <SectionPayments onNavigate={onNavigate} />}
            {section === "membership-details" && <SectionMembershipDetails />}
          </div>
        </main>
      </div>
    </div>
  );
}

export function Dashboard({ role, onNavigate, initialSection }: DashboardProps) {
  return (
    <DashboardProvider role={role} initialSection={initialSection}>
      <DashboardContent onNavigate={onNavigate} />
    </DashboardProvider>
  );
}
