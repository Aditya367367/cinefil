import { Mail, Phone, MapPin, Clock } from "lucide-react";
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
        industry: "Licence Enquiry"
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
      style={{ background: "linear-gradient(180deg, #0f2540 0%, #183858 100%)", fontFamily: "var(--font-body)" }}
      className="text-white/80 pt-12 pb-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          {/* Logo */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img
                src={LogoImage}
                alt="Cinefil logo"
                className="w-10 h-10  object-cover border-2"
              // style={{ borderColor: "var(--cinefil-gold)" }}
              />
              <div>
                {/* <div className="font-bold tracking-widest text-sm" style={{ color: "var(--cinefil-gold)", fontFamily: "var(--font-display)" }}>
                  CINEFIL
                </div>
                <div className="text-white/50 text-[9px] tracking-wider">INDIA</div> */}
              </div>
            </div>
            <p className="text-xs text-white/55 leading-relaxed">
              Cinefil Producers Performance Limited — A Copyright Society registered under the Central Government.
            </p>
          </div>

          {/* Website Links */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--cinefil-gold)" }}>
              Website Links
            </h4>
            <ul className="flex flex-col gap-1.5">
              {([
                ["Home", "home"], ["Governance", "governance"], ["Team", "governing-board"],
                ["Members", "producers-owners"], ["List of Films", "films"],
                ["Schemes", "schemes"], ["Contact", "contact"], ["License From", "license-form"],
              ] as [string, Page][]).map(([label, page]) => (
                <li key={page}>
                  <button
                    onClick={() => onNavigate(page)}
                    className="text-xs text-white/55 hover:text-[var(--cinefil-gold)] transition-colors text-left focus:outline-none focus:text-[var(--cinefil-gold)]"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--cinefil-gold)" }}>
              Connect With Us
            </h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2 text-xs text-white/55">
                <Mail size={13} className="mt-0.5 flex-shrink-0" style={{ color: "var(--cinefil-gold)" }} />
                admin@cinefilindia.com
              </li>
              <li className="flex items-start gap-2 text-xs text-white/55">
                <Phone size={13} className="mt-0.5 flex-shrink-0" style={{ color: "var(--cinefil-gold)" }} />
                +91 8097252172
              </li>
              <li className="flex items-start gap-2 text-xs text-white/55">
                <MapPin size={13} className="mt-0.5 flex-shrink-0" style={{ color: "var(--cinefil-gold)" }} />
                21, Second Floor, Om Heera Panna Premises Society Ltd., Oshiwara, Jogeshwari West, Mumbai – 400102
              </li>
              <li className="flex items-start gap-2 text-xs text-white/55">
                <Clock size={13} className="mt-0.5 flex-shrink-0" style={{ color: "var(--cinefil-gold)" }} />
                Mon–Fri 11am–6pm · Sat 11am–2pm
              </li>
            </ul>
          </div>

          {/* Licence Form */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--cinefil-gold)" }}>
              Contact Us for CINEFIL Licence
            </h4>
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="First Name*"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="px-2.5 py-1.5 text-xs rounded bg-white/10 border border-white/15 text-white placeholder-white/35 focus:outline-none focus:border-[var(--cinefil-gold)] transition-colors"
                />
                <input
                  type="text"
                  placeholder="Last Name*"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="px-2.5 py-1.5 text-xs rounded bg-white/10 border border-white/15 text-white placeholder-white/35 focus:outline-none focus:border-[var(--cinefil-gold)] transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="email"
                  placeholder="Your Email*"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="px-2.5 py-1.5 text-xs rounded bg-white/10 border border-white/15 text-white placeholder-white/35 focus:outline-none focus:border-[var(--cinefil-gold)] transition-colors"
                />
                <input
                  type="tel"
                  placeholder="Mobile No*"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="px-2.5 py-1.5 text-xs rounded bg-white/10 border border-white/15 text-white placeholder-white/35 focus:outline-none focus:border-[var(--cinefil-gold)] transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="Company*"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="px-2.5 py-1.5 text-xs rounded bg-white/10 border border-white/15 text-white placeholder-white/35 focus:outline-none focus:border-[var(--cinefil-gold)] transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 px-4 py-2 text-xs font-bold rounded tracking-wide transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "var(--cinefil-gold)", color: "var(--cinefil-navy)" }}
              >
                {isSubmitting ? "Submitting..." : "SUBMIT"}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-white/35">
          <span>© {new Date().getFullYear()} Cinefil Producers Performance Limited. All rights reserved.</span>
          <span>Copyright Registration through Copyright Office Website, Government of India</span>
        </div>
      </div>
    </footer>
  );
}
