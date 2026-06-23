"use client";

import React from "react";
import { useTheme } from "@/lib/useTheme";
import { MapPin, BriefcaseBusiness, UtensilsCrossed, Sun, Moon, Users } from "lucide-react";

const VENUES = [
  {
    name: "Berryhill Sports Complex",
    address: "1800 Berryhill Rd, Cordova, TN 38016",
    events: ["Opening Ceremony (Day 1)", "Soccer Kickoff (Day 1)", "Harari Day Ceremony (Day 3)", "Ziwariqa (Day 4)", "Basketball Finals (Day 6)"],
    mapsUrl: "https://maps.google.com/?q=1800+Berryhill+Rd+Cordova+TN+38016",
  },
  {
    name: "Basketball Venue",
    address: "995 Early Maxwell Blvd, Memphis, TN 38104",
    events: ["Basketball Round 1 (Day 2)"],
    mapsUrl: "https://maps.google.com/?q=995+Early+Maxwell+Blvd+Memphis+TN+38104",
  },
  {
    name: "Mawlud Venue",
    address: "3570 Davieshire Dr, Bartlett, TN 38133",
    events: ["Mawlud (Day 2)"],
    mapsUrl: "https://maps.google.com/?q=3570+Davieshire+Dr+Bartlett+TN+38133",
  },
  {
    name: "Soccer Semifinals Field",
    address: "4223 Macon Rd, Memphis, TN 38122",
    events: ["Soccer Semifinals (Day 4)"],
    mapsUrl: "https://maps.google.com/?q=4223+Macon+Rd+Memphis+TN+38122",
  },
  {
    name: "Christian Brothers University",
    address: "650 E Pkwy S, Memphis, TN 38104",
    events: ["Soccer Finals (Day 4)"],
    mapsUrl: "https://maps.google.com/?q=650+E+Pkwy+S+Memphis+TN+38104",
  },
  {
    name: "Cordova Station",
    address: "901 Cordova Station Ave, Cordova, TN 38018",
    events: ["Mix & Mingle (Day 5)", "Family Night (Day 5)", "Town Hall (Day 6)", "Gala Night (Day 6)"],
    mapsUrl: "https://maps.google.com/?q=901+Cordova+Station+Ave+Cordova+TN+38018",
  },
];

