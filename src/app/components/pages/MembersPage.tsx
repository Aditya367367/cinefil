import { ChevronRight, Download } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

type MemberSubPage = "producers" | "producers-owners" | "legal-advisor";

interface MembersPageProps {
  subPage: MemberSubPage;
}

const content: Record<MemberSubPage, { title: string; heading: string; body: string[] }> = {
  producers: {
    title: "PRODUCERS",
    heading: "Membership",
    body: [
      `Film Producer and owner members of CINEFIL allocate interest for issuing (CPL) Cinematograph Film Performance Licence in respect to Cinematograph Film Work Public performance rights for collection and distribution of royalties from India and Overseas in Cinematograph Film Work (VIDEO) being the category of work as defined under Section 2(f)(ii) read with Section 13(1)(b) of the Copyright Act 1957.`,
      `Primary object of CINEFIL is to monetise the public performance right of Cinematograph Film Work (VIDEO) which are communicated to public in places like – Hotels, restaurants, auditoriums, discotheques, lounges, housing Societies, campground parks, buses, cruises, railways, surface transport, premium hospitals, airports, large event venues, video application developers, sports stadiums, digital platforms etc.`,
      `COPYRIGHT ADMINISTRATION SOCIETIES ACROSS THE WORLD HAVE BECOME THE MOST REALISTIC WAY FOR COPYRIGHT AUTHORS AND OWNERS OF CINEMATOGRAPHIC FILM WORK TO MONETISE PUBLIC PERFORMANCE RIGHTS.`,
      `CINEFIL'S MEMBERSHIP IS FREE for bonafide Film Producers and negative right owners subject to terms and conditions, as applicable.`,
    ],
  },
  "producers-owners": {
    title: "PRODUCERS & OWNERS",
    heading: "Producers and Owners",
    body: [
      `CINEFIL represents Film Producers and Owners across India, helping them collect and administer their public performance rights for Cinematograph Film Work (VIDEO).`,
      `Members enjoy the benefit of collective administration, meaning they do not need to individually negotiate or track down performance licenses — CINEFIL manages this on their behalf, distributing royalties efficiently and transparently.`,
      `Ownership rights, once assigned to CINEFIL for administration, allow the Society to act on behalf of the member for any public performance of their films in India and Overseas, in accordance with the Copyright Act 1957.`,
    ],
  },
  "legal-advisor": {
    title: "LEGAL ADVISOR",
    heading: "Legal Advisors",
    body: [
      `CINEFIL's legal advisory panel comprises eminent legal experts in intellectual property and copyright law who provide guidance to the Society on matters relating to enforcement, compliance, and rights administration.`,
      `Our legal advisors play a crucial role in ensuring that the Society operates within the ambit of the Copyright Act 1957 and all other applicable laws, and that the rights of our members are protected vigorously.`,
      `For legal matters, enquiries, or enforcement-related issues, please contact us at admin@cinefilindia.com.`,
    ],
  },
};

export function MembersPage({ subPage }: MembersPageProps) {
  const page = content[subPage];

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <div
        className="py-16 text-center"
        style={{ backgroundColor: "var(--cinefil-navy)" }}
      >
        <h1
          className="text-white"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
        >
          {page.title}
        </h1>
        <div
          className="w-16 h-0.5 mx-auto mt-3"
          style={{ backgroundColor: "var(--cinefil-gold)" }}
        />
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={page.heading} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              {page.body.slice(0, 2).map((para, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: "var(--cinefil-muted)" }}>
                  {para}
                </p>
              ))}
            </div>
            <div
              className="rounded-xl p-6 space-y-4"
              style={{ backgroundColor: "var(--cinefil-light-bg)" }}
            >
              {page.body.slice(2).map((para, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: "var(--cinefil-muted)" }}>
                  {para}
                </p>
              ))}
              {subPage === "producers" && (
                <button
                  className="mt-4 px-6 py-3 rounded font-semibold text-sm flex items-center gap-2 transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--cinefil-navy)", color: "white" }}
                >
                  <Download size={15} />
                  Download Membership Form
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
