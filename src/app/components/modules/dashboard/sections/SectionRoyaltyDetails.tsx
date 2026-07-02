import React from "react";
import { ScrollText } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";

export function SectionRoyaltyDetails() {
  const { isMember, royaltyDetails } = useDashboard();

  if (!isMember) return null;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
            <ScrollText size={22} className="stroke-[2]" />
          </span>
          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest" style={{ color: "var(--cinefil-gold)" }}>
              Royalty Distribution
            </p>
            <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Royalty Ledger Statements <span className="text-slate-400 font-medium text-xs sm:text-sm tracking-normal">(Read-Only)</span>
            </h1>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl px-4 py-2 flex flex-col items-start md:items-end shrink-0">
          <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-600">Total Cleared Distributions</span>
          <span className="text-base sm:text-lg font-black text-emerald-700 tracking-tight mt-0.5">
            ₹{royaltyDetails.reduce((acc, curr) => acc + parseFloat(curr.royalty_amount || "0"), 0).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500">
              Audited Statement Registry
            </p>
          </div>
          <span className="text-[10px] bg-slate-200 text-slate-700 font-mono font-bold px-2 py-0.5 rounded-md">
            {royaltyDetails.length} Entries
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50/50 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">
            <div className="col-span-5">Film Production Title</div>
            <div className="col-span-4">Fiscal Audit Window</div>
            <div className="col-span-3 text-right">Disbursed Balance Weight</div>
          </div>

          {royaltyDetails.map((detail) => (
            <div 
              key={detail.id} 
              className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 sm:p-6 md:px-6 md:py-4 items-center hover:bg-slate-50/60 transition-colors"
            >
              <div className="col-span-1 md:col-span-5 flex items-center gap-2.5 min-w-0">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0 hidden md:block"></div>
                <div className="truncate">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
                    {detail.film_title || detail.member_film?.title || 'Unknown Production Stream'}
                  </p>
                  <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1 py-0.2 rounded md:hidden mt-1 inline-block">
                    Ref ID: #{detail.id}
                  </span>
                </div>
              </div>

              <div className="col-span-1 md:col-span-4 flex items-center gap-1.5 md:gap-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 md:hidden">Cycle:</span>
                <p className="text-xs text-slate-600 font-semibold tracking-tight">
                  {detail.distribution?.financial_year?.financial_year || 'N/A Verification Cycle'}
                </p>
              </div>

              <div className="col-span-1 md:col-span-3 text-left md:text-right flex items-center justify-between md:justify-end border-t border-slate-100 md:border-t-0 pt-2.5 md:pt-0 mt-1 md:mt-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 md:hidden">Disbursed Weight:</span>
                <p className="text-sm sm:text-base font-black text-emerald-600 font-mono tracking-tight bg-emerald-50/40 md:bg-transparent px-2.5 py-1 md:p-0 rounded-lg">
                  ₹{parseFloat(detail.royalty_amount || "0").toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          ))}

          {royaltyDetails.length === 0 && (
            <div className="p-12 text-center bg-white">
              <ScrollText className="mx-auto h-8 w-8 text-slate-300 stroke-[1.5]" />
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mt-3">Zero Transaction History</p>
              <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs mx-auto">
                No individual legal settlement allocation balances have been returned during your active checking lifecycle.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
