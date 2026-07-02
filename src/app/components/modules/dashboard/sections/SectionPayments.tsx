import React from "react";
import { ReceiptText, CalendarRange, BadgeDollarSign, ChevronRight } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";

export function SectionPayments({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const { isMember, royaltyDistributions, selectedFinancialYearFilter, setSelectedFinancialYearFilter } = useDashboard();

  if (!isMember) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="inline-flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <ReceiptText size={18} className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </span>
        <div>
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-blue-600">
            Payment history
          </p>
          <h3 className="mt-1 text-xl sm:text-2xl font-bold text-gray-900">Financial years and settlement records</h3>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
        {royaltyDistributions.map((dist) => (
          <div key={dist.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-500">{dist.financial_year_name}</p>
                <p className="mt-2 text-lg sm:text-xl font-bold text-gray-900">₹{parseFloat(String(dist.calculated_total || dist.total_amount || 0)).toLocaleString('en-IN')}</p>
              </div>
              <span className="rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold bg-emerald-100 text-emerald-800">
                Released
              </span>
            </div>
            <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs leading-relaxed text-gray-500">{dist.notes || "Annual distribution release"}</p>
          </div>
        ))}
        {royaltyDistributions.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-5 col-span-4 text-center text-xs sm:text-sm text-gray-400">
            No distribution data found.
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-5 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-blue-600">
                Royalty Distributions breakdown
              </p>
              <select
                value={selectedFinancialYearFilter}
                onChange={(e) => setSelectedFinancialYearFilter(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Financial Years</option>
                {royaltyDistributions.map((dist) => (
                  <option key={dist.id} value={dist.financial_year_name}>
                    {dist.financial_year_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="divide-y divide-gray-200 bg-white">
            {royaltyDistributions
              .filter(dist => selectedFinancialYearFilter === "all" || dist.financial_year_name === selectedFinancialYearFilter)
              .flatMap(dist => dist.details || [])
              .map((detail) => (
              <div key={detail.id} className="grid grid-cols-12 gap-4 px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm items-center">
                <div className="col-span-6 font-medium text-gray-900">
                  {detail.film_title}
                </div>
                <div className="col-span-6 text-right font-semibold text-emerald-600">
                  ₹{parseFloat(detail.royalty_amount).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
            {royaltyDistributions
              .filter(dist => selectedFinancialYearFilter === "all" || dist.financial_year_name === selectedFinancialYearFilter)
              .flatMap(dist => dist.details || []).length === 0 && (
              <div className="p-4 sm:p-5 text-center text-xs sm:text-sm text-gray-400">
                No ledger items for selected filter.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <CalendarRange size={18} className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </span>
            <div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-blue-600">
                FY tracker
              </p>
              <h3 className="mt-1 text-base sm:text-lg font-bold text-gray-900">Financial year snapshot</h3>
            </div>
          </div>
          <div className="mt-4 sm:mt-5 space-y-3">
            {royaltyDistributions.map((dist) => (
              <div key={dist.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">{dist.financial_year_name}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">Released on {new Date(dist.distribution_date).toLocaleDateString()}</p>
                </div>
                <BadgeDollarSign size={18} className="text-blue-600 w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
            ))}
          </div>
          <button
            onClick={() => onNavigate?.("profile")}
            className="mt-4 sm:mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-xs sm:text-sm font-semibold transition hover:bg-gray-50"
            style={{ borderColor: "rgba(15,23,42,0.12)", color: "rgb(30 41 59)" }}
          >
            Open profile
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
