import React from "react";
import { Home, Film, IndianRupee, ShieldCheck, User } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";

export function DashboardSidebar() {
  const { section, changeSection, user } = useDashboard();
  const isMember = user?.is_member === true || user?.role === 'member';

  const title = "Member Dashboard";
  const subtitle = isMember
    ? "Manage producer and other owner summaries, film rights, and payment history."
    : "You are not yet an approved member. Complete the membership application to unlock member privileges.";

  return (
    <aside
      className="hidden w-[290px] shrink-0 p-6 lg:flex flex-col justify-between border-r border-slate-200/20"
      style={{ 
        background: "linear-gradient(180deg, #1e3a5f 0%, #1a304f 100%)", 
        boxShadow: "2px 0 10px rgba(0,0,0,0.08)" 
      }}
    >
      <div>
        <div className="mb-8 border-b border-white/10 pb-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300/80">Dashboard Suite</p>
          <h2 className="mt-2 text-xl font-black text-white tracking-tight">{title}</h2>
          <p className="mt-2 text-xs leading-relaxed text-white/70 font-medium">{subtitle}</p>
        </div>

        <nav className="space-y-1.5">
          <button
            onClick={() => changeSection("home")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              section === "home" 
                ? "text-white bg-white/15 shadow-sm" 
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Home size={16} />
            <span>Home</span>
          </button>
          <button
            onClick={() => changeSection("films")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              section === "films" 
                ? "text-white bg-white/15 shadow-sm" 
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Film size={16} />
            <span>Films</span>
          </button>
          <button
            onClick={() => changeSection("payments")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              section === "payments" 
                ? "text-white bg-white/15 shadow-sm" 
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <IndianRupee size={16} />
            <span>Payment</span>
          </button>
          <button
            onClick={() => changeSection("membership-details")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              section === "membership-details" 
                ? "text-white bg-white/15 shadow-sm" 
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <User size={16} />
            <span>Membership Details</span>
          </button>
        </nav>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/70">
        <div className="flex items-center gap-2 text-blue-300">
          <ShieldCheck size={14} strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Secure Access Matrix</span>
        </div>
        <p className="mt-2 text-[11px] font-medium leading-relaxed text-white/60">
          All summary, film, and payment records are shown in one workflow so members can review their royalty position quickly.
        </p>
      </div>
    </aside>
  );
}
