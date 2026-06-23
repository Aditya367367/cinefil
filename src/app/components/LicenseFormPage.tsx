import { useState, useEffect } from "react";
import { PageBanner } from "./PageBanner";
import { industryService } from "../../services/industryService";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

const typeACities = "MUMBAI, DELHI, KOLKATA, BANGALORE, HYDERABAD, PUNE, SURAT, AHMEDABAD, PATNA, NAGPUR, BHOPAL, SRINAGAR, CHANDIGARH, RAIPUR, VADODARA, VISHAKHAPATNAM, VIJAYWADA, INDORE, JABALPUR, AURANGABAD, DEHRADUN, GUWAHATI, DHANBAD, RANCHI, KOZHIKODE, KOCHI, THIRUVANANTHAPURAM, AGRA, JAIPUR, KANPUR, VARANASI, LUCKNOW";
const typeBCities = "All cities and those cities which are not mentioned in the list of Type A cities";

export function LicenseFormPage() {
  const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);
  const [activeTariffDocument, setActiveTariffDocument] = useState<any>(null);
  const [form, setForm] = useState({
    nameOfPremises: "", typeOfPremises: "", totalArea: "", totalSittings: "",
    contactPerson: "", telephone: "", email: "", gst: "", tan: "", pan: "",
    licencePeriod: "", categoryValue: "", totalRooms: "", tvSets: "",
    otherDisplay: "", fullAddress: "",
  });

  const [industries, setIndustries] = useState<any[]>([]);
  const [categoryLevels, setCategoryLevels] = useState<any[][]>([[]]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [tariffRates, setTariffRates] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingIndustries, setLoadingIndustries] = useState(true);
  const [minimumLoading, setMinimumLoading] = useState(true);

  useEffect(() => {
    industryService.getIndustries().then((res: any) => {
      setIndustries(Array.isArray(res.results) ? res.results : Array.isArray(res) ? res : []);
      setLoadingIndustries(false);
    }).catch(() => {
      setLoadingIndustries(false);
    });

    industryService.getActiveTariffDocument().then((res: any) => {
      if (res && res.length > 0) {
        setActiveTariffDocument(res[0]);
      }
    }).catch(() => {});

    const timer = setTimeout(() => {
      setMinimumLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!form.typeOfPremises || industries.length === 0) {
      setCategoryLevels([[]]);
      setSelectedCategories([]);
      return;
    }

    const selectedIndustry = industries.find(i => i.industry_name === form.typeOfPremises);

    if (selectedIndustry) {
      const params = { industry: selectedIndustry.id, parent: '' };
      industryService.getCategories(params).then((res: any) => {
        const topLevelCategories = Array.isArray(res.results) ? res.results : Array.isArray(res) ? res : [];
        setCategoryLevels([topLevelCategories]);
        setSelectedCategories([]);
      }).catch((err: any) => {
        setCategoryLevels([[]]);
        setSelectedCategories([]);
      });
    } else {
      setCategoryLevels([[]]);
      setSelectedCategories([]);
    }
  }, [form.typeOfPremises, industries]);

  const handleCategoryChange = (level: number, categoryId: string) => {
    const category = categoryLevels[level].find(c => c.id.toString() === categoryId);
    if (!category) return;

    const newSelectedCategories = [...selectedCategories.slice(0, level), category];
    setSelectedCategories(newSelectedCategories);
    setTariffRates([]); // Clear rates whenever a new category is selected

    // If the selected category has children, fetch and display them.
    if (category.children && category.children.length > 0) {
      industryService.getCategories({ parent: categoryId }).then((res: any) => {
        const childCategories = Array.isArray(res.results) ? res.results : Array.isArray(res) ? res : [];
        const newCategoryLevels = [...categoryLevels.slice(0, level + 1), childCategories];
        setCategoryLevels(newCategoryLevels);
      }).catch(() => {});
    } 
    // If it's a leaf node (no children), fetch the tariff rates.
    else {
      setCategoryLevels(categoryLevels.slice(0, level + 1)); // Remove deeper levels
      industryService.getTariffs({ category: categoryId }).then((res: any) => {
        setTariffRates(Array.isArray(res.results) ? res.results : Array.isArray(res) ? res : []);
      }).catch(() => {});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(null);
    setError(null);

    try {
      // Find default industry/category if not properly selected
      const industryId = form.typeOfPremises ? industries.find(i => i.industry_name === form.typeOfPremises)?.id || industries[0]?.id : industries[0]?.id;
      const categoryId = selectedCategories.length > 0 ? selectedCategories[selectedCategories.length - 1].id : null;

      if (!industryId || !categoryId) {
        setError("Please wait for industries and categories to load or select valid options.");
        setIsSubmitting(false);
        return;
      }

      const response = await industryService.submitLicence({
        industry: industryId,
        category: categoryId,
        category_path: selectedCategories.map(c => c.category_name), // Create the hierarchical path
        premises_name: form.nameOfPremises,
        contact_person: form.contactPerson,
        phone: form.telephone,
        email: form.email,
        gst_number: form.gst,
        tan_number: form.tan,
        pan_number: form.pan,
        total_area_sqft: parseInt(form.totalArea) || null,
        total_sitting_capacity: parseInt(form.totalSittings) || null,
        total_rooms: parseInt(form.totalRooms) || null,
        total_tv_sets: parseInt(form.tvSets) || null,
        other_display_means: form.otherDisplay,
        address: form.fullAddress
      });

      if (response.id) {
        setSuccess("Your licence application was submitted successfully! Our team will contact you soon.");
        setForm({
          nameOfPremises: "", typeOfPremises: "", totalArea: "", totalSittings: "",
          contactPerson: "", telephone: "", email: "", gst: "", tan: "", pan: "",
          licencePeriod: "", categoryValue: "", totalRooms: "", tvSets: "",
          otherDisplay: "", fullAddress: "",
        });
      } else {
        setError("Failed to submit the application. Please check your inputs.");
      }
    } catch (e: any) {
      setError("An error occurred while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = (key: keyof typeof form, placeholder: string, type = "text", col2 = false, required = false) => (
    <div className={col2 ? "col-span-2" : ""}>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full px-3 py-2.5 border rounded text-sm focus:outline-none focus:border-[--cinefil-gold]"
        style={{ borderColor: "rgba(0,0,0,0.15)", color: "var(--cinefil-navy)" }}
      />
    </div>
  );

  return (
    <div style={{ fontFamily: "var(--font-body)" }}>
      <PageBanner title="CINEFIL'S LICENCE APPLICATION FORM" subtitle="Apply for a Cinematograph Film Performance Licence (CPL)" />

      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {loadingIndustries || minimumLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="flex flex-col gap-4">
                <div className="h-6 bg-slate-200 rounded w-1/3 animate-pulse" />
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-1/4 animate-pulse" />
                    <div className="h-10 bg-slate-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                <div className="h-6 bg-slate-200 rounded w-1/3 animate-pulse" />
                <div className="p-4 rounded-lg bg-slate-50 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
                  <div className="h-3 bg-slate-200 rounded w-full animate-pulse" />
                  <div className="h-3 bg-slate-200 rounded w-2/3 animate-pulse" />
                </div>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-1/4 animate-pulse" />
                    <div className="h-10 bg-slate-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
          {success && (
            <div className="mb-6 p-4 text-sm bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 text-sm bg-rose-100 border border-rose-300 text-rose-800 rounded-lg">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10"
          >
            {/* Left Column */}
            <div className="flex flex-col gap-4">
              <h3 className="mb-1" style={{ color: "var(--cinefil-navy)", fontFamily: "var(--font-heading)" }}>
                Premises Information
              </h3>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cinefil-navy)" }}>
                  NAME OF THE PREMISES *
                </label>
                {field("nameOfPremises", "Enter the name of your premises", "text", false, true)}
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cinefil-navy)" }}>
                  TOTAL SQ. FT. AREA OF THE PREMISES *
                </label>
                {field("totalArea", "Enter total square foot area*", "number", false, true)}
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cinefil-navy)" }}>
                  TOTAL NUMBER OF SITTINGS (OF RESTAURANT/BAR/OTHERS) *
                </label>
                {field("totalSittings", "Enter total seating capacity*", "number", false, true)}
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cinefil-navy)" }}>
                  CONTACT PERSON *
                </label>
                {field("contactPerson", "Enter contact person name", "text", false, true)}
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cinefil-navy)" }}>
                  TELEPHONE NO. / MOBILE NO. *
                </label>
                {field("telephone", "Enter phone or mobile number*", "tel", false, true)}
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cinefil-navy)" }}>
                  EMAIL ID *
                </label>
                {field("email", "Enter email address*", "email", false, true)}
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cinefil-navy)" }}>
                  GST NUMBER *
                </label>
                {field("gst", "Enter 15-digit GST number*", "text", false, true)}
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cinefil-navy)" }}>
                  TAN NUMBER *
                </label>
                {field("tan", "Enter 10-digit TAN number*", "text", false, true)}
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cinefil-navy)" }}>
                  PAN NUMBER *
                </label>
                {field("pan", "Enter 10-digit PAN number*", "text", false, true)}
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cinefil-navy)" }}>
                  LICENCE PERIOD *
                </label>
                {field("licencePeriod", "e.g. 1 year, 3 years", "text", false, true)}
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4">
              <div
                className="p-4 rounded-lg text-xs leading-relaxed mb-2"
                style={{ backgroundColor: "var(--cinefil-light-bg)", color: "var(--cinefil-muted)" }}
              >
                <p className="font-semibold mb-1" style={{ color: "var(--cinefil-navy)" }}>TYPE A CITIES</p>
                <p className="mb-2">{typeACities}</p>
                <Dialog open={isTariffModalOpen} onOpenChange={setIsTariffModalOpen}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      disabled={!activeTariffDocument}
                      className="text-xs font-semibold px-3 py-1.5 rounded transition-all hover:opacity-80 disabled:opacity-50"
                      style={{ backgroundColor: "var(--cinefil-navy)", color: "white" }}
                    >
                      View tariff rates card
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Tariff Rate Card</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                      {activeTariffDocument && <img src={activeTariffDocument.file} alt="Tariff Rate Card" className="w-full h-auto" />}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cinefil-navy)" }}>
                  TYPE OF THE PREMISES *
                </label>
                <select
                  required
                  value={form.typeOfPremises}
                  onChange={(e) => setForm({ ...form, typeOfPremises: e.target.value })}
                  className="w-full px-3 py-2.5 border rounded text-sm focus:outline-none bg-white"
                  style={{ borderColor: "rgba(0,0,0,0.15)", color: form.typeOfPremises ? "var(--cinefil-navy)" : "#9ca3af" }}
                >
                  <option value="" disabled>Select premises type*</option>
                  {industries.length > 0 ? (
                    industries.map(ind => (
                      <option key={ind.id} value={ind.industry_name}>{ind.industry_name}</option>
                    ))
                  ) : (
                    <>
                      <option>Hotel</option>
                      <option>Restaurant / Bar</option>
                      <option>Hospital</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cinefil-navy)" }}>
                  TYPE B CITIES (not mentioned in Type A)
                </label>
                <p className="text-xs mb-2" style={{ color: "var(--cinefil-muted)" }}>{typeBCities}</p>
              </div>

              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cinefil-navy)" }}>
                  CATEGORY VALUES *
                </label>
                {categoryLevels.map((categories, level) => (
                  <select
                    key={level}
                    required
                    value={selectedCategories[level]?.id || ""}
                    onChange={(e) => handleCategoryChange(level, e.target.value)}
                    className="w-full px-3 py-2.5 border rounded text-sm focus:outline-none bg-white mb-2"
                    style={{ borderColor: "rgba(0,0,0,0.15)", color: selectedCategories[level] ? "var(--cinefil-navy)" : "#9ca3af" }}
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                    ))}
                  </select>
                ))}
              </div>

              {tariffRates.length > 0 && (
                <div className="p-4 rounded-lg border" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                  <h4 className="font-bold text-sm mb-2" style={{ color: "var(--cinefil-navy)" }}>
                    Applicable Tariff Rates
                  </h4>
                  <div className="space-y-2">
                    {tariffRates.map(rate => (
                      <div key={rate.id} className="text-xs p-2 rounded" style={{ backgroundColor: "var(--cinefil-light-bg)" }}>
                        <p>
                          <span className="font-semibold">City Type:</span> {rate.city_type}
                        </p>
                        <p>
                          <span className="font-semibold">Rate:</span> {rate.tariff_amount}
                        </p>
                        {rate.min_fee && (
                          <p>
                            <span className="font-semibold">Minimum Fee:</span> ₹{rate.min_fee}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cinefil-navy)" }}>
                  TOTAL ROOMS (IF HOTEL/HOSTEL/HOSPITAL/OTHERS) *
                </label>
                {field("totalRooms", "Enter total number of rooms*", "number")}
              </div>

              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cinefil-navy)" }}>
                  NUMBER OF TV SETS
                </label>
                {field("tvSets", "Number of TV sets", "number")}
              </div>

              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cinefil-navy)" }}>
                  IF ANY OTHER MEANS OF DISPLAY, SPECIFY
                </label>
                {field("otherDisplay", "e.g. Projector, LED display")}
              </div>

              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--cinefil-navy)" }}>
                  FULL ADDRESS *
                </label>
                <textarea
                  required
                  placeholder="Enter complete address with city and pincode"
                  value={form.fullAddress}
                  onChange={(e) => setForm({ ...form, fullAddress: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 border rounded text-sm focus:outline-none resize-none"
                  style={{ borderColor: "rgba(0,0,0,0.15)" }}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="lg:col-span-2 flex justify-center pt-4 border-t" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-12 py-3 rounded font-bold text-sm tracking-wide transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "var(--cinefil-gold)", color: "var(--cinefil-navy)" }}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}