import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft, Search, ShieldCheck, User, Film, Building2, ExternalLink, RefreshCw, LayoutGrid, Table as TableIcon, Sparkles } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { memberService } from "../../../services/memberService";
import { PageBanner } from "./PageBanner";
import { SectionHeader } from "./SectionHeader";
import type { Page } from "./Navbar";
import { SpotlightCard } from "../../../components/ui/SpotlightCard";

interface MemberItem {
  id: number;
  full_name: string;
  role_title?: string;
  membership_type_name?: string;
  photo_url?: string;
  slug?: string;
  biography?: string;
  companies?: any[];
  films?: any[];
  is_prime?: boolean;
}

interface ProducersPageProps {
  onNavigate: (page: Page | string) => void;
}

export function ProducersPage({ onNavigate }: ProducersPageProps) {
  const { isAuthenticated } = useAuth();
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "prime" | "associate">("all");

  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await memberService.getMembers();
      const list = Array.isArray(data) ? data : data.results || [];
      setMembers(list);
    } catch (e) {
      console.error("Failed to load listed members:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterTab]);

  const filteredMembers = members.filter((m) => {
    const term = searchTerm.toLowerCase();
    const companyNames = (m.companies || [])
      .map((c: any) => c.company_name || c.company?.name || "")
      .join(" ")
      .toLowerCase();
    const matchesSearch =
      m.full_name?.toLowerCase().includes(term) ||
      m.role_title?.toLowerCase().includes(term) ||
      m.membership_type_name?.toLowerCase().includes(term) ||
      companyNames.includes(term);

    if (!matchesSearch) return false;
    if (filterTab === "prime") return m.is_prime === true;
    if (filterTab === "associate") return !m.is_prime;
    return true;
  });

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div style={{ fontFamily: "var(--font-body)" }} className="bg-[#f8fafc] min-h-screen">
      <PageBanner
        title="PRODUCERS & COPYRIGHT OWNERS"
        subtitle="National directory of film producers, rightsholders, and production houses registered under Section 33(3) with CINEFIL."
        badge="Official Registry"
      />

      {/* Directory Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[var(--cinefil-gold)] bg-amber-50 border border-amber-200 px-3 py-1 rounded-[3px]">
                Verified Directory
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--cinefil-navy)] mt-2" style={{ fontFamily: "var(--font-heading)" }}>
                Registered Film Producers & Owners
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                Browse verified creators and production banners in the society's repertoire.
              </p>
            </div>

            {/* Filter Tabs, Search & View Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, banner, role..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-[4px] text-xs font-semibold text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[var(--cinefil-gold)] focus:ring-1 focus:ring-[var(--cinefil-gold)]/20 transition shadow-2xs"
                />
              </div>

              <div className="flex bg-slate-100 p-1 rounded-[4px] border border-gray-200">
                <button
                  onClick={() => setFilterTab("all")}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-[3px] cursor-pointer transition-all ${
                    filterTab === "all" ? "bg-[var(--cinefil-navy)] text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All ({members.length})
                </button>
                <button
                  onClick={() => setFilterTab("prime")}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-[3px] cursor-pointer transition-all ${
                    filterTab === "prime" ? "bg-[var(--cinefil-navy)] text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Prime ({members.filter((m) => m.is_prime).length})
                </button>
              </div>

              {/* Grid / Table Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-[4px] border border-gray-200">
                <button
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                  className={`p-2 rounded-[3px] cursor-pointer transition-all ${
                    viewMode === "grid" ? "bg-white text-[var(--cinefil-navy)] shadow-2xs" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  title="Table View"
                  className={`p-2 rounded-[3px] cursor-pointer transition-all ${
                    viewMode === "table" ? "bg-white text-[var(--cinefil-navy)] shadow-2xs" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <TableIcon size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Members List */}
          {loading ? (
            <div className="py-20 text-center text-gray-400">
              <RefreshCw className="animate-spin mx-auto mb-3 text-[var(--cinefil-gold)]" size={32} />
              <p className="text-xs font-bold tracking-wider uppercase text-gray-500">Loading verified member repertoire...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="bg-slate-50 rounded-[4px] border border-dashed border-gray-300 p-12 text-center max-w-xl mx-auto">
              <User size={40} className="mx-auto text-gray-400 mb-3" />
              <h3 className="text-base font-bold text-gray-800">No Members Found</h3>
              <p className="text-xs text-gray-500 mt-1">
                {searchTerm
                  ? `No members matching "${searchTerm}". Try resetting your search filter.`
                  : "No listed members currently available."}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedMembers.map((m) => {
                const slug = m.slug || `${m.full_name?.toLowerCase().replace(/\s+/g, "-")}-${m.id}`;
                const companyName = m.companies?.[0]?.company_name || m.companies?.[0]?.company?.name;

                return (
                  <SpotlightCard
                    key={m.id}
                    className="p-6 rounded-[4px] border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group bg-white"
                    spotlightColor="rgba(201, 162, 39, 0.2)"
                  >
                    <div>
                      <div className="flex items-start gap-4 mb-4">
                        {m.photo_url ? (
                          <img
                            src={m.photo_url}
                            alt={m.full_name}
                            loading="lazy"
                            decoding="async"
                            className="w-16 h-16 rounded-[4px] object-cover border border-[var(--cinefil-gold)] shadow-xs group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-[4px] bg-gradient-to-br from-[#0f2540] to-[#183858] text-[var(--cinefil-gold)] flex items-center justify-center font-black text-xl border border-[var(--cinefil-gold)] shadow-xs">
                            {m.full_name?.charAt(0).toUpperCase() || "M"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-extrabold text-gray-900 text-base group-hover:text-[var(--cinefil-navy)] transition-colors truncate">
                            {m.full_name}
                          </h3>
                          <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5 mt-0.5 truncate">
                            <Building2 size={13} className="text-[var(--cinefil-gold)] shrink-0" />
                            <span className="truncate">{companyName || "Independent Producer"}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-[3px]">
                          <ShieldCheck size={12} /> Cinefil Verified
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 bg-slate-100 border border-gray-200 px-2.5 py-0.5 rounded-[3px]">
                          {m.membership_type_name || m.role_title || "Listed Member"}
                        </span>
                      </div>

                      <div className="text-xs text-gray-600 space-y-1.5 py-2.5 border-t border-gray-100 mb-4 bg-slate-50 px-3 rounded-[4px]">
                        <div className="flex justify-between items-center font-medium">
                          <span>Repertoire Films:</span>
                          <span className="font-extrabold text-[var(--cinefil-navy)] flex items-center gap-1">
                            <Film size={13} className="text-[var(--cinefil-gold)]" />
                            {m.films?.length || 0} Registered
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate(`profile/${slug}`)}
                      className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[4px] bg-[var(--cinefil-navy)] hover:bg-[var(--cinefil-navy-mid)] text-white font-bold text-xs transition-all shadow-xs cursor-pointer transform hover:scale-[1.01] active:scale-95"
                    >
                      <span>View Member Profile</span>
                      <ExternalLink size={13} />
                    </button>
                  </SpotlightCard>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="overflow-x-auto bg-white rounded-[4px] border border-gray-200 shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[var(--cinefil-navy)] text-white font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-5">Member Name</th>
                    <th className="py-4 px-5">Company / Banner</th>
                    <th className="py-4 px-5">Membership Type</th>
                    <th className="py-4 px-5 text-center">Registered Films</th>
                    <th className="py-4 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {paginatedMembers.map((m) => {
                    const slug = m.slug || `${m.full_name?.toLowerCase().replace(/\s+/g, "-")}-${m.id}`;
                    const companyName = m.companies?.[0]?.company_name || m.companies?.[0]?.company?.name;

                    return (
                      <tr key={m.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-4 px-5 font-bold text-gray-900 text-sm">
                          {m.full_name}
                        </td>
                        <td className="py-4 px-5 text-gray-600">{companyName || "Independent"}</td>
                        <td className="py-4 px-5">
                          <span className="px-2.5 py-0.5 rounded-[3px] bg-slate-100 text-gray-700 font-bold text-[10px] uppercase tracking-wider border border-gray-200">
                            {m.membership_type_name || "Member"}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center font-bold text-gray-800">
                          {m.films?.length || 0}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => onNavigate(`profile/${slug}`)}
                            className="px-3.5 py-1.5 rounded-[4px] bg-[var(--cinefil-navy)] text-white text-xs font-bold hover:bg-[var(--cinefil-navy-mid)] transition-colors cursor-pointer"
                          >
                            Profile
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between bg-slate-50 p-4 rounded-[4px] border border-gray-200">
              <span className="text-xs text-gray-600 font-medium">
                Page <span className="font-bold text-gray-900">{currentPage}</span> of{" "}
                <span className="font-bold text-gray-900">{totalPages}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3.5 py-1.5 rounded-[4px] border border-gray-200 bg-white text-gray-700 text-xs font-bold disabled:opacity-40 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft size={14} className="inline mr-1" /> Prev
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-1.5 rounded-[4px] border border-gray-200 bg-white text-gray-700 text-xs font-bold disabled:opacity-40 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  Next <ChevronRight size={14} className="inline ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
