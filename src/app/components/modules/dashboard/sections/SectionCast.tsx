import React from "react";
import { Users } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";

export function SectionCast() {
  const { isMember, castMembers } = useDashboard();

  if (!isMember) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(201,162,39,0.12)] text-[var(--cinefil-gold)]">
          <Users size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--cinefil-gold)" }}>
            Cast Members
          </p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">Manage film cast</h3>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--cinefil-gold)" }}>
            Cast Members List
          </p>
        </div>
        <div className="divide-y divide-slate-200 bg-white">
          {castMembers.map((cast) => (
            <div key={cast.id} className="grid grid-cols-12 gap-4 px-5 py-4 text-sm items-center">
              <div className="col-span-6 font-medium text-slate-900">
                {cast.actor?.name || cast.character_name || 'Unknown'}
              </div>
              <div className="col-span-4 text-slate-600">
                {cast.character_name || 'N/A'}
              </div>
              <div className="col-span-2 text-right text-slate-500">
                {cast.member_film?.title || 'N/A'}
              </div>
            </div>
          ))}
          {castMembers.length === 0 && (
            <div className="p-5 text-center text-sm text-slate-400">
              No cast members found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
