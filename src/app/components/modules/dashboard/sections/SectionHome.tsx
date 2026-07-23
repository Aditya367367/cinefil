import React from "react";
import { BarChart3, LayoutDashboard, Users, ListChecks, ChevronRight, Crown, Lock, AlertTriangle } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";

export function SectionHome() {
  const { 
    isMember, 
    royaltyDistributions, 
    filmsList, 
    filmShares, 
    changeSection,
    user,
    upgradeToPrime,
    isPrime,
    isUnderReview
  } = useDashboard();

  if (!isMember) return null;

  const totalSettled = royaltyDistributions.reduce((acc, curr) => acc + parseFloat(curr.total_amount), 0);
  const filmCount = filmsList.length;

  const summaryCards = [
    { label: "Summary reports", value: royaltyDistributions.length.toString(), detail: "Active financial year summaries" },
    { label: "Films tracked", value: filmCount.toString(), detail: `${filmCount} films registered in catalog` },
    { label: "Total Settlement", value: `₹${totalSettled.toLocaleString('en-IN')}`, detail: "Dues settled to date" },
    { label: "Last Payment", value: royaltyDistributions.length > 0 ? `₹${parseFloat(royaltyDistributions[0].total_amount).toLocaleString('en-IN')}` : "₹0", detail: royaltyDistributions.length > 0 ? `Released on ${new Date(royaltyDistributions[0].distribution_date).toLocaleDateString()}` : "No payment released yet" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {isPrime ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <Crown size={22} className="text-emerald-700" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                Prime Member <span className="bg-emerald-600 text-white text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full">Active</span>
              </h4>
              <p className="mt-1 text-xs text-emerald-800 leading-relaxed">
                You are a verified Prime Member of CINEFIL India. You are eligible for full royalty administration and quarterly distribution of royalties.
              </p>
            </div>
          </div>
        </div>
      ) : isUnderReview ? (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
              <Lock size={20} className="text-blue-700" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                Prime Membership Request: <span className="bg-blue-600 text-white text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full">In Progress (Locked)</span>
              </h4>
              <p className="mt-1 text-xs text-blue-800 leading-relaxed font-medium">
                Your application to upgrade to Prime Membership has been submitted and is currently being verified by CINEFIL officers. <strong className="font-bold underline">You cannot change or edit any application details or registered films until your Prime Membership request is approved.</strong>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <AlertTriangle size={20} className="text-amber-700" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-amber-900">Associate Membership Upgrade Required</h4>
              <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                You are currently registered as an Associate Member. Entitlement to quarterly distribution of royalties shall accrue only upon admission as a Prime Member. To upgrade to Prime Membership, please provide the required supporting documents—including Censor Certificates, devolution of title documents, film links, and other verification files.
              </p>
            </div>
          </div>
          <button
            onClick={upgradeToPrime}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition"
          >
            Upgrade to Prime Member
          </button>
        </div>
      )}

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex items-start justify-between gap-2 sm:gap-3">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">{card.label}</p>
                <p className="mt-2 text-xl sm:text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <span className="inline-flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shadow-sm">
                <BarChart3 size={18} className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </span>
            </div>
            <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs leading-relaxed text-gray-500">{card.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-blue-600">
                Summary report
              </p>
              <h3 className="mt-2 text-lg sm:text-xl font-bold text-gray-900">Royalty overview by film</h3>
            </div>
            <LayoutDashboard size={20} className="text-gray-400 w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="mt-5 space-y-4">
            {filmsList.slice(0, 3).map((film) => {
              const filmSharesForFilm = filmShares.filter((share: any) => share.film === film.id);
              const totalSharedPct = filmSharesForFilm.reduce((acc: number, curr: any) => acc + (parseFloat(curr.share_percentage) || 0), 0);
              const ownershipPercentage = Math.max(0, 100 - totalSharedPct);

              return (
                <div key={film.id} className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{film.title}</p>
                      <p className="mt-1 text-[10px] sm:text-sm text-gray-500 truncate">
                        {film.cast && film.cast.length > 0 ? film.cast.map(c => c.actor_name).join(", ") : "Cast info not set"}
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-blue-600 shrink-0">
                      {ownershipPercentage}%
                    </span>
                  </div>
                  <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{
                          width: `${Math.min(ownershipPercentage, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-sm font-semibold text-gray-700 shrink-0">FY 2024-25</span>
                  </div>
                </div>
              );
            })}
            {filmsList.length === 0 && (
              <p className="text-xs sm:text-sm text-gray-400 text-center py-3 sm:py-4">No films registered yet.</p>
            )}
            {filmsList.length > 0 && (
              <button
                onClick={() => changeSection("films")}
                className="mt-3 sm:mt-4 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                View more films
              </button>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users size={18} className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </span>
            <div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-blue-600">
                Member mix
              </p>
              <h3 className="mt-1 text-base sm:text-lg font-bold text-gray-900">Cast and rights map</h3>
            </div>
          </div>

          <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-4">
            {[
              "Producer split shown as 50% / 50% when a film has two producers",
              "100% share appears when one member holds the full right",
              "Cast and other names can be added alongside each film record",
            ].map((point) => (
              <div key={point} className="flex gap-2 sm:gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
                <ListChecks size={18} className="mt-0.5 text-blue-600 w-4 h-4 sm:w-4.5 sm:h-4.5" />
                <p className="text-xs sm:text-sm leading-relaxed text-gray-600">{point}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => changeSection("films")}
            className="mt-4 sm:mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-blue-700 bg-blue-600"
          >
            Open film ledger
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
