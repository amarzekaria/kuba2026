"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/useTheme";

const VENDOR_DAYS = [
  { key: "mon", label: "Monday",    date: "June 29" },
  { key: "tue", label: "Tuesday",   date: "June 30" },
  { key: "wed", label: "Wednesday", date: "July 1"  },
  { key: "sat", label: "Saturday",  date: "July 4"  },
  { key: "sun", label: "Sunday",    date: "July 5"  },
] as const;

const DAY_COST = 50;
type DayKey = typeof VENDOR_DAYS[number]["key"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[\d\s\-()+]{7,20}$/;

export default function VendorRegisterPage() {
  const { isDark, toggle } = useTheme();

  const [orgName, setOrgName]           = useState("");
  const [contactName, setContactName]   = useState("");
  const [phone, setPhone]               = useState("");
  const [email, setEmail]               = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [product, setProduct]           = useState("");
  const [selectedDays, setSelectedDays] = useState<DayKey[]>([]);
  const [isNonSelling, setIsNonSelling] = useState(false);
  const [activity, setActivity]         = useState("");
  const [notes, setNotes]               = useState("");
  const [status, setStatus]             = useState<"idle"|"loading"|"success"|"error">("idle");
  const [errorMsg, setErrorMsg]         = useState("");
  const [totalCost, setTotalCost]       = useState(0);
  const errorRef = useRef<HTMLDivElement>(null);

  const toggleDay = (key: DayKey) =>
    setSelectedDays(prev => prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key]);

  const handleNonSelling = (checked: boolean) => {
    setIsNonSelling(checked);
  };

  const computedTotal = isNonSelling ? 0 : selectedDays.length * DAY_COST;

  const hasLetter = (s: string) => /[a-zA-Z]/.test(s);

  const validate = (): string | null => {
    if (orgName.trim().length < 3 || !hasLetter(orgName))
      return "Organization name must be at least 3 characters and contain letters.";
    if (contactName.trim().length < 3 || !hasLetter(contactName))
      return "Contact name must be at least 3 characters and contain letters.";
    if (!PHONE_RE.test(phone)) return "Enter a valid phone number.";
    if (!EMAIL_RE.test(email)) return "Enter a valid email address.";
    if (email !== confirmEmail) return "Email addresses do not match.";
    if (!isNonSelling && (product.trim().length < 3 || !hasLetter(product)))
      return "Product description must be at least 3 characters and contain letters.";
    if (selectedDays.length === 0) return "Select at least one day you plan to attend.";
    if (isNonSelling) {
      const wordCount = activity.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount < 5)   return "Please describe what you plan on doing (minimum 5 words).";
      if (wordCount > 100) return "Description is too long (maximum 100 words).";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      setStatus("error");
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/vendor-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization_name: orgName, contact_name: contactName,
          phone_number: phone, email, product_being_sold: product,
          days: selectedDays, is_non_selling: isNonSelling,
          activity, notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong.");
        setStatus("error");
        setTimeout(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      }
      else { setTotalCost(data.total_cost); setStatus("success"); }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  /* ── Theme tokens ── */
  const t = {
    bg:          isDark ? "linear-gradient(155deg,#060d1f 0%,#0a1628 40%,#030810 100%)"
                        : "linear-gradient(155deg,#f8fafc 0%,#eff6ff 60%,#f1f5f9 100%)",
    text:        isDark ? "#fff"    : "#0f172a",
    textMuted:   isDark ? "rgba(255,255,255,0.5)"  : "#64748b",
    textFaint:   isDark ? "rgba(255,255,255,0.25)" : "#94a3b8",
    pillBorder:  isDark ? "rgba(251,191,36,0.35)"  : "rgba(29,78,216,0.3)",
    pillColor:   isDark ? "#fcd34d" : "#1d4ed8",
    card:        isDark ? "rgba(255,255,255,0.04)"  : "rgba(255,255,255,0.95)",
    cardBorder:  isDark ? "rgba(255,255,255,0.09)"  : "#e2e8f0",
    divider:     isDark ? "rgba(255,255,255,0.07)"  : "#f1f5f9",
    sectionLabel:isDark ? "rgba(255,255,255,0.35)"  : "#94a3b8",
    inputBg:     isDark ? "rgba(255,255,255,0.06)"  : "#f8fafc",
    inputBorder: isDark ? "rgba(255,255,255,0.15)"  : "#e2e8f0",
    inputText:   isDark ? "#fff"   : "#0f172a",
    dayBorder:   isDark ? "rgba(255,255,255,0.08)"  : "#e2e8f0",
    dayBg:       isDark ? "rgba(255,255,255,0.03)"  : "#f8fafc",
    dayText:     isDark ? "#fff"   : "#0f172a",
    dayDate:     isDark ? "rgba(255,255,255,0.4)"   : "#64748b",
    dayPrice:    isDark ? "rgba(255,255,255,0.25)"  : "#94a3b8",
    nonSellText: isDark ? "rgba(255,255,255,0.7)"   : "#475569",
    totalBg:     isDark ? "rgba(255,255,255,0.04)"  : "#f8fafc",
    totalBorder: isDark ? "rgba(255,255,255,0.07)"  : "#e2e8f0",
    totalBgActive:    isDark ? "rgba(251,191,36,0.08)"  : "rgba(251,191,36,0.06)",
    totalBorderActive:isDark ? "rgba(251,191,36,0.25)"  : "rgba(251,191,36,0.35)",
    totalMuted:  isDark ? "rgba(255,255,255,0.5)"   : "#64748b",
    totalFaint:  isDark ? "rgba(255,255,255,0.35)"  : "#94a3b8",
    errBg:       isDark ? "rgba(239,68,68,0.1)"     : "rgba(239,68,68,0.06)",
    errBorder:   isDark ? "rgba(239,68,68,0.3)"     : "rgba(239,68,68,0.25)",
    errText:     isDark ? "#fca5a5" : "#dc2626",
    footerText:  isDark ? "rgba(255,255,255,0.25)"  : "#94a3b8",
    successCard: isDark ? "rgba(255,255,255,0.05)"  : "rgba(255,255,255,0.95)",
    successBorder:isDark? "rgba(255,255,255,0.1)"   : "#e2e8f0",
    successText: isDark ? "#fff"   : "#0f172a",
    successMuted:isDark ? "rgba(255,255,255,0.65)"  : "#475569",
    successPay:  isDark ? "#fcd34d": "#b45309",
    successPayBg:    isDark ? "rgba(251,191,36,0.12)"  : "rgba(251,191,36,0.08)",
    successPayBorder:isDark ? "rgba(251,191,36,0.3)"   : "rgba(251,191,36,0.3)",
    successPayMuted: isDark ? "rgba(255,255,255,0.45)" : "#78716c",
    successFreeBg:    isDark ? "rgba(34,197,94,0.1)"   : "rgba(34,197,94,0.07)",
    successFreeBorder:isDark ? "rgba(34,197,94,0.25)"  : "rgba(34,197,94,0.3)",
    successFreeText:  isDark ? "#86efac" : "#15803d",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: `1px solid ${t.inputBorder}`, background: t.inputBg,
    color: t.inputText, fontSize: 14, fontFamily: "inherit",
    outline: "none", boxSizing: "border-box", transition: "background 0.3s, color 0.3s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 700,
    letterSpacing: "0.1em", textTransform: "uppercase",
    color: t.textMuted, marginBottom: 6, transition: "color 0.3s",
  };

  if (status === "success") {
    return (
      <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, transition: "background 0.3s" }}>
        <div style={{ maxWidth: 480, width: "100%", background: t.successCard, border: `1px solid ${t.successBorder}`, borderRadius: 20, padding: "40px 32px", textAlign: "center", fontFamily: "Georgia, serif", boxShadow: isDark ? "none" : "0 8px 32px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h2 style={{ color: t.successText, fontSize: 24, fontWeight: 400, marginBottom: 12 }}>Registration Received!</h2>
          <p style={{ color: t.successMuted, fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            Thank you for registering as a vendor at KUBA 2026. Your information has been forwarded to the organizing team.
          </p>
          <div style={{ background: isDark ? "rgba(37,99,235,0.1)" : "rgba(37,99,235,0.06)", border: `1px solid ${isDark ? "rgba(37,99,235,0.3)" : "rgba(37,99,235,0.2)"}`, borderRadius: 12, padding: "12px 18px", marginBottom: 20 }}>
            <p style={{ color: isDark ? "#93c5fd" : "#1d4ed8", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
              📧 A confirmation email has been sent to your inbox. Please check your email — including your spam folder.
            </p>
          </div>
          {totalCost > 0 && (
            <div style={{ background: t.successPayBg, border: `1px solid ${t.successPayBorder}`, borderRadius: 12, padding: "14px 20px", marginBottom: 20 }}>
              <p style={{ color: t.successPay, fontWeight: 700, fontSize: 16, margin: 0 }}>Amount due at event: ${totalCost}</p>
              <p style={{ color: t.successPayMuted, fontSize: 12, margin: "4px 0 0" }}>Payment collected on-site — no payment required now.</p>
            </div>
          )}
          {totalCost === 0 && (
            <div style={{ background: t.successFreeBg, border: `1px solid ${t.successFreeBorder}`, borderRadius: 12, padding: "14px 20px", marginBottom: 20 }}>
              <p style={{ color: t.successFreeText, fontWeight: 700, fontSize: 15, margin: 0 }}>No charge — non-selling vendor</p>
            </div>
          )}
          <Link href="/" style={{ display: "inline-block", padding: "10px 24px", borderRadius: 20, background: "rgba(37,99,235,0.85)", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "Georgia,'Times New Roman',serif", position: "relative", overflow: "hidden", transition: "background 0.3s" }}>
      {/* Orbs */}
      <div style={{ position: "fixed", top: -180, right: -180, width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle,${isDark ? "rgba(37,99,235,0.22)" : "rgba(37,99,235,0.08)"} 0%,transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -220, left: -200, width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle,${isDark ? "rgba(251,191,36,0.12)" : "rgba(251,191,36,0.06)"} 0%,transparent 70%)`, pointerEvents: "none" }} />

      {/* Header */}
      <header style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "52px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 640, margin: "0 auto 28px" }}>
          <Link href="/" style={{ padding: "6px 18px", borderRadius: 20, border: `1px solid ${t.pillBorder}`, color: t.pillColor, fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none" }}>
            ← Back
          </Link>
          <button onClick={toggle} aria-label="Toggle theme"
            style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${t.pillBorder}`, color: t.pillColor, background: "transparent", fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}>
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>

        <h1 style={{ color: t.text, fontSize: "clamp(24px,5vw,34px)", fontWeight: 400, margin: "0 0 8px", letterSpacing: "-0.02em", transition: "color 0.3s" }}>
          Vendor Registration
        </h1>
        <p style={{ color: t.textMuted, fontSize: 13, maxWidth: 440, margin: "0 auto", lineHeight: 1.6 }}>
          KUBA 2026 · Memphis · June 29 – July 5<br />
          $50 per vendor day · Payment collected at the event
        </p>
      </header>

      {/* Form */}
      <main style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "36px auto 0", padding: "0 20px 80px" }}>
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 20, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 20, boxShadow: isDark ? "none" : "0 8px 32px rgba(0,0,0,0.06)", transition: "background 0.3s" }}>

            {/* Contact info */}
            <div style={{ borderBottom: `1px solid ${t.divider}`, paddingBottom: 20 }}>
              <p style={{ color: t.sectionLabel, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 16px" }}>Contact Info</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Organization / Business Name *</label>
                  <input required maxLength={120} autoComplete="organization" value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="e.g. Harari Kitchen" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Contact Name *</label>
                  <input required maxLength={100} autoComplete="name" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Full name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number *</label>
                  <input required maxLength={20} type="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(901) 555-0123" style={inputStyle} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Email Address *</label>
                  <input required maxLength={254} type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Confirm Email Address *</label>
                  <input required maxLength={254} type="email" autoComplete="off" value={confirmEmail}
                    onChange={e => setConfirmEmail(e.target.value)}
                    onPaste={e => e.preventDefault()}
                    placeholder="Re-enter your email" style={{
                    ...inputStyle,
                    borderColor: confirmEmail && confirmEmail !== email ? "#ef4444" : confirmEmail && confirmEmail === email ? "#22c55e" : t.inputBorder,
                  }} />
                  {confirmEmail && confirmEmail !== email && (
                    <p style={{ color: "#ef4444", fontSize: 11, margin: "4px 0 0" }}>Emails do not match</p>
                  )}
                  {confirmEmail && confirmEmail === email && (
                    <p style={{ color: isDark ? "#86efac" : "#15803d", fontSize: 11, margin: "4px 0 0" }}>✓ Emails match</p>
                  )}
                </div>
              </div>
            </div>

            {/* Product */}
            <div style={{ borderBottom: `1px solid ${t.divider}`, paddingBottom: 20 }}>
              <p style={{ color: t.sectionLabel, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 16px" }}>What You&apos;re Selling</p>
              <label style={labelStyle}>Product / Service Being Sold</label>
              <input value={product} onChange={e => setProduct(e.target.value)}
                placeholder="e.g. Harari food, handmade jewelry, clothing…"
                disabled={isNonSelling} maxLength={200} autoComplete="off"
                style={{ ...inputStyle, opacity: isNonSelling ? 0.35 : 1 }} />
              <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, cursor: "pointer" }}>
                <input type="checkbox" checked={isNonSelling} onChange={e => handleNonSelling(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: "#22c55e", cursor: "pointer" }} />
                <span style={{ color: t.nonSellText, fontSize: 13 }}>
                  Non-selling vendor — we&apos;re not selling anything
                  <span style={{ marginLeft: 8, color: isDark ? "#86efac" : "#15803d", fontWeight: 700, fontSize: 12 }}>No charge</span>
                </span>
              </label>

              {isNonSelling && (
                <div style={{ marginTop: 14 }}>
                  <label style={labelStyle}>What do you plan on doing? *</label>
                  <input
                    value={activity}
                    onChange={e => setActivity(e.target.value)}
                    placeholder="e.g. Community outreach, cultural display, volunteering…"
                    maxLength={800}
                    autoComplete="off"
                    style={inputStyle}
                  />
                  {(() => {
                    const wc = activity.trim() ? activity.trim().split(/\s+/).filter(Boolean).length : 0;
                    const tooShort = activity.trim() && wc < 5;
                    const tooLong  = wc > 100;
                    const ok       = wc >= 5 && wc <= 100;
                    return (
                      <p style={{ fontSize: 11, margin: "4px 0 0", color: tooLong ? "#ef4444" : ok ? (isDark ? "#86efac" : "#15803d") : t.textFaint }}>
                        {tooShort ? `${wc} / 5 words minimum` : tooLong ? `${wc} / 100 words maximum` : ok ? `✓ ${wc} words` : "5 – 100 words required"}
                      </p>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Day selection */}
            <div style={{ borderBottom: `1px solid ${t.divider}`, paddingBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
                <p style={{ color: t.sectionLabel, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", margin: 0 }}>Days Attending *</p>
                {!isNonSelling && <span style={{ color: t.textFaint, fontSize: 12 }}>$50 per day · paid at event</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {VENDOR_DAYS.map(({ key, label, date }) => {
                  const checked = selectedDays.includes(key);
                  return (
                    <label key={key} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12,
                      border: checked ? "1px solid rgba(37,99,235,0.6)" : `1px solid ${t.dayBorder}`,
                      background: checked ? "rgba(37,99,235,0.15)" : t.dayBg,
                      cursor: "pointer", transition: "all 0.15s ease",
                    }}>
                      <input type="checkbox" checked={checked} onChange={() => toggleDay(key)}
                        style={{ width: 16, height: 16, accentColor: "#2563eb", cursor: "pointer" }} />
                      <div style={{ flex: 1 }}>
                        <span style={{ color: t.dayText, fontWeight: 700, fontSize: 14 }}>{label}</span>
                        <span style={{ color: t.dayDate, fontSize: 13, marginLeft: 8 }}>{date}</span>
                      </div>
                      {!isNonSelling && (
                        <span style={{ color: checked ? "#93c5fd" : t.dayPrice, fontWeight: 700, fontSize: 13 }}>$50</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Running total */}
            <div style={{
              background: computedTotal > 0 ? t.totalBgActive : t.totalBg,
              border: `1px solid ${computedTotal > 0 ? t.totalBorderActive : t.totalBorder}`,
              borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <p style={{ color: t.totalMuted, fontSize: 12, margin: 0 }}>Estimated total due at event</p>
                {!isNonSelling && selectedDays.length > 0 && (
                  <p style={{ color: t.totalFaint, fontSize: 11, margin: "2px 0 0" }}>
                    {selectedDays.length} day{selectedDays.length > 1 ? "s" : ""} × $50
                  </p>
                )}
              </div>
              <p style={{ color: computedTotal > 0 ? "#fcd34d" : t.textFaint, fontSize: 28, fontWeight: 700, margin: 0 }}>
                ${computedTotal}
              </p>
            </div>

            {/* Notes */}
            <div>
              <label style={labelStyle}>Additional Notes (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Anything else the organizers should know…"
                rows={3} maxLength={500}
                style={{ ...inputStyle, resize: "vertical" }} />
            </div>

            {/* Error */}
            {status === "error" && (
              <div ref={errorRef} style={{ background: t.errBg, border: `1px solid ${t.errBorder}`, borderRadius: 10, padding: "12px 16px", color: t.errText, fontSize: 13 }}>
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={status === "loading"}
              style={{ padding: "14px 28px", borderRadius: 14, background: status === "loading" ? "rgba(37,99,235,0.4)" : "#2563eb", color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "inherit", border: "none", cursor: status === "loading" ? "not-allowed" : "pointer", transition: "background 0.2s" }}>
              {status === "loading" ? "Submitting…" : "Submit Vendor Registration"}
            </button>

            <p style={{ color: t.footerText, fontSize: 11, textAlign: "center", margin: 0, lineHeight: 1.6 }}>
              No payment is collected through this form. The total shown is due at the event.<br />
              Your info will be forwarded to the KUBA 2026 organizing team.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
