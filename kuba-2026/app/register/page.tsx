"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/useTheme";

const SOCCER_FORM_URL     = "https://docs.google.com/forms/d/e/1FAIpQLSd4VchSSA6ns-DmiZoHsU9wX69KvVBFV-OzLE2bOTVb1BmfmQ/viewform";
const BASKETBALL_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdWkHfROLrdutgYvz3dO4dzbUbuikEIOiBvHLQJLkhj-5vEYQ/viewform?usp=publish-editor";
const VOLLEYBALL_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeCh5C2-Pp7Wiwemr_yiL-zbAXJ4VyI5JmZFIVVMKPGGhelDg/viewform?usp=publish-editor";
const FREE_AGENT_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScWZEYhSkloEJRQABI6IYVyGGk5B4yGi-86EkIj0U3kjlMnbQ/viewform?usp=header";

type Sport = "soccer" | "basketball" | "volleyball" | "freeagent";

export default function RegisterPage() {
  const [selectedSport, setSelectedSport] = useState<Sport>("soccer");
  const { isDark, toggle } = useTheme();

  const sports: { id: Sport; label: string; formUrl: string; color: string }[] = [
    { id: "soccer",     label: "Soccer",     formUrl: SOCCER_FORM_URL,     color: "#2563eb" },
    { id: "basketball", label: "Basketball", formUrl: BASKETBALL_FORM_URL, color: "#f59e0b" },
    { id: "volleyball", label: "Volleyball", formUrl: VOLLEYBALL_FORM_URL, color: "#3b82f6" },
    { id: "freeagent",  label: "Free Agent", formUrl: FREE_AGENT_FORM_URL, color: "#6366f1" },
  ];

  const activeSport = sports.find(s => s.id === selectedSport)!;

  const t = {
    bg:          isDark ? "linear-gradient(155deg,#060d1f 0%,#0a1628 40%,#030810 100%)"
                        : "linear-gradient(155deg,#f8fafc 0%,#eff6ff 60%,#f1f5f9 100%)",
    text:        isDark ? "#fff"     : "#0f172a",
    textMuted:   isDark ? "rgba(255,255,255,0.5)"  : "#64748b",
    textFaint:   isDark ? "rgba(255,255,255,0.25)" : "#94a3b8",
    pillBorder:  isDark ? "rgba(251,191,36,0.35)"  : "rgba(29,78,216,0.3)",
    pillColor:   isDark ? "#fcd34d" : "#1d4ed8",
    sectionLabel:isDark ? "rgba(255,255,255,0.35)" : "#94a3b8",
    divider:     isDark ? "rgba(255,255,255,0.1)"  : "#e2e8f0",
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
          Sports Registration
        </h1>

        {/* Sport selector */}
        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>

          {/* Team registration */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: t.sectionLabel }}>
              Team Registration
            </span>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              {sports.filter(s => s.id !== "freeagent").map(sport => {
                const isActive = selectedSport === sport.id;
                return (
                  <button key={sport.id} onClick={() => setSelectedSport(sport.id)}
                    style={{
                      padding: "10px 20px", borderRadius: 20,
                      background: isActive ? activeSport.color : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
                      border: isActive ? `2px solid ${activeSport.color}` : isDark ? "2px solid rgba(255,255,255,0.2)" : "2px solid rgba(0,0,0,0.12)",
                      color: isActive ? "#fff" : t.textMuted,
                      fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease",
                      fontFamily: "inherit", letterSpacing: "0.02em",
                      boxShadow: isActive ? `0 4px 16px ${activeSport.color}66` : "none",
                    }}
                  >
                    {sport.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", maxWidth: 360 }}>
            <div style={{ flex: 1, height: 1, background: t.divider }} />
            <span style={{ fontSize: 10, color: t.textFaint, letterSpacing: "0.1em", textTransform: "uppercase" }}>or</span>
            <div style={{ flex: 1, height: 1, background: t.divider }} />
          </div>

          {/* Free Agent */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: isDark ? "rgba(99,102,241,0.8)" : "#6366f1" }}>
              No Team? Play as a Free Agent
            </span>
            {(() => {
              const sport = sports.find(s => s.id === "freeagent")!;
              const isActive = selectedSport === "freeagent";
              return (
                <button onClick={() => setSelectedSport("freeagent")}
                  style={{
                    padding: "10px 24px", borderRadius: 20,
                    background: isActive ? sport.color : isDark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.08)",
                    border: isActive ? `2px solid ${sport.color}` : "2px solid rgba(99,102,241,0.35)",
                    color: isActive ? "#fff" : isDark ? "rgba(129,140,248,0.9)" : "#4f46e5",
                    fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease",
                    fontFamily: "inherit", letterSpacing: "0.02em",
                    boxShadow: isActive ? `0 4px 16px ${sport.color}66` : "none",
                  }}
                >
                  Free Agent Sign-Up
                </button>
              );
            })()}
          </div>
        </div>

        {/* Description */}
        <p style={{ marginTop: 14, color: t.textMuted, fontSize: 13, maxWidth: 460, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6, minHeight: "2.6em", transition: "color 0.3s" }}>
          {selectedSport === "freeagent"
            ? "Don't have a team or prefer to play solo? Sign up as a free agent and we'll try to place you with others to compete."
            : "Register your full team for the sport below. All players must be registered through the same team form."}
        </p>

        {/* Free agent disclaimer */}
        {selectedSport === "freeagent" && (
          <div style={{ maxWidth: 460, margin: "10px auto 0", padding: "12px 16px", borderRadius: 12, background: t.noteBg, border: `1px solid ${t.noteBorder}` }}>
            <p style={{ margin: 0, fontSize: 12, color: t.noteText, lineHeight: 1.6 }}>
              <strong>Please note:</strong> Signing up as a free agent does not guarantee placement on a team. It is entirely at the discretion of team captains to select free agents — there is a chance you may not get picked up.
            </p>
          </div>
        )}
      </header>

      {/* Google Form iframe */}
      <main style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "36px auto 0", padding: "0 20px 80px" }}>
        <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.15)", border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0" }}>
          <div style={{ height: 4, background: `linear-gradient(90deg,${activeSport.color},${activeSport.color}dd)`, transition: "background 0.3s ease" }} />
          <iframe
            key={selectedSport}
            src={activeSport.formUrl}
            width="100%"
            height="900"
            frameBorder="0"
            scrolling="yes"
            style={{ display: "block", background: "#fff" }}
            title={`KUBA 2026 ${activeSport.label} Registration`}
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
