"use client";

import { useState } from "react";
import Link from "next/link";


const SOCCER_FORM_URL      = "https://docs.google.com/forms/d/e/1FAIpQLSd4VchSSA6ns-DmiZoHsU9wX69KvVBFV-OzLE2bOTVb1BmfmQ/viewform";
const BASKETBALL_FORM_URL  = "https://docs.google.com/forms/d/e/1FAIpQLSdWkHfROLrdutgYvz3dO4dzbUbuikEIOiBvHLQJLkhj-5vEYQ/viewform?usp=publish-editor";
const VOLLEYBALL_FORM_URL  = "https://docs.google.com/forms/d/e/1FAIpQLSeCh5C2-Pp7Wiwemr_yiL-zbAXJ4VyI5JmZFIVVMKPGGhelDg/viewform?usp=publish-editor";
const FREE_AGENT_FORM_URL  = "https://docs.google.com/forms/d/e/1FAIpQLScWZEYhSkloEJRQABI6IYVyGGk5B4yGi-86EkIj0U3kjlMnbQ/viewform?usp=header";

type Sport = "soccer" | "basketball" | "volleyball" | "freeagent";

export default function RegisterPage() {
  const [selectedSport, setSelectedSport] = useState<Sport>("soccer");

  const sports: { id: Sport; label: string; formUrl: string; color: string }[] = [
    { id: "soccer",     label: "Soccer",      formUrl: SOCCER_FORM_URL,     color: "#2563eb" },
    { id: "basketball", label: "Basketball",  formUrl: BASKETBALL_FORM_URL, color: "#f59e0b" },
    { id: "volleyball", label: "Volleyball",  formUrl: VOLLEYBALL_FORM_URL, color: "#3b82f6" },
    { id: "freeagent",  label: "Free Agent",  formUrl: FREE_AGENT_FORM_URL, color: "#6366f1" },
  ];

  const activeSport = sports.find(s => s.id === selectedSport)!;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(155deg, #060d1f 0%, #0a1628 40%, #030810 100%)",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Decorative orbs ── */}
      <div
        style={{
          position: "fixed",
          top: "-180px",
          right: "-180px",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(37,99,235,0.22) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-220px",
          left: "-200px",
          width: 520,
          height: 520,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Header ── */}
      <header
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "52px 24px 0",
        }}
      >
        {/* Back to home pill */}
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginBottom: 28,
          padding: "6px 18px",
          borderRadius: 20,
          border: "1px solid rgba(251,191,36,0.35)",
          color: "#fcd34d",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          textDecoration: "none",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.background = "rgba(251,191,36,0.1)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.background = "transparent")
        }
      >
        ← BACK
      </Link>


        <h1
          style={{
            color: "#fff",
            fontSize: "clamp(26px, 5vw, 36px)",
            fontWeight: 400,
            margin: "0 0 10px",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          Sports Registration
        </h1>

        {/* Sport selector — two labeled groups */}
        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>

          {/* Team registration group */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              Team Registration
            </span>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              {sports.filter(s => s.id !== "freeagent").map((sport) => {
                const isActive = selectedSport === sport.id;
                return (
                  <button
                    key={sport.id}
                    onClick={() => setSelectedSport(sport.id)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 20,
                      background: isActive ? activeSport.color : "rgba(255,255,255,0.1)",
                      border: isActive
                        ? `2px solid ${activeSport.color}`
                        : "2px solid rgba(255,255,255,0.2)",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "inherit",
                      letterSpacing: "0.02em",
                      boxShadow: isActive ? `0 4px 16px ${activeSport.color}66` : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.target as HTMLElement).style.background = "rgba(255,255,255,0.15)";
                        (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.target as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                        (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                      }
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
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", textTransform: "uppercase" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          </div>

          {/* Free Agent group */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(99,102,241,0.8)",
              }}
            >
              No Team? Play as a Free Agent
            </span>
            {(() => {
              const sport = sports.find(s => s.id === "freeagent")!;
              const isActive = selectedSport === "freeagent";
              return (
                <button
                  onClick={() => setSelectedSport("freeagent")}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 20,
                    background: isActive ? sport.color : "rgba(99,102,241,0.12)",
                    border: isActive
                      ? `2px solid ${sport.color}`
                      : "2px solid rgba(99,102,241,0.35)",
                    color: isActive ? "#fff" : "rgba(129,140,248,0.9)",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "inherit",
                    letterSpacing: "0.02em",
                    boxShadow: isActive ? `0 4px 16px ${sport.color}66` : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.target as HTMLElement).style.background = "rgba(99,102,241,0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.target as HTMLElement).style.background = "rgba(99,102,241,0.12)";
                    }
                  }}
                >
                  Free Agent Sign-Up
                </button>
              );
            })()}
          </div>
        </div>

        {/* Contextual description */}
        <p
          style={{
            marginTop: 14,
            color: "rgba(255,255,255,0.5)",
            fontSize: 13,
            maxWidth: 460,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.6,
            minHeight: "2.6em",
          }}
        >
          {selectedSport === "freeagent"
            ? "Don't have a team or prefer to play solo? Sign up as a free agent and we'll place you with others to compete."
            : "Register your full team for the sport below. All players must be registered through the same team form."}
        </p>
      </header>

      {/* ── Google Form iframe ── */}
      <main
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 700,
          margin: "36px auto 0",
          padding: "0 20px 80px",
        }}
      >
        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Color accent stripe */}
          <div
            style={{
              height: 4,
              background: `linear-gradient(90deg, ${activeSport.color}, ${activeSport.color}dd)`,
              transition: "background 0.3s ease",
            }}
          />

          <iframe
            key={selectedSport} // Forces re-render when sport changes
            src={activeSport.formUrl}
            width="100%"
            height="900"
            frameBorder="0"
            scrolling="yes"
            style={{
              display: "block",
              background: "#fff",
            }}
            title={`KUBA 2026 ${activeSport.label} Registration`}
          />
        </div>

        {/* Footer note */}
        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.35)",
            fontSize: 12,
            marginTop: 24,
            lineHeight: 1.6,
          }}
        >
          Questions? Email{" "}
          <a
            href="mailto:contact@kuba2026.org"
            style={{
              color: "#fcd34d",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            contact@kuba2026.org
          </a>
        </p>
      </main>
    </div>
  );
}
