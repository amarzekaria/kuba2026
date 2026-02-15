"use client";

import { useState } from "react";
import Link from "next/link";


const SOCCER_FORM_URL     = "https://docs.google.com/forms/d/e/1FAIpQLSd4VchSSA6ns-DmiZoHsU9wX69KvVBFV-OzLE2bOTVb1BmfmQ/viewform";
const BASKETBALL_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdWkHfROLrdutgYvz3dO4dzbUbuikEIOiBvHLQJLkhj-5vEYQ/viewform?usp=publish-editor";
const VOLLEYBALL_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeCh5C2-Pp7Wiwemr_yiL-zbAXJ4VyI5JmZFIVVMKPGGhelDg/viewform?usp=publish-editor";

type Sport = "soccer" | "basketball" | "volleyball";

export default function RegisterPage() {
  const [selectedSport, setSelectedSport] = useState<Sport>("soccer");

  const sports: { id: Sport; label: string; formUrl: string; color: string }[] = [
    { id: "soccer",     label: "Soccer",     formUrl: SOCCER_FORM_URL,     color: "#2e9e5a" },
    { id: "basketball", label: "Basketball", formUrl: BASKETBALL_FORM_URL, color: "#d4a843" },
    { id: "volleyball", label: "Volleyball", formUrl: VOLLEYBALL_FORM_URL, color: "#2e9e5a" },
  ];

  const activeSport = sports.find(s => s.id === selectedSport)!;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(155deg, #0d2b1e 0%, #164d2e 40%, #0f3a25 100%)",
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
            "radial-gradient(circle, rgba(46,158,90,0.18) 0%, transparent 70%)",
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
            "radial-gradient(circle, rgba(212,168,67,0.1) 0%, transparent 70%)",
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
          border: "1px solid rgba(212,168,67,0.35)",
          color: "#e8c97a",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          textDecoration: "none",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.background = "rgba(212,168,67,0.1)")
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

        {/* Sport selector badges */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginTop: 24,
            flexWrap: "wrap",
          }}
        >
          {sports.map((sport) => {
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
              color: "#e8c97a",
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
