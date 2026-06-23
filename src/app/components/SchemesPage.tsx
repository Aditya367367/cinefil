import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { PageBanner } from "./PageBanner";
import { governanceService } from "@/services/governanceService";

interface SchemeItem {
  id: number;
  title: string;
  description?: string;
  file: string;
}

const defaultSchemes = [
  { title: "Tariff Scheme", description: "Download standard performance license tariff schemes.", downloadLabel: "Download Tariff Now", fileUrl: "#" },
  { title: "Distribution Scheme", description: "Download royalty distribution schemes for film owners.", downloadLabel: "Download Scheme", fileUrl: "#" },
  { title: "Welfare Scheme", description: "Download schemes detailing member welfare benefits.", downloadLabel: "Download Scheme", fileUrl: "#" },
  { title: "Extraordinary General Body Meeting", description: "Minutes and resolutions from EGM.", downloadLabel: "Download Minutes", fileUrl: "#" },
];

export function SchemesPage() {
  const [schemes, setSchemes] = useState<SchemeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [minimumLoading, setMinimumLoading] = useState(true);

  useEffect(() => {
    governanceService.getSchemes()
      .then((res) => {
        const list = Array.isArray(res) ? res : res.results || [];
        if (list.length > 0) {
          setSchemes(list);
        }
      })
      .catch((err) => {
        console.error("Failed to load schemes, using defaults.", err);
      })
      .finally(() => {
        setLoading(false);
      });

    const timer = setTimeout(() => {
      setMinimumLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleDownload = (scheme: any) => {
    if (scheme.file && scheme.file !== "#") {
      window.open(scheme.file, "_blank");
    } else {
      alert(`Downloading document: ${scheme.title}`);
    }
  };

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <PageBanner title="SCHEMES" subtitle="Download CINEFIL's tariff, distribution, and welfare schemes." />

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading || minimumLoading ? (
            <div className="flex flex-col divide-y" style={{ divideColor: "rgba(0,0,0,0.08)" }}>
              {[...Array(4)].map((_, index) => (
                <div key={index} className="py-8 flex flex-col items-center gap-3 text-center">
                  <div className="h-6 bg-slate-200 rounded w-1/3 animate-pulse" />
                  <div className="h-4 bg-slate-200 rounded w-2/3 animate-pulse" />
                  <div className="w-12 h-0.5 bg-slate-200 animate-pulse" />
                  <div className="h-8 w-32 bg-slate-200 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col divide-y" style={{ divideColor: "rgba(0,0,0,0.08)" }}>
              {schemes.length > 0 ? (
                schemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="py-8 flex flex-col items-center gap-3 text-center"
                  >
                    <h2
                      className="text-xl font-bold"
                      style={{ color: "var(--cinefil-navy)", fontFamily: "var(--font-heading)" }}
                    >
                      {scheme.title}
                    </h2>
                    {scheme.description && (
                      <p className="text-sm text-slate-500 max-w-xl mb-1">{scheme.description}</p>
                    )}
                    <div className="w-12 h-0.5" style={{ backgroundColor: "var(--cinefil-gold)" }} />
                    <button
                      className="flex items-center gap-2 px-5 py-2 rounded text-sm font-semibold transition-all hover:opacity-80 mt-1"
                      style={{ color: "var(--cinefil-navy)" }}
                      onClick={() => handleDownload(scheme)}
                    >
                      <Download size={14} style={{ color: "var(--cinefil-gold)" }} />
                      Download Scheme
                    </button>
                  </div>
                ))
              ) : (
                defaultSchemes.map((scheme, i) => (
                  <div
                    key={i}
                    className="py-8 flex flex-col items-center gap-3 text-center"
                  >
                    <h2
                      className="text-xl font-bold"
                      style={{ color: "var(--cinefil-navy)", fontFamily: "var(--font-heading)" }}
                    >
                      {scheme.title}
                    </h2>
                    {scheme.description && (
                      <p className="text-sm text-slate-500 max-w-xl mb-1">{scheme.description}</p>
                    )}
                    <div className="w-12 h-0.5" style={{ backgroundColor: "var(--cinefil-gold)" }} />
                    <button
                      className="flex items-center gap-2 px-5 py-2 rounded text-sm font-semibold transition-all hover:opacity-80 mt-1"
                      style={{ color: "var(--cinefil-navy)" }}
                      onClick={() => alert(`Downloading: ${scheme.title}`)}
                    >
                      <Download size={14} style={{ color: "var(--cinefil-gold)" }} />
                      {scheme.downloadLabel}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}