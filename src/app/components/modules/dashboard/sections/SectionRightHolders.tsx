import React from "react";
import { UserCheck } from "lucide-react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { useDashboard, SelectOption } from "../context/DashboardContext";

export function SectionRightHolders() {
  const {
    isMember,
    rightHolders,
    rightHolderFilm, setRightHolderFilm,
    rightHolderMember, setRightHolderMember,
    rightHolderType, setRightHolderType,
    rightHolderPercentage, setRightHolderPercentage,
    rightHolderFormError, rightHolderFormSuccess, rightHolderSubmitting,
    loadFilmOptions, onCreateFilm,
    loadRightHolderMemberOptions, onCreateRightHolderMember,
    handleCreateRightHolder, resetRightHolderForm
  } = useDashboard();

  if (!isMember) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(244,63,159,0.1)] text-[#f43f9f]">
          <UserCheck size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--cinefil-gold)" }}>
            Right Holders
          </p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">Film rights ownership</h3>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--cinefil-gold)" }}>
              Add right holder
            </p>
            <h4 className="mt-1 text-lg font-bold text-slate-900">Attach a member to a film</h4>
          </div>
          <button
            onClick={resetRightHolderForm}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            type="button"
          >
            Reset
          </button>
        </div>

        {rightHolderFormError && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {rightHolderFormError}
          </div>
        )}
        {rightHolderFormSuccess && (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {rightHolderFormSuccess}
          </div>
        )}

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Member film
            <AsyncCreatableSelect
              value={rightHolderFilm}
              onChange={(option) => setRightHolderFilm(option as SelectOption | null)}
              loadOptions={loadFilmOptions}
              onCreateOption={async (inputValue) => {
                try {
                  const createdFilm: any = await onCreateFilm(inputValue);
                  setRightHolderFilm(createdFilm);
                } catch (error) {
                  console.error("Error creating film:", error);
                }
              }}
              className="mt-2"
              classNamePrefix="react-select"
              placeholder="Search or create film title..."
              noOptionsMessage={() => "Type to search film titles..."}
              formatCreateLabel={(inputValue) => `Create new film: "${inputValue}"`}
              isClearable
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Member
            <AsyncCreatableSelect
              value={rightHolderMember}
              onChange={(option) => setRightHolderMember(option as SelectOption | null)}
              loadOptions={loadRightHolderMemberOptions}
              onCreateOption={async (inputValue) => {
                try {
                  const createdCompany: any = await onCreateRightHolderMember(inputValue);
                  setRightHolderMember(createdCompany);
                } catch (error) {
                  console.error("Error creating company:", error);
                }
              }}
              className="mt-2"
              classNamePrefix="react-select"
              placeholder="Search member/company..."
              noOptionsMessage={() => "Type to search member/company links..."}
              formatCreateLabel={(inputValue) => `Create new company: "${inputValue}"`}
              isClearable
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Rights holder type
            <input
              value={rightHolderType}
              onChange={(e) => setRightHolderType(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--cinefil-gold)]"
              placeholder="Producer, Director, etc."
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Ownership percentage
            <input
              type="number"
              min="0"
              max="100"
              value={rightHolderPercentage}
              onChange={(e) => setRightHolderPercentage(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--cinefil-gold)]"
              placeholder="50"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleCreateRightHolder}
            disabled={rightHolderSubmitting}
            className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-600 disabled:opacity-50"
            type="button"
          >
            {rightHolderSubmitting ? "Saving..." : "Add right holder"}
          </button>
          <button
            onClick={resetRightHolderForm}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            type="button"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--cinefil-gold)" }}>
            Right Holders List
          </p>
        </div>
        <div className="divide-y divide-slate-200 bg-white">
          {rightHolders.map((holder) => (
            <div key={holder.id} className="grid grid-cols-12 gap-4 px-5 py-4 text-sm items-center">
              <div className="col-span-4 font-medium text-slate-900">
                {holder.member_name || holder.member?.full_name || 'Unknown'}
              </div>
              <div className="col-span-4 text-slate-600">
                {holder.rights_holder_type || 'N/A'}
              </div>
              <div className="col-span-2 text-center text-slate-700">
                {holder.ownership_percentage ? `${holder.ownership_percentage}%` : 'N/A'}
              </div>
              <div className="col-span-2 text-right text-slate-500">
                {holder.member_film?.title || 'N/A'}
              </div>
            </div>
          ))}
          {rightHolders.length === 0 && (
            <div className="p-5 text-center text-sm text-slate-400">
              No right holders found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
