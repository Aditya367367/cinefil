import { useState, useEffect } from 'react';
import { Shield, Cookie, Settings, Check, X } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cinefil_cookie_consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      try {
        const parsed = JSON.parse(consent);
        setPreferences(parsed);
        // If not accepted, we clear/don't store cookies
        applyPreferences(parsed);
      } catch (e) {
        setShowBanner(true);
      }
    }
  }, []);

  const applyPreferences = (prefs: CookiePreferences) => {
    // Write cookie preferences to document.cookie in addition to localStorage so backend receives it in Request Headers
    document.cookie = `cinefil_cookie_consent=${encodeURIComponent(JSON.stringify(prefs))}; path=/; max-age=31536000; SameSite=Lax;`;
    if (!prefs.analytics) {
      // Clear optional Google analytics or tracking if present
      (window as any)._gaUserPrefs = { ioo: true };
    }
    if (!prefs.marketing) {
      // Clear marketing cookies if present
    }
  };

  const handleAcceptAll = () => {
    const allPrefs = { essential: true, analytics: true, marketing: true };
    localStorage.setItem('cinefil_cookie_consent', JSON.stringify(allPrefs));
    setPreferences(allPrefs);
    applyPreferences(allPrefs);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cinefil_cookie_consent', JSON.stringify(preferences));
    applyPreferences(preferences);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleRejectAll = () => {
    const minPrefs = { essential: true, analytics: false, marketing: false };
    localStorage.setItem('cinefil_cookie_consent', JSON.stringify(minPrefs));
    setPreferences(minPrefs);
    applyPreferences(minPrefs);
    setShowBanner(false);
    setShowPreferences(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] animate-slide-up border-t border-slate-200/10 bg-white text-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] py-4 px-6 md:px-8">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Main Banner Message */}
        <div className="flex items-center gap-3.5 flex-1">
          <div className="rounded-full bg-[#6366f1]/10 p-2 text-[#6366f1] shrink-0">
            <Cookie size={22} className="animate-pulse" />
          </div>
          <p className="text-xs md:text-sm font-medium text-slate-600 leading-relaxed max-w-3xl">
            We use cookies to improve your experience on our website. By browsing this website, you agree to our use of cookies.
          </p>
        </div>

        {/* Buttons Panel */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors rounded-lg"
          >
            <Settings size={14} />
            <span>Customize</span>
          </button>
          
          <button
            onClick={handleRejectAll}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors rounded-lg"
          >
            Reject Optional
          </button>

          <button
            onClick={handleAcceptAll}
            className="px-5 py-2 text-xs font-bold text-white bg-[#6366f1] hover:bg-[#4f46e5] shadow-sm hover:shadow transition-all rounded-lg"
          >
            Accept Cookies
          </button>
        </div>
      </div>

      {/* Preferences Customizer Modal Panel */}
      {showPreferences && (
        <div className="mt-4 border-t border-slate-100 pt-4 mx-auto max-w-7xl animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            
            {/* Essential Card */}
            <div className="p-3.5 border border-slate-100 bg-slate-50 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Shield size={16} className="text-emerald-500" />
                  <span className="text-xs font-bold text-slate-800">Essential Cookies</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Required for core platform features, user login, secure authentication, and active session persistence.
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Strictly Required</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Always Active</span>
              </div>
            </div>

            {/* Analytics Card */}
            <div className="p-3.5 border border-slate-100 hover:border-slate-200 rounded-lg flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Cookie size={16} className="text-blue-500" />
                  <span className="text-xs font-bold text-slate-800">Analytics & Performance</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Helps us analyze web traffic, optimize site load speeds, and monitor performance analytics anonymised.
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Consent Toggle</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>

            {/* Marketing Card */}
            <div className="p-3.5 border border-slate-100 hover:border-slate-200 rounded-lg flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Cookie size={16} className="text-amber-500" />
                  <span className="text-xs font-bold text-slate-800">Marketing & Targeting</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Enables external social links, embeds (YouTube, Vimeo), maps, and targeted content integrations.
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Consent Toggle</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              onClick={() => setShowPreferences(false)}
              className="px-4 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePreferences}
              className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs hover:shadow transition-all"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
