import { useEffect, useState } from "react";
import { Download, Eye, FileText, AlertCircle } from "lucide-react";
import { PageBanner } from "./PageBanner";
import { SectionHeader } from "./SectionHeader";
import { governanceService } from "../../services/governanceService";

interface DocItem {
  id: number;
  title: string;
  document_type: string;
  file: string;
  thumbnail?: string;
  version?: string;
  published_date?: string;
}

const DEFAULT_DOCUMENTS: DocItem[] = [
  {
    id: -1,
    title: "Certificate of Registration",
    document_type: "constitutional",
    file: "#",
    thumbnail: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80",
    version: "1.0",
  },
  {
    id: -2,
    title: "Rules & Regulations",
    document_type: "constitutional",
    file: "#",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80",
    version: "2024.1",
  },
  {
    id: -3,
    title: "Annual Operational Reports",
    document_type: "annual_report",
    file: "#",
    thumbnail: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=80",
    version: "FY23-24",
  },
  {
    id: -4,
    title: "Copyright Act Section 33(3)",
    document_type: "constitutional",
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

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorOccurred(false);

    governanceService.getDocuments()
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
        console.error("Failed to load governance documents, deploying fallbacks:", err);
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
    }, 1500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const handlePreview = (doc: DocItem) => {
    if (doc.file && doc.file !== "#") {
      window.open(doc.file, "_blank", "noopener,noreferrer");
    } else {
      alert(`Opening preview instance for standard document framework placeholder: ${doc.title}`);
    }
  };

  const handleDownload = (doc: DocItem) => {
    if (doc.file && doc.file !== "#") {
      const link = document.createElement('a');
      link.href = doc.file;
      const fileName = doc.file.substring(doc.file.lastIndexOf('/') + 1) || 'governance-document';
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Initiating digital package download workflow tracking placeholder for: ${doc.title}`);
    }
  };

  return (
    <div style={{ fontFamily: "var(--font-body)" }} className="bg-slate-50 min-h-screen">
      <PageBanner 
        title="GOVERNANCE" 
        subtitle="Transparency and administrative accountability within the operational framework of CINEFIL India." 
      />

      <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Governance Framework"
            subtitle="CINEFIL operates strictly under a transparent administrative ecosystem built to fully comply with the provisions of the Copyright Act 1957."
          />

          <div className="grid md:grid-cols-2 gap-4 sm:gap-8 text-xs sm:text-sm leading-relaxed my-8 sm:my-10 max-w-4xl mx-auto text-slate-600 font-medium">
            <p className="bg-slate-50/60 border border-slate-100 p-4 sm:p-5 rounded-2xl shadow-2xs">
              CINEFIL is systematically structured and overseen by an authorized Board of Directors alongside an explicit Governing Council. This administrative body continuously commands the strategic, structural, and real-time operational compliance mappings of the Society, ensuring that all dynamic royalty collections and onward distribution processes remain legal, ethical, and impeccably audited under the Copyright Act 1957.
            </p>
            <p className="bg-slate-50/60 border border-slate-100 p-4 sm:p-5 rounded-2xl shadow-2xs">
              The complete regulatory accounting logs of the Society undergo thorough annual third-party audits, with comprehensive compliance dossiers registered dynamically with the Copyright Board. All registered members maintain absolute rights to review verified periodic financial statements, balance indicators, and targeted statutory distribution metrics in accordance with structural laws.
            </p>
          </div>

          {errorOccurred && (
            <div className="max-w-xl mx-auto mb-8 p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-[10px] sm:text-xs font-semibold flex items-start gap-3 shadow-sm animate-fade-in">
              <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Live Directory Registry Offline</p>
                <p className="text-amber-700/90 mt-0.5 font-medium">Could not complete safe live sync verification. Showing authenticated baseline governance placeholders instead.</p>
              </div>
            </div>
          )}

          {loading || minimumLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="h-32 sm:h-40 bg-slate-200 animate-pulse" />
                    <div className="p-3 sm:p-4 flex-1 flex flex-col">
                      <div className="flex items-start gap-1.5 min-h-[40px] sm:min-h-[48px]">
                        <div className="w-3.5 h-3.5 bg-slate-200 rounded animate-pulse shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-slate-200 rounded animate-pulse w-3/4" />
                          <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2" />
                        </div>
                      </div>
                      <div className="mt-2 h-5 w-16 bg-slate-200 rounded-md animate-pulse" />
                    </div>
                  </div>
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-1 grid grid-cols-2 gap-2">
                    <div className="h-8 bg-slate-200 rounded-xl animate-pulse" />
                    <div className="h-8 bg-slate-200 rounded-xl animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
              {documents.map((doc) => {
                const imageUrl = doc.thumbnail || DOCUMENT_TYPE_IMAGES[doc.document_type] || "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=900&q=80";

                return (
                  <div
                    key={doc.id}
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-32 sm:h-40 bg-slate-900 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={doc.title}
                          className="h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-white/95 backdrop-blur-xs border border-slate-200 text-slate-800 text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-2xs uppercase tracking-wider">
                          {doc.document_type.replace('_', ' ')}
                        </div>
                      </div>

                      <div className="p-3 sm:p-4 flex-1 flex flex-col">
                        <div className="flex items-start gap-1.5 min-h-[40px] sm:min-h-[48px]">
                          <FileText size={14} className="text-[var(--cinefil-navy)] shrink-0 mt-0.5 w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" />
                          <h3
                            className="text-[10px] sm:text-xs font-bold text-slate-900 tracking-tight line-clamp-2 leading-tight"
                            style={{ fontFamily: "var(--font-heading)" }}
                          >
                            {doc.title}
                          </h3>
                        </div>

                        {doc.version && (
                          <div className="mt-2 inline-flex items-center text-[9px] sm:text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold w-fit border border-slate-200/60">
                            Version {doc.version}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-1 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handlePreview(doc)}
                        className="flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-xl text-[9px] sm:text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200/40"
                        type="button"
                      >
                        <Eye size={12} className="w-3 h-3 sm:w-3 sm:h-3" />
                        Preview
                      </button>
                      {/* <button
                        onClick={() => handleDownload(doc)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[10px] uppercase tracking-wider font-bold text-white transition-opacity hover:opacity-95 shadow-2xs"
                        style={{ backgroundColor: "var(--cinefil-navy)" }}
                        type="button"
                      >
                        <Download size={12} />
                        Download
                      </button> */}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}