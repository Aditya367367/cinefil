import React from "react";
import { Film } from "../context/MembershipFormContext";

export function FormPreviewCard({
  applicantName,
  applicantEmail,
  panNumberField,
  mobileNumber,
  membershipTypeName,
  films,
  cinLlp,
  gstNumber,
  registeredAddress,
  city,
  stateField,
  country,
  pinCode,
}: {
  applicantName: string;
  applicantEmail: string;
  panNumberField: string;
  mobileNumber: string;
  membershipTypeName: string;
  films: Film[];
  cinLlp?: string;
  gstNumber?: string;
  registeredAddress?: string;
  city?: string;
  stateField?: string;
  country?: string;
  pinCode?: string;
}) {
  const forType = membershipTypeName.includes("Producer") ? "FOR PRODUCER" : "FOR OTHER OWNERS / VIDEO PUBLISHERS";

  return (
    <div className="flex flex-col shadow-lg rounded-md overflow-hidden bg-white border border-slate-100 transition-all duration-300">
      <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Live Form Preview</span>
      </div>
      <div
        className="rounded-sm overflow-hidden border"
        style={{ borderColor: "rgba(0,0,0,0.1)" }}
      >
        <div
          className="py-4 px-5 text-center"
          style={{ background: "linear-gradient(180deg, #000000 0%, #183858 100%)" }}
        >
          <p className="text-white/90 text-xs font-bold tracking-wider uppercase">MEMBERSHIP / AUTHORISATION FORM</p>
          <p
            className="text-sm font-bold mt-1 tracking-wide"
            style={{ color: "var(--cinefil-gold)", fontFamily: "var(--font-display)" }}
          >
            {forType}
          </p>
        </div>

        <div className="p-4 flex flex-col gap-3" style={{ backgroundColor: "#f9fafb" }}>
          <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div className="col-span-2">
                <label className="text-[10px] font-semibold block mb-0.5" style={{ color: "var(--cinefil-navy)" }}>Name</label>
                <div className="min-h-[28px] rounded-sm border bg-white px-2 py-1 text-xs break-words" style={{ borderColor: "rgba(0,0,0,0.12)" }}>{applicantName || "..."}</div>
              </div>
              <div>
                <label className="text-[10px] font-semibold block mb-0.5" style={{ color: "var(--cinefil-navy)" }}>Email</label>
                <div className="min-h-[28px] rounded-sm border bg-white px-2 py-1 text-xs break-words" style={{ borderColor: "rgba(0,0,0,0.12)" }}>{applicantEmail || "..."}</div>
              </div>
              <div>
                <label className="text-[10px] font-semibold block mb-0.5" style={{ color: "var(--cinefil-navy)" }}>Mobile No.</label>
                <div className="min-h-[28px] rounded-sm border bg-white px-2 py-1 text-xs break-words" style={{ borderColor: "rgba(0,0,0,0.12)" }}>{mobileNumber || "..."}</div>
              </div>
              <div>
                <label className="text-[10px] font-semibold block mb-0.5" style={{ color: "var(--cinefil-navy)" }}>PAN</label>
                <div className="min-h-[28px] rounded-sm border bg-white px-2 py-1 text-xs break-words" style={{ borderColor: "rgba(0,0,0,0.12)" }}>{panNumberField || "..."}</div>
              </div>
              <div>
                <label className="text-[10px] font-semibold block mb-0.5" style={{ color: "var(--cinefil-navy)" }}>CIN/LLPIN</label>
                <div className="min-h-[28px] rounded-sm border bg-white px-2 py-1 text-xs break-words" style={{ borderColor: "rgba(0,0,0,0.12)" }}>{cinLlp || "..."}</div>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-semibold block mb-0.5" style={{ color: "var(--cinefil-navy)" }}>GST Number</label>
                <div className="min-h-[28px] rounded-sm border bg-white px-2 py-1 text-xs break-words" style={{ borderColor: "rgba(0,0,0,0.12)" }}>{gstNumber || "..."}</div>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-semibold block mb-0.5" style={{ color: "var(--cinefil-navy)" }}>Registered Address</label>
                <div className="min-h-[28px] rounded-sm border bg-white px-2 py-1 text-xs break-words" style={{ borderColor: "rgba(0,0,0,0.12)" }}>
                  {registeredAddress ? `${registeredAddress}, ${city || ''}, ${stateField || ''}, ${country || ''} - ${pinCode || ''}` : "..."}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-1">
            <label className="text-[10px] font-semibold block mb-1" style={{ color: "var(--cinefil-navy)" }}>
              Cinematograph Film Work ({films.filter(f => f.title?.label || f.title?.value).length} items)
            </label>
            <div className="rounded border" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              <table className="w-full text-[10px] border-collapse bg-white">
                <thead>
                  <tr style={{ backgroundColor: "var(--cinefil-navy)" }}>
                    {["Title", "Year", "Language"].map((h) => (
                      <th key={h} className="text-white px-2 py-1.5 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {films.slice(0, 3).map((f, i) => (
                    <tr key={i} className="border-b last:border-0" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
                      <td className="px-2 py-1.5 truncate max-w-[100px]" title={f.title?.label || f.title?.value || ''}>
                        {f.title?.label || f.title?.value || <span className="text-slate-300">-</span>}
                      </td>
                      <td className="px-2 py-1.5">{f.year || <span className="text-slate-300">-</span>}</td>
                      <td className="px-2 py-1.5">{f.language || <span className="text-slate-300">-</span>}</td>
                    </tr>
                  ))}
                  {films.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-2 py-4 text-center text-slate-400">No films added yet</td>
                    </tr>
                  )}
                  {films.length > 3 && (
                    <tr>
                      <td colSpan={3} className="px-2 py-1.5 text-center text-[9px] text-slate-500 italic bg-slate-50">
                        + {films.length - 3} more films
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
