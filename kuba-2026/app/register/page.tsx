"use client";

import Link from "next/link";
import { useTheme } from "@/lib/useTheme";

const FREE_AGENT_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScWZEYhSkloEJRQABI6IYVyGGk5B4yGi-86EkIj0U3kjlMnbQ/viewform?usp=header";

export default function RegisterPage() {
  const { isDark, toggle } = useTheme();

  const freeAgent = { id: "freeagent", label: "Free Agent", formUrl: FREE_AGENT_FORM_URL, color: "#6366f1" };

  const t = {
    bg:          isDark ? "linear-gradient(155deg,#060d1f 0%,#0a1628 40%,#030810 100%)"
                        : "linear-gradient(155deg,#f8fafc 0%,#eff6ff 60%,#f1f5f9 100%)",
    text:        isDark ? "#fff"     : "#0f172a",
    textMuted:   isDark ? "rgba(255,255,255,0.5)"  : "#64748b",
    textFaint:   isDark ? "rgba(255,255,255,0.25)" : "#94a3b8",
    pillBorder:  isDark ? "rgba(251,191,36,0.35)"  : "rgba(29,78,216,0.3)",
    pillColor:   isDark ? "#fcd34d" : "#1d4ed8",
    orb1:        isDark ? "rgba(37,99,235,0.22)"   : "rgba(37,99,235,0.08)",
    orb2:        isDark ? "rgba(251,191,36,0.12)"  : "rgba(251,191,36,0.06)",
    noteBg:      isDark ? "rgba(99,102,241,0.1)"   : "rgba(99,102,241,0.07)",
    noteBorder:  isDark ? "rgba(99,102,241,0.3)"   : "rgba(99,102,241,0.25)",
    noteText:    isDark ? "rgba(165,180,252,0.9)"  : "#4338ca",
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'Georgia','Times New Roman',serif", position: "relative", overflow: "hidden", transition: "background 0.3s" }}>
      {/* Orbs */}
      <div style={{ position: "fixed", top: -180, right: -180, width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle,${t.orb1} 0%,transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -220, left: -200, width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle,${t.orb2} 0%,transparent 70%)`, pointerEvents: "none" }} />

      {/* Header */}
      <header style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "52px 24px 0" }}>
        {/* Nav row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 700, margin: "0 auto 28px" }}>
          <Link href="/" style={{ padding: "6px 18px", borderRadius: 20, border: `1px solid ${t.pillBorder}`, color: t.pillColor, fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none" }}>
            ← Back
          </Link>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${t.pillBorder}`, color: t.pillColor, background: "transparent", fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>

        <h1 style={{ color: t.text, fontSize: "clamp(26px,5vw,36px)", fontWeight: 400, margin: "0 0 10px", letterSpacing: "-0.02em", lineHeight: 1.2, transition: "color 0.3s" }}>
          Free Agent Registration
        </h1>

        {/* Team reg closed notice */}
        <div style={{ maxWidth: 460, margin: "20px auto 0", padding: "10px 16px", borderRadius: 12, background: isDark ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.35)" }}>
          <p style={{ margin: 0, fontSize: 12, color: isDark ? "rgba(252,165,165,0.9)" : "#b91c1c", lineHeight: 1.6, fontWeight: 600, textAlign: "center" }}>
            Team registration has closed. Free agent sign-up is still open.
          </p>
        </div>

        {/* Description */}
        <p style={{ marginTop: 14, color: t.textMuted, fontSize: 13, maxWidth: 460, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6, transition: "color 0.3s" }}>
          Don&apos;t have a team or prefer to play solo? Sign up as a free agent and we&apos;ll try to place you with others to compete.
        </p>

        {/* Free agent disclaimer */}
        <div style={{ maxWidth: 460, margin: "10px auto 0", padding: "12px 16px", borderRadius: 12, background: t.noteBg, border: `1px solid ${t.noteBorder}` }}>
          <p style={{ margin: 0, fontSize: 12, color: t.noteText, lineHeight: 1.6 }}>
            <strong>Please note:</strong> Signing up as a free agent does not guarantee placement on a team. It is entirely at the discretion of team captains to select free agents — there is a chance you may not get picked up.
          </p>
        </div>
      </header>

      {/* Google Form iframe */}
      <main style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "36px auto 0", padding: "0 20px 80px" }}>
        <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.15)", border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0" }}>
          <div style={{ height: 4, background: `linear-gradient(90deg,${freeAgent.color},${freeAgent.color}dd)` }} />
          <iframe
            src={freeAgent.formUrl}
            width="100%"
            height="900"
            frameBorder="0"
            scrolling="yes"
            style={{ display: "block", background: "#fff" }}
            title="KUBA 2026 Free Agent Registration"
          />
        </div>

        <p style={{ textAlign: "center", color: t.textFaint, fontSize: 12, marginTop: 24, lineHeight: 1.6, transition: "color 0.3s" }}>
          Questions? Email{" "}
          <a href="mailto:memphiskuba@gmail.com" style={{ color: isDark ? "#fcd34d" : "#2563eb", textDecoration: "none", fontWeight: 600 }}>
            memphiskuba@gmail.com
          </a>
        </p>
      </main>
    </div>
  );
}
