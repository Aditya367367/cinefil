import { useState, useEffect } from "react";
import { Bell, ChevronRight, Download, ExternalLink, Sparkles, X } from "lucide-react";
import { Announcement } from "../../services/announcementService";

interface AnnouncementTickerProps {
  announcements: Announcement[];
}

export function AnnouncementTicker({ announcements }: AnnouncementTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  if (!announcements || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  return (
    <>
      <div className="w-full bg-[#0a1828] border-b border-[var(--cinefil-gold)]/20 py-2.5 px-4 text-white text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden flex-1">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--cinefil-gold)] text-[var(--cinefil-navy)] font-bold text-[10px] tracking-wider uppercase flex-shrink-0 animate-pulse-slow">
              <Sparkles size={11} /> Live Notice
            </span>
            <div
              onClick={() => setSelectedAnnouncement(current)}
              className="truncate cursor-pointer hover:text-[var(--cinefil-gold)] transition-colors flex items-center gap-2"
            >
              <span className="font-semibold text-white/90 truncate">{current.title}</span>
              <span className="text-[11px] text-white/50 hidden sm:inline">
                ({new Date(current.date || current.created_at || Date.now()).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {announcements.length > 1 && (
              <span className="text-[11px] text-white/50 hidden md:inline">
                {currentIndex + 1} of {announcements.length}
              </span>
            )}
            <button
              onClick={() => setSelectedAnnouncement(current)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-white transition-all"
            >
              View Details <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Announcement Modal Dialog */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f2540] border border-[var(--cinefil-gold)]/40 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-[var(--cinefil-gold)]/20 text-[var(--cinefil-gold)] border border-[var(--cinefil-gold)]/40">
                <Bell size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--cinefil-gold)]">
                  Official Society Notice
                </span>
                <h3 className="text-lg font-bold text-white">
                  {selectedAnnouncement.title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-white/60 mb-6">
              Published on:{" "}
              {new Date(selectedAnnouncement.date || selectedAnnouncement.created_at || Date.now()).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white/80 hover:bg-white/10 transition-colors"
              >
                Close
              </button>
              {selectedAnnouncement.file && (
                <a
                  href={selectedAnnouncement.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[var(--cinefil-gold)] text-[var(--cinefil-navy)] hover:opacity-90 flex items-center gap-1.5 shadow-lg transition-all"
                >
                  <Download size={14} /> Download Document
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