export default function TravelPage() {
  const { isDark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-gradient-to-b dark:from-blue-950 dark:via-[#060d1f] dark:to-black dark:text-zinc-50">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 border-b border-slate-200 shadow-sm dark:bg-blue-950/80 dark:border-white/10 dark:shadow-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-2.5 shrink-0 min-w-0">
            <div className="h-9 w-9 rounded-2xl bg-blue-600 dark:bg-white/10 grid place-content-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
                <path d="M12 2C7 2 3 6 3 11c0 4 3 7 7 7v4l4-4c4 0 7-3 7-7 0-5-4-9-9-9Z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-amber-600 dark:text-amber-300/90 truncate">
                28th Harari Sport &amp; Cultural Festival
              </p>
              <p className="font-bold text-slate-900 dark:text-white leading-tight text-sm sm:text-base">KUBA 2026 · Memphis</p>
            </div>
          </a>

          <div className="flex items-center gap-3 shrink-0">
            <a href="/#schedule"
              className="hidden sm:inline text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-amber-300 dark:hover:text-amber-200 transition-colors">
              ← Schedule
            </a>
            <button onClick={toggle} aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Banner ── */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 dark:text-amber-300/80 mb-2">KUBA 2026 · Memphis</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">Travel &amp; Venues</h1>
          <p className="mt-3 text-blue-100 dark:text-white/70 text-sm sm:text-base max-w-xl">
            Addresses, directions, and everything you need to get to each event.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-14">

        {/* ── Venue Map ── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-blue-100 border border-blue-200 dark:bg-amber-400/15 dark:border-amber-400/25 grid place-items-center shrink-0">
              <MapPin className="h-4 w-4 text-blue-600 dark:text-amber-300" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Venue Map</h2>
          </div>
          <div className="rounded-2xl bg-white dark:bg-blue-900/30 border border-slate-200 dark:border-white/10 p-4 sm:p-5 shadow-sm overflow-hidden">
            <div style={{ height: 460, overflow: "hidden", borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)" }}>
              <iframe
                src="https://www.google.com/maps/d/embed?mid=1rheZ4vzCo6ZqkzVfxcRx6fe-04SvUec&hl=en&ehbc=2E312F"
                width="100%"
                style={{ display: "block", border: 0, height: 560, marginTop: -85 }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="KUBA 2026 Venue Map"
              />
            </div>
          </div>
        </section>

        {/* ── Venue Addresses ── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-blue-100 border border-blue-200 dark:bg-amber-400/15 dark:border-amber-400/25 grid place-items-center shrink-0">
              <MapPin className="h-4 w-4 text-blue-600 dark:text-amber-300" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">All Venue Addresses</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {VENUES.map((v) => (
              <div key={v.name}
                className="rounded-2xl bg-white dark:bg-blue-900/30 border border-slate-200 dark:border-white/10 p-4 sm:p-5 shadow-sm
                  hover:-translate-y-0.5 hover:border-blue-300 dark:hover:border-amber-400/25 hover:shadow-md transition-all duration-200 flex flex-col gap-3">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{v.name}</p>
                  <p className="text-slate-500 dark:text-white/50 text-xs mt-1">{v.address}</p>
                </div>
                <ul className="space-y-1">
                  {v.events.map(e => (
                    <li key={e} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-white/65">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 dark:bg-amber-400 shrink-0" />
                      {e}
                    </li>
                  ))}
                </ul>
                <a href={v.mapsUrl} target="_blank" rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-amber-300 hover:underline transition-colors">
                  <MapPin className="h-3 w-3 shrink-0" /> Get Directions →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── Hotels & Stays ── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-blue-100 border border-blue-200 dark:bg-amber-400/15 dark:border-amber-400/25 grid place-items-center shrink-0">
              <BriefcaseBusiness className="h-4 w-4 text-blue-600 dark:text-amber-300" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Hotels &amp; Stays</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white dark:bg-blue-900/30 border border-slate-200 dark:border-white/10 p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
              <p className="font-bold text-slate-900 dark:text-white text-sm">Townhome Inn &amp; Suites</p>
              <p className="text-slate-500 dark:text-white/50 text-xs mt-1">2270 N Germantown Pkwy, Cordova, TN</p>
              <p className="text-slate-600 dark:text-white/60 text-xs mt-2 leading-relaxed">Hotel close to festival venues in Cordova.</p>
              <a href="https://www.ihg.com/spnd/hotels/us/en/cordova/memdc/hoteldetail"
                target="_blank" rel="noopener noreferrer"
                className="inline-block mt-3 text-blue-600 dark:text-amber-300 text-xs font-semibold hover:underline transition-colors">
                Book now →
              </a>
            </div>

            <div className="rounded-2xl bg-white dark:bg-blue-900/30 border border-slate-200 dark:border-white/10 p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
              <p className="font-bold text-slate-900 dark:text-white text-sm">Airbnb — Cordova, TN</p>
              <p className="text-slate-500 dark:text-white/50 text-xs mt-1">Entire homes near festival venues</p>
              <p className="text-slate-600 dark:text-white/60 text-xs mt-2 leading-relaxed">Pre-filtered for Jun 28 – Jul 5 in Cordova.</p>
              <a href="https://www.airbnb.com/s/Cordova--TN/homes?refinement_paths%5B%5D=%2Fhomes&acp_id=68a79d2b-b6e0-4ce9-b65c-e5d5eb175ac7&date_picker_type=calendar&checkin=2026-06-28&checkout=2026-07-05&search_type=filter_change&flexible_trip_lengths%5B%5D=one_week&monthly_start_date=2026-05-01&monthly_length=3&monthly_end_date=2026-08-01&price_filter_input_type=2&price_filter_num_nights=7&channel=EXPLORE&place_id=ChIJ2xfKt1ODf4gRsjuBNB_m7OU&query=Cordova%2C%20TN&search_mode=regular_search&ne_lat=35.1898294555983&ne_lng=-89.72995366481399&sw_lat=35.13426840117164&sw_lng=-89.8025812476069&zoom=13.892573090709954&zoom_level=13&search_by_map=true&selected_filter_order%5B%5D=room_types%3AEntire%20home%2Fapt&selected_filter_order%5B%5D=l2_property_type_ids%3A1&update_selected_filters=false&room_types%5B%5D=Entire%20home%2Fapt"
                target="_blank" rel="noopener noreferrer"
                className="inline-block mt-3 text-blue-600 dark:text-amber-300 text-xs font-semibold hover:underline transition-colors">
                Browse entire homes →
              </a>
            </div>
          </div>
        </section>

        {/* ── Halal Food & Masajid ── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-blue-100 border border-blue-200 dark:bg-amber-400/15 dark:border-amber-400/25 grid place-items-center shrink-0">
              <UtensilsCrossed className="h-4 w-4 text-blue-600 dark:text-amber-300" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Food &amp; Worship</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white dark:bg-blue-900/30 border border-slate-200 dark:border-white/10 p-5 shadow-sm">
              <p className="font-bold text-slate-900 dark:text-white text-sm mb-1">Halal Food &amp; Coffee</p>
              <p className="text-slate-600 dark:text-white/60 text-xs leading-relaxed mb-3">
                A curated Google Map of halal restaurants and coffee shops around Memphis.
              </p>
              <a href="https://www.google.com/maps/d/u/0/viewer?mid=1jIl3kd9BTMa3HDpAfoI_n_eGs5cqesTQ&ll=35.14770656054214%2C-89.85940621849579&z=11"
                target="_blank" rel="noopener noreferrer"
                className="text-blue-600 dark:text-amber-300 text-xs font-semibold hover:underline transition-colors">
                View on Google Maps →
              </a>
            </div>

            <div className="rounded-2xl bg-white dark:bg-blue-900/30 border border-slate-200 dark:border-white/10 p-5 shadow-sm">
              <p className="font-bold text-slate-900 dark:text-white text-sm mb-1">Masajid in Memphis</p>
              <div className="flex items-start gap-2 mt-2">
                <Users className="h-3.5 w-3.5 text-blue-500 dark:text-amber-400 mt-0.5 shrink-0" />
                <p className="text-slate-600 dark:text-white/65 text-xs leading-relaxed">
                  Memphis Islamic Center · Midtown Mosque · Masjid al-Rahman
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-black/30 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-white/50">
          <p>2026 Memphis Harari Co. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</a>
            <a href="/#schedule" className="hover:text-slate-900 dark:hover:text-white transition-colors">Schedule</a>
            <a href="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
