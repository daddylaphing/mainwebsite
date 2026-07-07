"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ChevronDown, ChevronUp, Shield } from "lucide-react";

type ConsentState = {
  necessary: true; // always true, read-only
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
};

const COOKIE_KEY = "laphing_cookie_consent";
const COOKIE_VERSION = "v1";

const CATEGORIES = [
  {
    id: "necessary" as const,
    label: "Necessary",
    description:
      "Essential cookies required for the site to function. Cannot be disabled. Includes authentication, cart, and security cookies.",
    required: true,
  },
  {
    id: "analytics" as const,
    label: "Analytics",
    description:
      "Help us understand how visitors use the site. Includes page view tracking and performance monitoring. All data is anonymised.",
    required: false,
  },
  {
    id: "functional" as const,
    label: "Functional",
    description:
      "Enable enhanced features like remembering your preferences, language, and recent searches.",
    required: false,
  },
  {
    id: "marketing" as const,
    label: "Marketing",
    description:
      "Used to show relevant ads and measure their effectiveness. Shared with trusted advertising partners.",
    required: false,
  },
];

function loadConsent(): (ConsentState & { version: string }) | null {
  try {
    const raw = localStorage.getItem(COOKIE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== COOKIE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveConsent(consent: ConsentState) {
  const data = { ...consent, version: COOKIE_VERSION, timestamp: new Date().toISOString() };
  localStorage.setItem(COOKIE_KEY, JSON.stringify(data));
  // Also set a cookie so server can read consent status
  document.cookie = `${COOKIE_KEY}=${JSON.stringify({ analytics: consent.analytics, functional: consent.functional, marketing: consent.marketing })}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    functional: false,
    marketing: false,
  });

  useEffect(() => {
    const existing = loadConsent();
    if (!existing) {
      // Delay banner slightly for UX
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
    // Apply stored consent
    setConsent(existing);
  }, []);

  function acceptAll() {
    const full: ConsentState = { necessary: true, analytics: true, functional: true, marketing: true };
    setConsent(full);
    saveConsent(full);
    setVisible(false);
  }

  function rejectNonEssential() {
    const minimal: ConsentState = { necessary: true, analytics: false, functional: false, marketing: false };
    setConsent(minimal);
    saveConsent(minimal);
    setVisible(false);
  }

  function savePreferences() {
    saveConsent(consent);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-[100] bg-[#141414] border border-white/[0.08] rounded-2xl shadow-[0_-10px_60px_rgba(0,0,0,0.7)] overflow-hidden"
        role="dialog"
        aria-label="Cookie consent"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start gap-4 p-5 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-[#E7B52C]/10 flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="h-5 w-5 text-[#E7B52C]" />
          </div>
          <div className="flex-1 min-w-0">
            <h2
              className="text-white font-bold text-base mb-1"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              We use cookies
            </h2>
            <p
              className="text-[#C7BFB3] text-sm leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              We use cookies to personalise your experience, analyse site traffic, and improve our
              service. You can manage your preferences below.{" "}
              <a href="/privacy" className="text-[#E7B52C] hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
          <button
            onClick={rejectNonEssential}
            className="text-white/30 hover:text-white transition-colors shrink-0 mt-0.5"
            aria-label="Dismiss (reject non-essential)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Preferences panel */}
        <AnimatePresence>
          {showPreferences && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-b border-white/5"
            >
              <div className="p-4 flex flex-col gap-2">
                {CATEGORIES.map((cat) => (
                  <div key={cat.id} className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
                    <div
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                      onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                    >
                      {/* Toggle */}
                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <p
                          className="text-sm font-semibold text-white"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {cat.label}
                        </p>
                        {cat.required && (
                          <span className="text-[10px] bg-white/5 text-white/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-medium">
                            Always on
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Toggle switch */}
                        <button
                          role="switch"
                          aria-checked={cat.required ? true : consent[cat.id]}
                          aria-label={`${cat.label} cookies`}
                          disabled={cat.required}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!cat.required) {
                              setConsent((prev) => ({ ...prev, [cat.id]: !prev[cat.id] }));
                            }
                          }}
                          className={`relative w-10 h-5 rounded-full transition-colors ${
                            cat.required || consent[cat.id] ? "bg-[#E7B52C]" : "bg-white/10"
                          } ${cat.required ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                              cat.required || consent[cat.id] ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                        {expandedCategory === cat.id ? (
                          <ChevronUp className="h-3.5 w-3.5 text-white/30" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-white/30" />
                        )}
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedCategory === cat.id && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <p
                            className="px-4 pb-3 text-xs text-white/40 leading-relaxed"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {cat.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 p-4 justify-end">
          <button
            onClick={() => setShowPreferences((v) => !v)}
            className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm font-medium transition-colors mr-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <Shield className="h-3.5 w-3.5" />
            {showPreferences ? "Hide Preferences" : "Manage Preferences"}
          </button>

          {showPreferences && (
            <button
              onClick={savePreferences}
              className="px-4 py-2 bg-white/5 border border-white/10 text-white/70 hover:text-white text-sm font-semibold rounded-lg transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Save Preferences
            </button>
          )}

          <button
            onClick={rejectNonEssential}
            className="px-4 py-2 bg-white/5 border border-white/10 text-white/70 hover:text-white text-sm font-semibold rounded-lg transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Reject All
          </button>

          <button
            onClick={acceptAll}
            className="px-4 py-2 bg-[#E7B52C] text-black text-sm font-semibold rounded-[14px] hover:bg-[#F4C542] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif", boxShadow: "0 8px 15px rgba(231,181,44,0.15)" }}
          >
            Accept All
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/** Hook to read consent in other components */
export function useCookieConsent(): ConsentState {
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    functional: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = loadConsent();
    if (stored) setConsent(stored);
  }, []);

  return consent;
}
