import { SectionHeader } from "./SectionHeader";

type GenericPageType = "governance" | "schemes" | "contact";

interface GenericPageProps {
  page: GenericPageType;
}

const pageData: Record<GenericPageType, { title: string; subtitle: string; content: React.ReactNode }> = {
  governance: {
    title: "GOVERNANCE",
    subtitle: "Transparency and accountability in the administration of CINEFIL India.",
    content: (
      <div className="space-y-6 text-sm leading-relaxed" style={{ color: "var(--cinefil-muted)" }}>
        <p>
          CINEFIL is governed by a Board of Directors and a Governing Council that oversees the strategic and operational
          functioning of the Society. The governance framework ensures that royalty collection and distribution are carried
          out in a fair, transparent, and legally compliant manner under the Copyright Act 1957.
        </p>
        <p>
          The Society's accounts are audited annually and reports are filed with the Copyright Board. Members have access
          to financial statements and distribution reports as per the rules of the Society.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {["Certificate of Registration", "Rules & Regulations", "Annual Reports"].map((doc) => (
            <button
              key={doc}
              className="flex flex-col items-center gap-3 p-5 rounded-xl border hover:shadow-md transition-shadow text-center"
              style={{ borderColor: "var(--cinefil-gold)" }}
            >
              <span className="text-3xl">📄</span>
              <span className="text-sm font-semibold" style={{ color: "var(--cinefil-navy)" }}>{doc}</span>
              <span className="text-xs" style={{ color: "var(--cinefil-gold)" }}>Download →</span>
            </button>
          ))}
        </div>
      </div>
    ),
  },
  schemes: {
    title: "SCHEMES",
    subtitle: "Royalty schemes and tariff structures for CINEFIL licence holders.",
    content: (
      <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--cinefil-muted)" }}>
        <p>
          CINEFIL issues an Introduced Tariff (Tariff) for different categories of establishments that communicate
          Cinematograph Film Work to the public. The tariff is designed to be equitable and reflective of the commercial
          value of the public performance rights.
        </p>
        <p>
          Scheme categories include Hotels & Hospitality, Shopping Malls, Restaurants, Transport, Healthcare, Corporate,
          Educational Institutions, and Digital Platforms. Contact us for the applicable tariff for your business category.
        </p>
        <div
          className="p-5 rounded-xl mt-4"
          style={{ backgroundColor: "var(--cinefil-light-bg)", border: "1px solid rgba(201,162,39,0.3)" }}
        >
          <p className="font-semibold text-sm mb-2" style={{ color: "var(--cinefil-navy)" }}>
            Membership is FREE for bonafide Film Producers
          </p>
          <p className="text-xs">
            Subject to terms and conditions. Negative right owners may also apply as per the applicable scheme.
          </p>
        </div>
      </div>
    ),
  },
  contact: {
    title: "CONTACT",
    subtitle: "Get in touch with CINEFIL India for licences, membership, and enquiries.",
    content: (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          {[
            { label: "Email", value: "admin@cinefilindia.com" },
            { label: "Phone", value: "+91 8097252172" },
            { label: "Office", value: "21, Second Floor, Om Heera Panna Premises Society Ltd., Oshiwara, Jogeshwari West, Mumbai – 400102" },
            { label: "Hours", value: "Monday–Friday 11:00 am to 6:00 pm · Saturday 11:00 am to 2:00 pm · Sunday Closed" },
          ].map((item) => (
            <div key={item.label}>
              <p className="font-semibold text-xs tracking-wider uppercase mb-1" style={{ color: "var(--cinefil-gold)" }}>{item.label}</p>
              <p className="text-sm" style={{ color: "var(--cinefil-muted)" }}>{item.value}</p>
            </div>
          ))}
        </div>
        <form
          className="space-y-3"
          onSubmit={(e) => e.preventDefault()}
          style={{ fontFamily: "var(--font-body)" }}
        >
          <p className="font-semibold text-sm mb-1" style={{ color: "var(--cinefil-navy)" }}>
            Request a CINEFIL Licence
          </p>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Full Name*" className="col-span-2 sm:col-span-1 px-4 py-2.5 rounded border text-sm focus:outline-none" style={{ borderColor: "rgba(0,0,0,0.15)" }} />
            <input type="email" placeholder="Email Address*" className="col-span-2 sm:col-span-1 px-4 py-2.5 rounded border text-sm focus:outline-none" style={{ borderColor: "rgba(0,0,0,0.15)" }} />
            <input type="tel" placeholder="Mobile Number*" className="col-span-2 sm:col-span-1 px-4 py-2.5 rounded border text-sm focus:outline-none" style={{ borderColor: "rgba(0,0,0,0.15)" }} />
            <input type="text" placeholder="Company Name*" className="col-span-2 sm:col-span-1 px-4 py-2.5 rounded border text-sm focus:outline-none" style={{ borderColor: "rgba(0,0,0,0.15)" }} />
          </div>
          <textarea placeholder="Your message..." rows={3} className="w-full px-4 py-2.5 rounded border text-sm focus:outline-none resize-none" style={{ borderColor: "rgba(0,0,0,0.15)" }} />
          <button
            type="submit"
            className="px-6 py-2.5 rounded font-semibold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--cinefil-gold)", color: "var(--cinefil-navy)" }}
          >
            SUBMIT
          </button>
        </form>
      </div>
    ),
  },
};

export function GenericPage({ page }: GenericPageProps) {
  const data = pageData[page];
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
          {data.title}
        </h1>
        <div className="w-16 h-0.5 mx-auto mt-3" style={{ backgroundColor: "var(--cinefil-gold)" }} />
      </div>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={data.title.charAt(0) + data.title.slice(1).toLowerCase()} subtitle={data.subtitle} />
          {data.content}
        </div>
      </section>
    </div>
  );
}
