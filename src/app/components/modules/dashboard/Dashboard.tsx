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
  const { isLoading, section, changeSection, user, isPrime, isUnderReview } = useDashboard();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMember = user?.is_member === true || user?.role === 'member';

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

      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#1e3a5f] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div>
            <h2 className="text-sm font-bold tracking-tight">Member Dashboard</h2>
            <p className="text-[10px] text-blue-200/80 uppercase font-semibold tracking-wider">CINEFIL Suite</p>
          </div>
        </div>

        <div>
          {isPrime ? (
            <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full">
              👑 Prime
            </span>
          ) : isUnderReview ? (
            <span className="bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full">
              ⏳ Review
            </span>
          ) : isMember ? (
            <span className="bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full">
              Associate
            </span>
          ) : null}
        </div>
      </div>

      {/* Mobile Sidebar Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-[#1e3a5f] text-white p-6 flex flex-col justify-between shadow-2xl z-10">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold">CINEFIL</h3>
                  <p className="text-xs text-blue-200/80 font-medium">Member Portal</p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => { changeSection("home"); setMobileMenuOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                    section === "home" ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10"
                  }`}
                >
                  <Home size={18} />
                  <span>Home</span>
                </button>

                <button
                  onClick={() => { changeSection("films"); setMobileMenuOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                    section === "films" ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10"
                  }`}
                >
                  <Film size={18} />
                  <span>Films</span>
                </button>

                {user?.is_prime && (
                  <button
                    onClick={() => { changeSection("payments"); setMobileMenuOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                      section === "payments" ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <IndianRupee size={18} />
                    <span>Payment</span>
                  </button>
                )}

                <button
                  onClick={() => { changeSection("membership-details"); setMobileMenuOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                    section === "membership-details" ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10"
                  }`}
                >
                  <User size={18} />
                  <span>Membership Details</span>
                </button>
              </nav>
            </div>

            <div className="border-t border-white/10 pt-4 text-[11px] text-white/60">
              <div className="flex items-center gap-1.5 text-blue-300 font-bold mb-1">
                <ShieldCheck size={14} />
                <span>Protected Member Session</span>
              </div>
              <p>Registered Member ID: #{user?.id || "N/A"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 w-full relative flex flex-col min-h-screen pt-14 lg:pt-0">
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
            {section === "payments" && user?.is_prime && <SectionPayments onNavigate={onNavigate} />}
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
