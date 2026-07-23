import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft, Search, ShieldCheck, User, Film, Building2, ExternalLink, RefreshCw, LayoutGrid, Table } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { memberService } from "../../../services/memberService";
import { PageBanner } from "./PageBanner";
import type { Page } from "./Navbar";

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
      const list = Array.isArray(data) ? data : (data.results || []);
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

  // Reset to Page 1 when filters or search terms change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterTab]);

  const filteredMembers = members.filter((m) => {
    const term = searchTerm.toLowerCase();
    const companyNames = (m.companies || []).map((c: any) => c.company_name || c.company?.name || "").join(" ").toLowerCase();
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
    <div style={{ fontFamily: "var(--font-body)" }}>
      <PageBanner
        title="PRODUCERS & REGISTERED MEMBERS"
        subtitle="Film Producers, Negative Right Holders, and Copyright Owners registered with CINEFIL."
      />

      {/* Directory Section */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded">
                Official Directory
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Listed Members & Right Holders
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Browse verified film producers and copyright owners registered with Cinefil.
              </p>
            </div>

            {/* Filter Tabs, Search & View Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, company, role..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 shadow-xs"
                />
              </div>

              <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
                <button
                  onClick={() => setFilterTab("all")}
                  className={`px-3 py-1.5 text-xs font-bold rounded cursor-pointer transition-colors ${
                    filterTab === "all" ? "bg-[#1e3a5f] text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  All ({members.length})
                </button>
                <button
                  onClick={() => setFilterTab("prime")}
                  className={`px-3 py-1.5 text-xs font-bold rounded cursor-pointer transition-colors ${
                    filterTab === "prime" ? "bg-[#1e3a5f] text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Prime ({members.filter((m) => m.is_prime).length})
                </button>
              </div>

              {/* Grid / Table View Toggle */}
              <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
                <button
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    viewMode === "grid" ? "bg-[#1e3a5f] text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  title="Table View"
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    viewMode === "table" ? "bg-[#1e3a5f] text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Table size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Members List */}
          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <RefreshCw className="animate-spin mx-auto mb-3 text-indigo-600" size={28} />
              <p className="text-xs font-bold tracking-wide uppercase">Loading listed members...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center max-w-xl mx-auto">
              <User size={40} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Members Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                {searchTerm
                  ? `No members matching "${searchTerm}". Try searching for another name or company.`
                  : "No listed members currently available."}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View (6 per page) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedMembers.map((m) => {
                const slug = m.slug || `${m.full_name?.toLowerCase().replace(/\s+/g, "-")}-${m.id}`;
                const companyName = m.companies?.[0]?.company_name || m.companies?.[0]?.company?.name;

                return (
                  <div
                    key={m.id}
                    className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          {m.photo_url ? (
                            <img
                              src={m.photo_url}
                              alt={m.full_name}
                              className="w-14 h-14 rounded-full object-cover border-2 border-[#c5a059] shadow-xs"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#0f2540] text-amber-400 flex items-center justify-center font-black text-lg border-2 border-[#c5a059]">
                              {m.full_name?.charAt(0).toUpperCase() || "M"}
                            </div>
                          )}
                          <div>
                            <h3 className="font-black text-slate-900 text-base group-hover:text-[#1e3a5f] transition-colors">
                              {m.full_name}
                            </h3>
                            <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <Building2 size={12} className="text-[#c5a059]" />
                              {companyName || "Independent Producer"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                          <ShieldCheck size={12} /> Cinefil Verified
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">
                          {m.membership_type_name || m.role_title || "Listed Member"}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1.5 py-2 border-t border-slate-100 mb-4">
                        <div className="flex justify-between items-center text-slate-500 font-medium">
                          <span>Repertoire Films:</span>
                          <span className="font-bold text-slate-900 flex items-center gap-1">
                            <Film size={12} className="text-indigo-600" />
                            {m.films?.length || 0} Registered
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate(`profile/${slug}`)}
                      className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-[#1e3a5f] text-white font-bold text-xs transition-all shadow-xs cursor-pointer group-hover:bg-[#1e3a5f]"
                    >
                      View Member Profile
                      <ExternalLink size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View (6 per page) */
            <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Member Name</th>
                    <th className="py-3.5 px-4">Company / Banner</th>
                    <th className="py-3.5 px-4">Membership Type</th>
                    <th className="py-3.5 px-4 text-center">Registered Films</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {paginatedMembers.map((m) => {
                    const slug = m.slug || `${m.full_name?.toLowerCase().replace(/\s+/g, "-")}-${m.id}`;
                    const companyName = m.companies?.[0]?.company_name || m.companies?.[0]?.company?.name;

                    return (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {m.photo_url ? (
                              <img
                                src={m.photo_url}
                                alt={m.full_name}
                                className="w-9 h-9 rounded-full object-cover border border-[#c5a059]"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-[#1e3a5f] text-amber-400 flex items-center justify-center font-bold text-xs border border-[#c5a059]">
                                {m.full_name?.charAt(0).toUpperCase() || "M"}
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-slate-900 block">{m.full_name}</span>
                              <span className="text-[11px] text-slate-400 font-medium">{m.role_title || "Film Producer"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                            <Building2 size={13} className="text-[#c5a059]" />
                            {companyName || "Independent Producer"}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                              <ShieldCheck size={11} /> {m.membership_type_name || (m.is_prime ? "Prime Member" : "Associate Member")}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full text-[11px]">
                            <Film size={11} className="text-indigo-600" />
                            {m.films?.length || 0}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => onNavigate(`profile/${slug}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-[#1e3a5f] text-white font-bold text-[11px] transition-all shadow-xs cursor-pointer"
                          >
                            Profile <ExternalLink size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Bar */}
          {!loading && filteredMembers.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">
                Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to{" "}
                <span className="font-bold text-slate-900">
                  {Math.min(startIndex + ITEMS_PER_PAGE, filteredMembers.length)}
                </span>{" "}
                of <span className="font-bold text-slate-900">{filteredMembers.length}</span> listed members
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft size={14} /> Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-[#1e3a5f] text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Information & Registration Section */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2
              className="mb-3"
              style={{
                color: "var(--cinefil-orange)",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
              }}
            >
              Membership Information
            </h2>
            <div className="w-12 h-0.5 mx-auto" style={{ backgroundColor: "var(--cinefil-red-accent)" }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--cinefil-muted)" }}>
              <p>
                Film Producer and owner members of CINEFIL allocate interest for issuing (CPL) Cinematograph Film
                Performance Licence in respect to Cinematograph Film Work Public performance rights for collection and
                distribution of royalties from India and Overseas in Cinematograph Film Work (VIDEO) being the category
                of work as defined under Section 2(f)(ii) read with Section 13(1)(b) of the Copyright Act 1957.
              </p>
              <p>
                Primary object of CINEFIL is to monetise the public performance right of Cinematograph Film Work
                (VIDEO) which are communicated to public in places like – Hotels, restaurants, auditoriums,
                discotheques, lounges, housing Societies, campground parks, buses, cruises, railways, surface
                transport, premium hospitals, airports, large event venues, video application developers, sports
                stadiums, digital platforms etc.
              </p>
            </div>

            <div className="rounded-xl p-6 space-y-4" style={{ backgroundColor: "var(--cinefil-light-bg)" }}>
              <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--cinefil-muted)" }}>
                <p>
                  COPYRIGHT ADMINISTRATION SOCIETIES ACROSS THE WORLD HAVE BECOME THE MOST REALISTIC WAY FOR COPYRIGHT
                  AUTHORS AND OWNERS OF CINEMATOGRAPHIC FILM WORK TO MONETISE PUBLIC PERFORMANCE RIGHTS.
                </p>
                <p>
                  CINEFIL'S MEMBERSHIP IS FREE for bonafide Film Producers and negative right owners subject to terms and
                  conditions, as applicable.
                </p>
              </div>
              <div
                className="mt-4 p-4 rounded-lg border-l-4"
                style={{ backgroundColor: "white", borderLeftColor: "var(--cinefil-gold)" }}
              >
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--cinefil-navy)" }}>
                  {isAuthenticated ? "Apply for membership" : "Become a member"}
                </p>
                <p className="text-xs text-slate-500 mb-2">Apply for membership.</p>
                <button
                  className="mt-2 px-5 py-2 rounded font-semibold text-sm flex items-center gap-2 transition-all hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: "var(--cinefil-navy)", color: "white" }}
                  onClick={() => onNavigate("membership-form")}
                >
                  <ChevronRight size={14} /> Membership Form
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
