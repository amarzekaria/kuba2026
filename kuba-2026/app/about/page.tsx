"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "@/lib/useTheme";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Users, Star, HeartHandshake, Footprints, CalendarDays, MapPin,
  Sun, Moon, Mail, Instagram, Facebook,
} from "lucide-react";

export default function AboutPage() {
  const { isDark, toggle } = useTheme();

  const DONATE_URL = "https://checkout.square.site/merchant/MLZ656EDF17D3/checkout/IHXYUZ75LWCKBIOPBYCSWNMF";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-gradient-to-b dark:from-blue-950 dark:via-[#060d1f] dark:to-black dark:text-zinc-50">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 border-b border-slate-200 shadow-sm dark:bg-blue-950/80 dark:border-white/10 dark:shadow-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 min-w-0">
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
          </Link>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/#schedule"
              className="hidden sm:inline text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-amber-300 dark:hover:text-amber-200 transition-colors">
              ← Schedule
            </Link>
            <Button variant="ghost" onClick={toggle} aria-label="Toggle theme"
              className="text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 p-2 rounded-xl">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* ── Banner ── */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 dark:text-amber-300/80 mb-2">KUBA 2026 · Memphis</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">About the Festival</h1>
          <p className="mt-3 text-blue-100 dark:text-white/70 text-sm sm:text-base max-w-xl">
            The 28th Harari Sport &amp; Cultural Festival — June 29 to July 4, 2026 in Memphis, Tennessee.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-14">

        {/* ── What is KUBA ── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-blue-100 border border-blue-200 dark:bg-amber-400/15 dark:border-amber-400/25 grid place-items-center shrink-0">
              <Users className="h-4 w-4 text-blue-600 dark:text-amber-300" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">What is KUBA?</h2>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3 space-y-4">
              <p className="text-slate-700 dark:text-white/80 leading-relaxed text-sm sm:text-base">
                KUBA (the Harari Sport &amp; Cultural Festival) is an annual gathering of the global Harari community
                featuring sports tournaments, cultural showcases, music, fashion, food, and family-friendly programming.
                It celebrates Harari heritage and unity while welcoming friends and neighbors from all backgrounds.
              </p>
              <p className="text-slate-700 dark:text-white/80 leading-relaxed text-sm sm:text-base">
                This year, Memphis proudly hosts the 28th KUBA — six days of community, competition, and celebration
                from June 29 through July 4, 2026.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                {[
                  { icon: Users,          title: "Family-Friendly",       desc: "Youth clinics, storytelling, and events for all ages throughout the week." },
                  { icon: Star,           title: "Cultural Showcase",      desc: "Traditional music, dance, fashion, and language — all on display." },
                  { icon: HeartHandshake, title: "Community & Networking", desc: "Connect with Harari families and organizations from across America." },
                  { icon: Footprints,     title: "Sports & Competition",   desc: "Soccer and basketball tournaments with teams from across the country." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title}
                    className="rounded-2xl bg-white dark:bg-blue-900/30 border border-slate-200 dark:border-white/10 p-4 shadow-sm
                      hover:-translate-y-0.5 hover:border-blue-300 dark:hover:border-amber-400/25 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-amber-400/15 border border-blue-200 dark:border-amber-400/20 grid place-items-center shrink-0">
                        <Icon className="h-3.5 w-3.5 text-blue-600 dark:text-amber-300" />
                      </div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{title}</p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-white/65 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Info */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white dark:bg-blue-900/30 border border-slate-200 dark:border-white/10 p-5 sm:p-6 shadow-sm">
                <p className="font-bold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
                  <span className="h-1.5 w-5 rounded-full bg-blue-600 dark:bg-amber-400 inline-block" />
                  Key Info
                </p>
                <div className="grid gap-3 text-sm">
                  {[
                    { icon: CalendarDays, text: "June 29 – July 4, 2026" },
                    { icon: MapPin,       text: "Memphis, Tennessee" },
                    { icon: Users,        text: "Open to all — Harari heritage celebrated" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-white/5 dark:border-white/5">
                      <Icon className="h-4 w-4 text-blue-600 dark:text-amber-300 mt-0.5 shrink-0" />
                      <span className="text-slate-700 dark:text-white/80">{text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <Button className="w-full rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold" asChild>
                    <Link href="/#schedule">View Full Schedule</Link>
                  </Button>
                  <Button className="w-full rounded-2xl bg-amber-500 text-white hover:bg-amber-400 dark:bg-amber-400 dark:text-blue-950 dark:hover:bg-amber-300 font-bold"
                    onClick={() => window.open(DONATE_URL, "_blank", "noopener,noreferrer")}>
                    Donate to Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 rounded-xl bg-blue-100 border border-blue-200 dark:bg-amber-400/15 dark:border-amber-400/25 grid place-items-center shrink-0">
              <Star className="h-4 w-4 text-blue-600 dark:text-amber-300" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">FAQ</h2>
          </div>

          <Accordion type="single" collapsible
            className="bg-white dark:bg-blue-900/30 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
            {[
              { value: "q1", q: "Is this event open to everyone?",
                a: "Yes. While KUBA celebrates Harari heritage, all respectful attendees are warmly welcome. Bring your family and friends." },
              { value: "q2", q: "Is there parking at the venues?",
                a: "Free parking is available at all festival locations. Check the Travel page for venue addresses and maps." },
              { value: "q3", q: "Will there be food at the venues?",
                a: "Yes, food vendors will be available at select venues. The Travel page also has a halal food map for restaurants around Memphis." },
              { value: "q4", q: "Is there a registration fee?",
                a: "Team registration has closed. Free agent sign-up is still open — register at the link above." },
              { value: "q5", q: "Who do I contact if I have questions?",
                a: "Email us at memphiskuba@gmail.com or follow @memphiskuba2026 on Instagram for real-time updates during the festival." },
            ].map(({ value, q, a }) => (
              <AccordionItem key={value} value={value} className="border-slate-200 dark:border-white/10">
                <AccordionTrigger className="px-5 sm:px-6 py-4 text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-amber-300 hover:no-underline font-medium text-left text-sm sm:text-base transition-colors">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="px-5 sm:px-6 pb-4 pt-0 text-slate-600 dark:text-white/65 text-sm leading-relaxed">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* ── Contact strip ── */}
        <section>
          <div className="rounded-2xl bg-white dark:bg-blue-900/30 border border-slate-200 dark:border-white/10 p-5 sm:p-6 shadow-sm">
            <p className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="h-1.5 w-5 rounded-full bg-blue-600 dark:bg-amber-400 inline-block" />
              Get in Touch
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="mailto:memphiskuba@gmail.com"
                className="flex items-center gap-2 text-blue-600 dark:text-amber-300 hover:underline font-medium transition-colors">
                <Mail className="h-4 w-4 shrink-0" /> memphiskuba@gmail.com
              </a>
              <a href="https://www.instagram.com/memphiskuba2026/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-pink-600 dark:text-pink-300 hover:underline font-medium transition-colors">
                <Instagram className="h-4 w-4 shrink-0" /> @memphiskuba2026
              </a>
              <a href="https://www.facebook.com/profile.php?id=61574823466873" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 dark:text-blue-300 hover:underline font-medium transition-colors">
                <Facebook className="h-4 w-4 shrink-0" /> Memphis Harari Community
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-black/30 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-white/50">
          <p>2026 Memphis Harari Co. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
            <Link href="/#schedule" className="hover:text-slate-900 dark:hover:text-white transition-colors">Schedule</Link>
            <Link href="/travel" className="hover:text-slate-900 dark:hover:text-white transition-colors">Travel</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
