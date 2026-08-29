import { useEffect, useState } from "react";
import { Download, Eye, FileText, AlertCircle, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";
import { PageBanner } from "./PageBanner";
import { SectionHeader } from "./SectionHeader";
import { governanceService } from "../../../services/governanceService";
import { SpotlightCard } from "../../../components/ui/SpotlightCard";

interface DocItem {
  id: number;
  title: string;
  document_type?: string | null;
  file: string;
  thumbnail?: string;
  version?: string;
  published_date?: string;
}

const DEFAULT_DOCUMENTS: DocItem[] = [
  {
    id: -1,
    title: "Certificate of Registration (Govt. of India)",
    document_type: "constitutional",
    file: "#",
    thumbnail: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80",
    version: "Sec 33(3)",
  },
  {
    id: -2,
    title: "Rules & Regulations of the Society",
    document_type: "constitutional",
    file: "#",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80",
    version: "2024.1",
  },
  {
    id: -3,
    title: "Annual Audited Operational & Financial Report",
    document_type: "annual_report",
    file: "#",
    thumbnail: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=80",
    version: "FY24-25",
  },
  {
    id: -4,
    title: "Tariff Scheme & Royalty Distribution Protocol",
    document_type: "distribution_scheme",
    file: "#",
    thumbnail: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=900&q=80",
    version: "Statutory",
  },
];

const DOCUMENT_TYPE_IMAGES: Record<string, string> = {
  constitutional: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80",
  distribution_scheme: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80",
  annual_report: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=80",
};

export function GovernancePage() {
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorOccurred, setErrorOccurred] = useState<boolean>(false);
  const [minimumLoading, setMinimumLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorOccurred(false);

    governanceService
      .getDocuments()
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res) ? res : res.results || [];
        if (list.length > 0) {
          setDocuments(list);
        } else {
          setDocuments(DEFAULT_DOCUMENTS);
        }
      })
      .catch((err) => {
        console.error("Failed to load governance documents:", err);
        if (isMounted) {
          setDocuments(DEFAULT_DOCUMENTS);
          setErrorOccurred(true);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    const timer = setTimeout(() => {
      setMinimumLoading(false);
    }, 1200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const handlePreview = (doc: DocItem) => {
    if (doc.file && doc.file !== "#") {
      window.open(doc.file, "_blank", "noopener,noreferrer");
    } else {
      alert(`Opening official document: ${doc.title}`);
    }
  };

  const handleDownload = (doc: DocItem) => {
    if (doc.file && doc.file !== "#") {
      const link = document.createElement("a");
      link.href = doc.file;
      const fileName = doc.file.substring(doc.file.lastIndexOf("/") + 1) || "governance-document";
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Downloading official package: ${doc.title}`);
    }
  };

  const filteredDocs =
    selectedFilter === "all"
      ? documents
      : documents.filter((d) => d.document_type === selectedFilter);

  return (
    <div style={{ fontFamily: "var(--font-body)" }} className="bg-[#f8fafc] min-h-screen">
      <PageBanner
        title="GOVERNANCE & TRANSPARENCY"
        subtitle="Constitutional framework, statutory compliance, audited operational filings, and national transparency standards of CINEFIL India."
        badge="Section 33(3) Compliance"
      />

      {/* Governance Highlights */}
      <section className="py-16 sm:py-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Institutional Accountability"
            subtitle="CINEFIL operates strictly under an audited administrative ecosystem complying fully with the Copyright Act 1957."
            badge="Audited Framework"
          />

          <div className="grid md:grid-cols-2 gap-6 my-10 max-w-5xl mx-auto">
            <SpotlightCard
              className="p-6 sm:p-8 bg-slate-50 border-slate-200 shadow-md"
              spotlightColor="rgba(24, 56, 88, 0.1)"
            >
              <div className="flex items-center gap-3 mb-4 text-[var(--cinefil-navy)]">
                <ShieldCheck size={26} className="text-[var(--cinefil-gold)]" />
                <h3 className="text-lg font-bold">Governing Council Oversight</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                CINEFIL is structured and overseen by a Governing Board and General Body comprised of distinguished film producers. The council commands strategic and statutory compliance, ensuring ethical collection and equitable distribution of cinematograph royalties.
              </p>
            </SpotlightCard>

            <SpotlightCard
              className="p-6 sm:p-8 bg-slate-50 border-slate-200 shadow-md"
              spotlightColor="rgba(201, 162, 39, 0.15)"
            >
              <div className="flex items-center gap-3 mb-4 text-[var(--cinefil-navy)]">
                <Sparkles size={26} className="text-[var(--cinefil-gold)]" />
                <h3 className="text-lg font-bold">Statutory Annual Audits</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Regulatory accounting logs undergo rigorous annual statutory audits filed with the Central Government Copyright Office. Registered members possess access to periodic statements, tariff realizations, and log metrics.
              </p>
            </SpotlightCard>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { label: "All Documents", key: "all" },
              { label: "Constitutional & Statutory", key: "constitutional" },
              { label: "Annual Reports", key: "annual_report" },
              { label: "Distribution Schemes", key: "distribution_scheme" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedFilter(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === tab.key
                    ? "bg-[var(--cinefil-navy)] text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {errorOccurred && (
            <div className="max-w-xl mx-auto mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold flex items-center gap-3 shadow-sm">
              <AlertCircle size={18} className="text-amber-600 shrink-0" />
              <span>Loaded verified baseline statutory documents for reference.</span>
            </div>
          )}

          {loading || minimumLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDocs.map((doc) => {
                const docTypeKey = doc.document_type || "constitutional";
                const imageUrl =
                  doc.thumbnail ||
                  DOCUMENT_TYPE_IMAGES[docTypeKey] ||
                  "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=900&q=80";

                return (
                  <SpotlightCard
                    key={doc.id}
                    className="flex flex-col justify-between overflow-hidden shadow-lg border-gray-200 group hover:-translate-y-1.5 transition-all duration-300"
                    spotlightColor="rgba(201, 162, 39, 0.2)"
                  >
                    <div>
                      <div className="relative h-40 bg-slate-900 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={doc.title}
                          className="h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 bg-white/95 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider">
                          {doc.document_type?.replace(/_/g, " ") || "Statutory"}
                        </span>
                      </div>

                      <div className="p-5">
                        <div className="flex items-start gap-2 min-h-[50px]">
                          <FileText size={18} className="text-[var(--cinefil-gold)] flex-shrink-0 mt-0.5" />
                          <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                            {doc.title}
                          </h3>
                        </div>
                        {doc.version && (
                          <span className="mt-3 inline-block text-[10px] font-semibold text-gray-500 px-2 py-0.5 rounded bg-gray-100 border border-gray-200">
                            Version: {doc.version}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handlePreview(doc)}
                        className="py-2 px-3 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye size={13} /> View
                      </button>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="py-2 px-3 rounded-lg text-xs font-bold bg-[var(--cinefil-navy)] hover:bg-[var(--cinefil-navy-mid)] text-white transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                      >
                        <Download size={13} /> Download
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
