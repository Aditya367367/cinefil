import { useState } from "react";
import { MapPin, Mail, Phone, Clock, Send, Sparkles, Building2, CheckCircle2 } from "lucide-react";
import { PageBanner } from "./PageBanner";
import { SectionHeader } from "./SectionHeader";
import { contactService } from "../../../services/contactService";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { SpotlightCard } from "../../../components/ui/SpotlightCard";

function ContactForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    email: "",
    company: "",
    industry: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!form.firstName || !form.lastName || !form.contact || !form.email || !form.company || !form.industry) {
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
        industry: form.industry,
      });

      if (response.id) {
        showSnackbar("Thank you! Your official inquiry was submitted successfully.", "success");
        setForm({ firstName: "", lastName: "", contact: "", email: "", company: "", industry: "" });
      } else {
        showSnackbar("Failed to submit the form. Please try again.", "error");
      }
    } catch (e: any) {
      if (e.response?.status === 429) {
        showSnackbar("Rate limit exceeded. Please try again in a moment.", "error");
      } else {
        showSnackbar("An error occurred while submitting. Please try again.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SpotlightCard
      className="p-8 sm:p-10 rounded-3xl border-gray-200 shadow-2xl bg-white"
      spotlightColor="rgba(201, 162, 39, 0.15)"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-[var(--cinefil-gold)]/15 text-[var(--cinefil-navy)] border border-[var(--cinefil-gold)]/30">
          <Sparkles size={22} className="text-[var(--cinefil-gold)]" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-[var(--cinefil-navy)]" style={{ fontFamily: "var(--font-heading)" }}>
            Direct Enquiry & Licensing Assessment
          </h3>
          <p className="text-xs text-gray-500">
            Official statutory assistance for public exhibition licensing and membership.
          </p>
        </div>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">First Name*</label>
            <input
              type="text"
              placeholder="e.g. Rahul"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-[var(--cinefil-gold)] focus:ring-2 focus:ring-[var(--cinefil-gold)]/20 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Last Name*</label>
            <input
              type="text"
              placeholder="e.g. Sharma"
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-[var(--cinefil-gold)] focus:ring-2 focus:ring-[var(--cinefil-gold)]/20 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Contact*</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              required
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-[var(--cinefil-gold)] focus:ring-2 focus:ring-[var(--cinefil-gold)]/20 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address*</label>
            <input
              type="email"
              placeholder="contact@company.com"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-[var(--cinefil-gold)] focus:ring-2 focus:ring-[var(--cinefil-gold)]/20 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Company / Establishment*</label>
            <input
              type="text"
              placeholder="Business or Venue Name"
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-[var(--cinefil-gold)] focus:ring-2 focus:ring-[var(--cinefil-gold)]/20 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Industry Sector*</label>
            <select
              value={form.industry}
              required
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-[var(--cinefil-gold)] focus:ring-2 focus:ring-[var(--cinefil-gold)]/20 transition cursor-pointer"
            >
              <option value="" disabled>
                Select Industry
              </option>
              <option>Hotels & Hospitality</option>
              <option>Shopping Malls & Retail</option>
              <option>Restaurants & Food Service</option>
              <option>Airlines & Transport</option>
              <option>Corporate & Offices</option>
              <option>Broadcasting & OTT Platforms</option>
              <option>Events & Festivals</option>
              <option>Healthcare & Clinics</option>
              <option>Other Public Commercial Venues</option>
            </select>
          </div>
        </div>

        <div className="mt-4 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: "var(--cinefil-gold)", color: "var(--cinefil-navy)" }}
          >
            <Send size={15} />
            <span>{isSubmitting ? "Submitting..." : "Submit Official Enquiry"}</span>
          </button>
        </div>
      </form>
    </SpotlightCard>
  );
}

export function ContactPage() {
  return (
    <div style={{ fontFamily: "var(--font-body)" }} className="bg-[#f8fafc] min-h-screen">
      <PageBanner
        title="CONTACT & HEADQUARTERS"
        subtitle="Connect with our national secretariat, legal advisors, and licensing department across India."
        badge="Direct Support"
      />

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form Column */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* Office Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <SpotlightCard
                className="p-8 rounded-3xl border-gray-200 shadow-xl bg-slate-900 text-white"
                spotlightColor="rgba(201, 162, 39, 0.25)"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Building2 size={24} className="text-[var(--cinefil-gold)]" />
                  <h3 className="text-lg font-extrabold tracking-tight">Society Headquarters</h3>
                </div>

                <div className="space-y-5 text-xs sm:text-sm">
                  <div className="flex items-start gap-3.5 pb-4 border-b border-white/10">
                    <div className="p-2 rounded-lg bg-white/10 text-[var(--cinefil-gold)] flex-shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--cinefil-gold)]">
                        Registered Office
                      </p>
                      <p className="text-white/80 leading-relaxed mt-0.5">
                        73, Ground Floor, Om Heera Panna Premises Society Ltd., Oshiwara, Jogeshwari West, Mumbai – 400102
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pb-4 border-b border-white/10">
                    <div className="p-2 rounded-lg bg-white/10 text-[var(--cinefil-gold)] flex-shrink-0">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--cinefil-gold)]">
                        Administrative Office
                      </p>
                      <p className="text-white/80 leading-relaxed mt-0.5">
                        21, Second Floor, Om Heera Panna Premises Society Ltd., Oshiwara, Jogeshwari West, Mumbai – 400102
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pb-4 border-b border-white/10">
                    <div className="p-2 rounded-lg bg-white/10 text-[var(--cinefil-gold)] flex-shrink-0">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--cinefil-gold)]">
                        Official Communications
                      </p>
                      <a href="mailto:admin@cinefilindia.com" className="text-white hover:text-[var(--cinefil-gold)] transition-colors">
                        admin@cinefilindia.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-lg bg-white/10 text-[var(--cinefil-gold)] flex-shrink-0">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--cinefil-gold)]">
                        Helpline Number
                      </p>
                      <a href="tel:+918097252172" className="text-white font-bold hover:text-[var(--cinefil-gold)] transition-colors">
                        +91 8097252172
                      </a>
                    </div>
                  </div>
                </div>
              </SpotlightCard>

              {/* Working Hours Card */}
              <SpotlightCard
                className="p-6 rounded-2xl border-gray-200 shadow-md bg-white"
                spotlightColor="rgba(24, 56, 88, 0.1)"
              >
                <div className="flex items-center gap-2.5 mb-3 text-[var(--cinefil-navy)] font-bold text-sm">
                  <Clock size={16} className="text-[var(--cinefil-gold)]" />
                  <span>Working Hours & Consultation</span>
                </div>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <p className="flex justify-between font-medium">
                    <span>Monday – Friday:</span> <span>11:00 am to 6:00 pm</span>
                  </p>
                  <p className="flex justify-between font-medium">
                    <span>Saturday:</span> <span>11:00 am to 2:00 pm</span>
                  </p>
                  <p className="flex justify-between text-rose-600 font-semibold">
                    <span>Sunday & Public Holidays:</span> <span>Closed</span>
                  </p>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
