import React from "react";
import { Share2 } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";

export function SectionShares() {
  const { isMember, filmShares } = useDashboard();

  if (!isMember) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(34,197,94,0.1)] text-[#22c55e]">
          <Share2 size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--cinefil-gold)" }}>
            Film Shares
          </p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">Shared films with other members</h3>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--cinefil-gold)" }}>
            Film Shares List
          </p>
        </div>
        <div className="divide-y divide-slate-200 bg-white">
          {filmShares.map((share) => (
            <div key={share.id} className="grid grid-cols-12 gap-4 px-5 py-4 text-sm items-center">
              <div className="col-span-4 font-medium text-slate-900">
                {share.film_title || share.film?.title || 'Unknown'}
              </div>
              <div className="col-span-4 text-slate-600">
                {share.shared_with_name || share.shared_with?.full_name || 'Unknown'}
              </div>
              <div className="col-span-2 text-center">
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${share.permission === 'edit' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                  {share.permission || 'view'}
                </span>
              </div>
              <div className="col-span-2 text-right text-slate-500">
                {new Date(share.shared_at).toLocaleDateString()}
              </div>
            </div>
          ))}
          {filmShares.length === 0 && (
            <div className="p-5 text-center text-sm text-slate-400">
              No film shares found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
