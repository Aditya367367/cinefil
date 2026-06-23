import { useState } from "react";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { PageBanner } from "./PageBanner";
import { contactService } from "../../services/contactService";

function ContactForm({ heading }: { heading: string }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", contact: "", email: "", company: "", industry: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(null);
    setError(null);

    // Simple sanitization & validation
    if (!form.firstName || !form.lastName || !form.contact || !form.email || !form.company || !form.industry) {
      setError("Please fill in all required fields.");
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
        industry: form.industry
      });

      if (response.id) {
        setSuccess("Thank you! Your inquiry was submitted successfully.");
        setForm({ firstName: "", lastName: "", contact: "", email: "", company: "", industry: "" });
      } else {
        setError("Failed to submit the form. Please try again.");
      }
    } catch (e: any) {
      if (e.response?.status === 429) {
        setError("Rate limit exceeded. Please try again in a minute.");
      } else {
        setError("An error occurred while submitting. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="mb-5 text-xl font-bold" style={{ color: "var(--cinefil-navy)", fontFamily: "var(--font-heading)" }}>
        {heading}
      </h3>
      {success && (
        <div className="mb-4 p-4 text-sm bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 text-sm bg-rose-100 border border-rose-300 text-rose-800 rounded-lg">
          {error}
        </div>
      )}
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text" placeholder="First name*" required value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="px-4 py-2.5 border rounded text-sm focus:outline-none focus:border-[--cinefil-gold]"
            style={{ borderColor: "rgba(0,0,0,0.15)" }}
          />
          <input
            type="text" placeholder="Last name*" required value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="px-4 py-2.5 border rounded text-sm focus:outline-none focus:border-[--cinefil-gold]"
            style={{ borderColor: "rgba(0,0,0,0.15)" }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="tel" placeholder="Contact No*" required value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            className="px-4 py-2.5 border rounded text-sm focus:outline-none focus:border-[--cinefil-gold]"
            style={{ borderColor: "rgba(0,0,0,0.15)" }}
          />
          <input
            type="email" placeholder="Email*" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="px-4 py-2.5 border rounded text-sm focus:outline-none focus:border-[--cinefil-gold]"
            style={{ borderColor: "rgba(0,0,0,0.15)" }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text" placeholder="Company name*" required value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="px-4 py-2.5 border rounded text-sm focus:outline-none focus:border-[--cinefil-gold]"
            style={{ borderColor: "rgba(0,0,0,0.15)" }}
          />
          <select
            value={form.industry}
            required
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
            className="px-4 py-2.5 border rounded text-sm focus:outline-none focus:border-[--cinefil-gold] bg-white"
            style={{ borderColor: "rgba(0,0,0,0.15)", color: form.industry ? "var(--cinefil-navy)" : "#9ca3af" }}
          >
            <option value="" disabled>Select Industry</option>
            <option>Hotels & Hospitality</option>
            <option>Shopping Malls & Retail</option>
            <option>Restaurants & Food Service</option>
            <option>Healthcare</option>
            <option>Transport</option>
            <option>Corporate & Offices</option>
            <option>Entertainment & Leisure</option>
            <option>Digital Platforms</option>
            <option>Other</option>
          </select>
        </div>
        <div className="mt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2.5 rounded font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "var(--cinefil-gold)", color: "var(--cinefil-navy)" }}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function ContactPage() {
  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <PageBanner title="CONTACT" subtitle="Reach out to CINEFIL for licences, membership, and enquiries." />

      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Forms */}
            <div className="lg:col-span-2 flex flex-col gap-10">
              <ContactForm heading="Contact For CINEFIL Licence" />
              <div className="border-t pt-10" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                {/* <ContactForm heading="Fill the form for Grievances (if any)" /> */}
              </div>
            </div>

            {/* Office Info */}
            <div className="flex flex-col gap-6">
              <h3 className="mb-2" style={{ color: "var(--cinefil-navy)", fontFamily: "var(--font-heading)" }}>
                Office
              </h3>

              <div className="flex flex-col gap-5">
                <div className="flex gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "var(--cinefil-gold)" }}
                  >
                    <MapPin size={13} style={{ color: "var(--cinefil-navy)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: "var(--cinefil-navy)" }}>REGISTERED ADDRESS</p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--cinefil-muted)" }}>
                      73, Ground Floor, Om Heera Panna Premises Society Ltd., Oshiwara, Jogeshwari West, Mumbai – 400102
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "var(--cinefil-gold)" }}
                  >
                    <MapPin size={13} style={{ color: "var(--cinefil-navy)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: "var(--cinefil-navy)" }}>ADMINISTRATIVE OFFICE</p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--cinefil-muted)" }}>
                      21, Second Floor, Om Heera Panna Premises Society Ltd., Oshiwara, Jogeshwari West, Mumbai – 400102
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "var(--cinefil-gold)" }}
                  >
                    <Mail size={13} style={{ color: "var(--cinefil-navy)" }} />
                  </div>
                  <p className="text-xs mt-1.5" style={{ color: "var(--cinefil-muted)" }}>admin@cinefilindia.com</p>
                </div>

                <div className="flex gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "var(--cinefil-gold)" }}
                  >
                    <Phone size={13} style={{ color: "var(--cinefil-navy)" }} />
                  </div>
                  <p className="text-xs mt-1.5" style={{ color: "var(--cinefil-muted)" }}>+91 8097252172</p>
                </div>
              </div>

              <div
                className="mt-2 p-4 rounded-lg"
                style={{ backgroundColor: "var(--cinefil-light-bg)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={14} style={{ color: "var(--cinefil-gold)" }} />
                  <p className="text-xs font-semibold" style={{ color: "var(--cinefil-navy)" }}>Business Hours</p>
                </div>
                <div className="flex flex-col gap-1 text-xs" style={{ color: "var(--cinefil-muted)" }}>
                  <span>Monday – Friday: 11:00 am to 6:00 pm</span>
                  <span>Saturday: 11:00 am to 2:00 pm</span>
                  <span>Sunday: Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
