import { useEffect, useState } from "react";
import { Download, FileSpreadsheet, Gift, Users2, FileText, Sparkles, CheckCircle2 } from "lucide-react";
import { PageBanner } from "./PageBanner";
import { SectionHeader } from "./SectionHeader";
import { governanceService } from "@/services/governanceService";
import { SpotlightCard } from "../../../components/ui/SpotlightCard";

interface SchemeItem {
  id: number;
  title: string;
  description?: string;
  file: string;
  icon?: any;
}

const defaultSchemes = [
  {
    id: 1,
    title: "Commercial Tariff Scheme",
    description:
      "Statutory tariff structure across multiplexes, television broadcasts, digital platforms, hotels, and transport services.",
    downloadLabel: "Download Tariff Schedule",
    file: "#",
    icon: FileSpreadsheet,
    tag: "Statutory Tariff",
  },
  {
    id: 2,
    title: "Royalty Distribution Scheme",
    description:
      "Transparent logging and statutory distribution protocol ensuring direct, itemized royalty compensation to registered producers.",
    downloadLabel: "Download Distribution Protocol",
    file: "#",
    icon: FileText,
    tag: "Royalty Protocol",
  },
  {
    id: 3,
    title: "Member Welfare & Relief Scheme",
    description:
      "Comprehensive benevolent welfare fund offering medical assistance, legal defense subsidies, and emergency relief for registered filmmakers.",
    downloadLabel: "Download Welfare Scheme",
    file: "#",
    icon: Gift,
    tag: "Member Benefits",
  },
  {
    id: 4,
    title: "General Body & EGM Resolutions",
    description:
      "Approved constitutional resolutions and policy mandates passed during the Extraordinary General Body Meetings.",
    downloadLabel: "Download Meeting Minutes",
    file: "#",
    icon: Users2,
    tag: "Council Minutes",
  },
];

export function SchemesPage() {
  const [schemes, setSchemes] = useState<SchemeItem[]>(defaultSchemes);
  const [loading, setLoading] = useState(true);
  const [minimumLoading, setMinimumLoading] = useState(true);

  useEffect(() => {
    governanceService
      .getSchemes()
      .then((res) => {
        const list = Array.isArray(res) ? res : res.results || [];
        if (list.length > 0) {
          setSchemes(list);
        }
      })
      .catch((err) => {
        console.error("Failed to load schemes, using default baseline.", err);
      })
      .finally(() => {
        setLoading(false);
      });

    const timer = setTimeout(() => {
      setMinimumLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDownload = (scheme: any) => {
    if (scheme.file && scheme.file !== "#") {
      window.open(scheme.file, "_blank");
    } else {
      alert(`Initiating download for: ${scheme.title}`);
    }
  };

  return (
    <div style={{ fontFamily: "var(--font-body)" }} className="bg-[#f8fafc] min-h-screen">
      <PageBanner
        title="STATUTORY SCHEMES & TARIFFS"
        subtitle="Official statutory tariff schedules, royalty distribution mechanisms, and member welfare policies of CINEFIL India."
        badge="Official Gazetted Schemes"
      />

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Public Schemes & Repertoire Framework"
            subtitle="Transparent and publicly accessible governance instruments ensuring statutory compliance under the Copyright Act 1957."
            badge="Transparency"
          />

          {loading || minimumLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 rounded-3xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto">
              {schemes.map((scheme, idx) => {
                const SchemeIcon = scheme.icon || FileText;
                return (
                  <SpotlightCard
                    key={scheme.id || idx}
                    className="p-8 rounded-3xl border-gray-200 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between bg-white group"
                    spotlightColor="rgba(201, 162, 39, 0.2)"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--cinefil-gold)]/15 border border-[var(--cinefil-gold)]/30 flex items-center justify-center text-[var(--cinefil-navy)] shadow-md group-hover:scale-110 transition-transform">
                          <SchemeIcon size={28} className="text-[var(--cinefil-gold)]" />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--cinefil-navy)] bg-slate-100 px-3 py-1 rounded-full border border-gray-200">
                          {scheme.tag || "Statutory Scheme"}
                        </span>
                      </div>

                      <h3
                        className="text-xl font-extrabold text-gray-900 group-hover:text-[var(--cinefil-navy)] transition-colors mt-2"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {scheme.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-3">
                        {scheme.description ||
                          "Authorized constitutional and statutory scheme adopted by the Governing Board and Copyright Office."}
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                        <CheckCircle2 size={15} /> Active Filing
                      </div>

                      <button
                        onClick={() => handleDownload(scheme)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--cinefil-navy)] hover:bg-[var(--cinefil-navy-mid)] text-white transition-all shadow-md transform hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <Download size={14} className="text-[var(--cinefil-gold)]" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
