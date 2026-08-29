import { Mail, Phone, MapPin, Clock, ArrowUp, Sparkles, Send } from "lucide-react";
import type { Page } from "./Navbar";
import LogoImage from "../../../imports/Cinefil-New-Logo-Small-Header-150x150.png";
import { contactService } from "../../../services/contactService";
import { useState } from "react";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { handleApiError } from "../../../utils/errorHandler";

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [form, setForm] = useState({ firstName: "", lastName: "", contact: "", email: "", company: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbar();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!form.firstName || !form.lastName || !form.contact || !form.email || !form.company) {
      showSnackbar("Please fill in all required fields.", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await contactService.submitContact({
        first_name: form.firstName,
        last_name: form.lastName,
        contact: form.contact,
        email: form.email,
        company: form.company,
        industry: "Licence Enquiry",
      });

      if (response.id) {
        showSnackbar("Thank you! Your enquiry was submitted successfully.", "success");
        setForm({ firstName: "", lastName: "", contact: "", email: "", company: "" });
      } else {
        showSnackbar("Failed to submit the form. Please try again.", "error");
      }
    } catch (e: any) {
      showSnackbar(handleApiError(e), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #0a1828 0%, #060e18 100%)",
        fontFamily: "var(--font-body)",
      }}
      className="text-white/80 pt-16 pb-8 border-t border-[var(--cinefil-gold)]/20 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Logo & Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src={LogoImage}
                alt="Cinefil Logo"
                className="w-12 h-12 object-contain rounded-lg p-1 bg-white/5 border border-[var(--cinefil-gold)]/40"
              />
              <div>
                <span className="font-extrabold text-white tracking-widest text-base font-display block">
                  CINEFIL
                </span>
                <span className="text-[10px] text-[var(--cinefil-gold)] tracking-wider uppercase font-semibold">
                  INDIA
                </span>
              </div>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Cinefil Producers Performance Limited — A premier Copyright Society registered by the Central Government of India under Section 33(3) of the Copyright Act 1957.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-[var(--cinefil-gold)] font-mono w-max">
              <Sparkles size={11} /> Est. Under Copyright Act 1957
            </div>
          </div>

          {/* Website Links */}
          <div>
            <h4
              className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{ color: "var(--cinefil-gold)" }}
            >
              Quick Navigation
            </h4>
            <ul className="flex flex-col gap-2">
              {(
                [
                  ["Home", "home"],
                  ["Governance Overview", "governance"],
                  ["Governing Board", "governing-board"],
                  ["Honorary Board", "honorary-board"],
                  ["Producers & Owners", "producers-owners"],
                  ["Film Repertoire", "films"],
                  ["Benefit Schemes", "schemes"],
                  ["Licence Application", "license-form"],
                  ["Contact & Support", "contact"],
                ] as [string, Page][]
              ).map(([label, page]) => (
                <li key={page}>
                  <button
                    onClick={() => onNavigate(page)}
                    className="text-xs text-white/60 hover:text-[var(--cinefil-gold)] transition-colors text-left flex items-center gap-1.5 cursor-pointer group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[var(--cinefil-gold)]/40 group-hover:bg-[var(--cinefil-gold)] group-hover:w-2 transition-all" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h4
              className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{ color: "var(--cinefil-gold)" }}
            >
              Headquarters
            </h4>
            <ul className="flex flex-col gap-3.5">
              <li className="flex items-start gap-2.5 text-xs text-white/65">
                <Mail size={15} className="mt-0.5 flex-shrink-0 text-[var(--cinefil-gold)]" />
                <span>admin@cinefilindia.com</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-white/65">
                <Phone size={15} className="mt-0.5 flex-shrink-0 text-[var(--cinefil-gold)]" />
                <span>+91 8097252172</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-white/65">
                <MapPin size={15} className="mt-0.5 flex-shrink-0 text-[var(--cinefil-gold)]" />
                <span>21, Second Floor, Om Heera Panna Premises Society Ltd., Oshiwara, Jogeshwari West, Mumbai – 400102</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-white/65">
                <Clock size={15} className="mt-0.5 flex-shrink-0 text-[var(--cinefil-gold)]" />
                <span>Mon–Fri 11am–6pm · Sat 11am–2pm</span>
              </li>
            </ul>
          </div>

          {/* Licence Enquiry Quick Form */}
          <div>
            <h4
              className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{ color: "var(--cinefil-gold)" }}
            >
              Licence Assessment
            </h4>
            <form className="flex flex-col gap-2.5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="First Name*"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="px-3 py-2 text-xs rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-[var(--cinefil-gold)] transition-colors"
                />
                <input
                  type="text"
                  placeholder="Last Name*"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="px-3 py-2 text-xs rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-[var(--cinefil-gold)] transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="email"
                  placeholder="Email*"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="px-3 py-2 text-xs rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-[var(--cinefil-gold)] transition-colors"
                />
                <input
                  type="tel"
                  placeholder="Mobile No*"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="px-3 py-2 text-xs rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-[var(--cinefil-gold)] transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="Company / Venue Name*"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="px-3 py-2 text-xs rounded-lg bg-white/5 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-[var(--cinefil-gold)] transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 px-4 py-2.5 text-xs font-bold rounded-lg tracking-wide transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                style={{ backgroundColor: "var(--cinefil-gold)", color: "var(--cinefil-navy)" }}
              >
                <Send size={13} />
                <span>{isSubmitting ? "Submitting..." : "Submit Enquiry"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright & Back to top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <span>© {new Date().getFullYear()} Cinefil Producers Performance Limited. All rights reserved.</span>
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-[var(--cinefil-gold)] transition-all cursor-pointer border border-white/10"
          >
            <span>Back to top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}
