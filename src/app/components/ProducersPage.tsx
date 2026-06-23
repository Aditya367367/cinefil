import { ChevronRight, Download } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { PageBanner } from "./PageBanner";
import type { Page } from "./Navbar";

interface ProducersPageProps {
  onNavigate: (page: Page) => void;
}

export function ProducersPage({ onNavigate }: ProducersPageProps) {
  const { isAuthenticated } = useAuth();
  
  const handleMembershipClick = () => {
    if (!isAuthenticated) {
      onNavigate("login");
    } else {
      onNavigate("membership-form");
    }
  };

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <PageBanner title="PRODUCERS & OTHER OWNERS" subtitle="Film Producers and Owners registered with CINEFIL for public performance rights." />

      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2
              className="mb-3"
              style={{ color: "var(--cinefil-orange)", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
            >
              Membership
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

            <div
              className="rounded-xl p-6 space-y-4"
              style={{ backgroundColor: "var(--cinefil-light-bg)" }}
            >
              <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--cinefil-muted)" }}>
                <p>
                  COPYRIGHT ADMINISTRATION SOCIETIES ACROSS THE WORLD HAVE BECOME THE MOST REALISTIC WAY FOR
                  COPYRIGHT AUTHORS AND OWNERS OF CINEMATOGRAPHIC FILM WORK TO MONETISE PUBLIC PERFORMANCE RIGHTS.
                </p>
                <p>
                  CINEFIL'S MEMBERSHIP IS FREE for bonafide Film Producers and negative right owners subject to terms
                  and conditions, as applicable.
                </p>
              </div>
              <div
                className="mt-4 p-4 rounded-lg border-l-4"
                style={{ backgroundColor: "white", borderLeftColor: "var(--cinefil-gold)" }}
              >
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--cinefil-navy)" }}>
                  {isAuthenticated ? "Apply for membership" : "Become a member"}
                </p>
                <p className="text-xs text-slate-500 mb-2">
                  {isAuthenticated 
                    ? "Download the membership form or apply online." 
                    : "Sign in to your account and apply for membership."}
                </p>
                <button
                  className="mt-2 px-5 py-2 rounded font-semibold text-sm flex items-center gap-2 transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--cinefil-navy)", color: "white" }}
                  onClick={handleMembershipClick}
                >
                  <ChevronRight size={14} /> {isAuthenticated ? "Go to form" : "Login"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
