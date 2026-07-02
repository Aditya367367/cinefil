import React from "react";
import { FileText } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";

export function SectionDocuments() {
  const { isMember, documents } = useDashboard();

  if (!isMember) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(79,70,229,0.1)] text-[#4f46e5]">
          <FileText size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--cinefil-gold)" }}>
            Documents
          </p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">Censor certificates & film documents</h3>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--cinefil-gold)" }}>
            Documents List
          </p>
        </div>
        <div className="divide-y divide-slate-200 bg-white">
          {documents.map((doc) => (
            <div key={doc.id} className="grid grid-cols-12 gap-4 px-5 py-4 text-sm items-center">
              <div className="col-span-4 font-medium text-slate-900">
                {doc.document_type || 'Document'}
              </div>
              <div className="col-span-5 text-slate-600">
                {doc.file_name || 'N/A'}
              </div>
              <div className="col-span-3 text-right text-slate-500">
                {doc.member_film?.title || 'N/A'}
              </div>
            </div>
          ))}
          {documents.length === 0 && (
            <div className="p-5 text-center text-sm text-slate-400">
              No documents found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
