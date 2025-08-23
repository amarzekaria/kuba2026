"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  MapPin,
  Instagram,
  Facebook,
  Menu,
  X,
  Clock,
  Users,
  UtensilsCrossed,
  HeartHandshake,
  Baby,
} from "lucide-react";

/**
 * KUBA 2026 — Harari Sport & Cultural Festival (Memphis)
 * Harari color palette: deep green primary, gold accent, high-contrast neutrals.
 */

// Festival week: June 29 – July 5, 2026 (Memphis CDT, UTC−05:00)
const COUNTDOWN_TARGET = new Date("2026-06-29T00:00:00-05:00");

function useCountdown(targetDate: Date) {
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, targetDate.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

/* ===========
   NavLink that scrolls to in-page sections WITHOUT putting #hash in the URL.
   You can still pass an absolute/relative href and it will behave normally.
   =========== */
type NavLinkProps = {
  href: string; // "#section" or normal URL
  children: React.ReactNode;
  className?: string;
  onClick?: () => void; // optional extra callback (e.g., close mobile drawer)
};

const NavLink = ({ href, children, className, onClick }: NavLinkProps) => {
  const isHash = href.startsWith("#");
  const handle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHash) {
      onClick?.();
      return;
    }
    e.preventDefault();
    const id = href.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    // keep URL clean (remove any #…)
    history.replaceState(null, "", location.pathname + location.search);
    onClick?.();
  };
  return (
    <a href={isHash ? "/" : href} onClick={handle} className={className}>
      {children}
    </a>
  );
};

/* =========================
   Background Photo Album
   ========================= */
function BackgroundAlbum({
  images,
  interval = 5000,
  resumeAfter = 8000,
}: {
  images: string[];
  interval?: number;
  resumeAfter?: number;
}) {
  const [idx, setIdx] = useState(0);
  const [pausedUntil, setPausedUntil] = useState<number>(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(m.matches);
    const handler = () => setReduceMotion(m.matches);
    m.addEventListener?.("change", handler);
    return () => m.removeEventListener?.("change", handler);
  }, []);

  const next = () => setIdx((i) => (i + 1) % images.length);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);

  useEffect(() => {
    if (reduceMotion) return;
    const t = window.setInterval(() => {
      if (Date.now() >= pausedUntil) next();
    }, interval);
    return () => window.clearInterval(t);
  }, [interval, pausedUntil, reduceMotion]);

  const onNext = () => {
    next();
    setPausedUntil(Date.now() + resumeAfter);
  };
  const onPrev = () => {
    prev();
    setPausedUntil(Date.now() + resumeAfter);
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {images.map((src, i) => (
        <div
          key={src + i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}
          style={{ backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" }}
          aria-hidden={i !== idx}
        />
      ))}
      {/* overlays for readability over any photo */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-emerald-950/60 to-black/80" />
      <div className="absolute inset-0 bg-black/10" />
      {/* arrows */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 sm:px-4 pointer-events-auto">
        <button
          onClick={onPrev}
          aria-label="Previous photo"
          className="grid place-items-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur border border-white/15 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          ‹
        </button>
        <button
          onClick={onNext}
          aria-label="Next photo"
          className="grid place-items-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur border border-white/15 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default function KubaMemphisSite() {
  const [open, setOpen] = useState(false);
  const { days, hours, minutes, seconds } = useCountdown(COUNTDOWN_TARGET);

  // Smooth anchor scrolling + restore position handling
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev;
    };
  }, []);
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    // if a hash exists (e.g., /#about), scroll there once and then clean URL
    if (location.hash) {
      const id = location.hash.slice(1);
      document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
      history.replaceState(null, "", location.pathname + location.search);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, []);

  const stats = useMemo(
    () => [
      { label: "Expected Attendees", value: "500+" },
      { label: "Communities", value: "12+" },
      { label: "Days of Festivities", value: "7" },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-950 to-black text-zinc-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-emerald-950/60 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo now uses NavLink so it scrolls to #home without showing a hash */}
          <NavLink href="#home" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-white/10 grid place-content-center">
              {/* simple mark */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 2C7 2 3 6 3 11c0 4 3 7 7 7v4l4-4c4 0 7-3 7-7 0-5-4-9-9-9Z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-amber-300/90">28th Harari Sport & Cultural Festival</p>
              <p className="font-bold">KUBA 2026 • Memphis</p>
            </div>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="#schedule" className="text-sm font-semibold text-white/90 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-md px-1 transition">
              Schedule
            </NavLink>
            <NavLink href="#about" className="text-sm font-semibold text-white/90 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-md px-1 transition">
              About
            </NavLink>
            <NavLink href="#travel" className="text-sm font-semibold text-white/90 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-md px-1 transition">
              Travel
            </NavLink>
            <NavLink href="#contact" className="text-sm font-semibold text-white/90 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-md px-1 transition">
              Contact
            </NavLink>

            {/* Get Updates button with NavLink as child (no hash in URL) */}
            <Button className="bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-amber-400 rounded-2xl hidden lg:inline-flex" asChild>
              <NavLink href="#contact">Get Updates</NavLink>
            </Button>
          </nav>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            className="md:hidden text-white hover:bg-white/10"
            onClick={() => setOpen(true)}
            aria-label="Open Menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/50" onClick={() => setOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-80 bg-emerald-950 border-l border-white/10 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold">Menu</p>
              <Button variant="ghost" onClick={() => setOpen(false)} aria-label="Close Menu">
                <X />
              </Button>
            </div>
            <div className="mt-6 grid gap-4">
              {[
                ["#schedule", "Schedule"],
                ["#about", "About"],
                ["#travel", "Travel"],
                ["#contact", "Contact"],
              ].map(([href, label]) => (
                <NavLink
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-semibold text-white/90 hover:text-white transition"
                >
                  {label}
                </NavLink>
              ))}
            </div>
            <Separator className="my-6" />
            <div className="flex gap-3">
              <Button asChild className="rounded-2xl w-full bg-emerald-600 hover:bg-emerald-700">
                <NavLink href="#contact" onClick={() => setOpen(false)}>
                  Get Updates
                </NavLink>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section id="home" className="relative overflow-hidden min-h-[85vh] md:min-h-screen isolation-isolate">
        <BackgroundAlbum
          images={[
            "/album/hscf_97.jpg",
            "/album/team_pic1.jpg",
            "/album/Ziwariqa26.jpg",
            "/album/culture.jpg",
            "/album/wash_team.jpg",
            "/album/BirtukanGrad-702.jpg",
            "/album/image_3.jpg",
          ]}
          interval={5000}
          resumeAfter={8000}
        />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 items-stretch gap-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-6 md:p-8"
          >
            <Badge className="bg-amber-400/20 text-amber-200 border-amber-300/30 mb-4">Coming Soon</Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              KUBA 2026
              <span className="block text-amber-300">Memphis, Tennessee</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/90">
              Celebrate unity, heritage, and community with a week of sports, music, food, and cultural showcases.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-base">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-amber-300" /> June 29 – July 5, 2026
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-5 w-5 text-amber-300" /> Memphis, TN
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-300" /> Hosted by the Memphis Harari community
              </span>
            </div>
            <div className="mt-8 flex gap-3">
              {/* Buttons use NavLink asChild so the URL stays clean */}
              <Button className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-amber-400" asChild>
                <NavLink href="#contact">Get Notified</NavLink>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-2xl border-emerald-400/40 text-emerald-200 hover:bg-emerald-800/50 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <NavLink href="#about">Learn More</NavLink>
              </Button>
            </div>
          </motion.div>

          {/* Countdown panel */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-center">
            <Card className="rounded-2xl bg-black/40 backdrop-blur-md border-white/10 mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-300" /> Countdown to June 29, 2026
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3 text-center">
                  {[
                    { label: "Days", value: days },
                    { label: "Hours", value: hours },
                    { label: "Minutes", value: minutes },
                    { label: "Seconds", value: seconds },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-2xl bg-white/5 p-4 border border-white/10">
                      <p className="text-3xl md:text-4xl font-extrabold tabular-nums">{value.toString().padStart(2, "0")}</p>
                      <p className="text-xs uppercase tracking-widest text-white/80">{label}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-white/80">June 29 – July 5, 2026</p>
              </CardContent>
            </Card>

            {/* Quick stats */}
            <div className="mt-6 flex justify-center gap-3 flex-wrap">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-4 text-center w-40">
                  <p className="text-xl font-bold text-amber-300">{s.value}</p>
                  <p className="text-sm text-white/85">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule" className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <CalendarDays className="h-6 w-6 text-amber-300" />
          <h2 className="text-3xl font-extrabold">Schedule (COMING SOON)</h2>
        </div>
        <p className="text-white/90 mb-6">This is a sample week outline based on Dallas Kuba 2025. Final schedule TBA.</p>

        <Tabs defaultValue="day1" className="w-full">
          <TabsList className="w-full grid grid-cols-7 gap-2 bg-white rounded-lg p-0 mt-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <TabsTrigger
                key={`day${i + 1}`}
                value={`day${i + 1}`}
                className="min-w-0 text-center px-2 py-2 transition-colors duration-300 hover:bg-emerald-100/60 data-[state=active]:bg-emerald-200/60 text-xs sm:text-sm rounded-lg font-semibold text-emerald-900"
              >
                {`Day ${i + 1}`}
              </TabsTrigger>
            ))}
          </TabsList>

          {[
            {
              key: "day1",
              items: [
                { time: "1:00 PM - 5:00 PM", title: "Welcome & Opening Dua", icon: Users },
                { time: "6:00 PM - 11:00 PM", title: "Soccer Round 1", icon: UtensilsCrossed },
              ],
            },
            {
              key: "day2",
              items: [
                { time: "11:00 AM - 7:00 PM", title: "Volleyball & Basketball Round 1", icon: Users },
                { time: "9:00 PM", title: "Evening Social", icon: Users },
              ],
            },
            {
              key: "day3",
              items: [
                { time: "2:00 PM - 9:30 PM", title: "Harari Cultural Day", icon: HeartHandshake },
                { time: "TBA", title: " Mawlud", icon: Users },
              ],
            },
            {
              key: "day4",
              items: [
                { time: "3:00 PM - 9:00 PM", title: "Ziwariqa", icon: Users },
                { time: "4:00 PM - 10:00 PM", title: "Soccer Playoff & Final", icon: UtensilsCrossed },
              ],
            },
            {
              key: "day5",
              items: [
                { time: "2:00 PM", title: "Kids' Day: Games & Activities", icon: Baby },
                { time: "8:00 PM - 2:00 AM", title: "Gala Night 1", icon: Users },
              ],
            },
            {
              key: "day6",
              items: [
                { time: "11:00 AM - 4:00 PM", title: "Basketball Playoff & Finals", icon: Users },
                { time: "8:00 PM - 2:00 AM", title: "Gala Night 2", icon: HeartHandshake },
              ],
            },
            {
              key: "day7",
              items: [{ time: "11:00 AM - 3:00 PM", title: "Townhall Meeting", icon: UtensilsCrossed }],
            },
          ].map(({ key, items }) => (
            <TabsContent key={key} value={key} className="mt-6">
              <div className="flex flex-wrap justify-center gap-6 mx-auto max-w-6xl">
                {items.map(({ time, title, icon: Icon }) => (
                  <Card key={title} className="rounded-2xl bg-emerald-900/30 border-white/10 w-full sm:w-[28rem]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Icon className="h-4 w-4 text-amber-300" /> {title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-white/85">{time} • Memphis, TN</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* About */}
      <section id="about" className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-3xl font-extrabold mb-4">What is KUBA?</h2>
            <p className="text-white/90 leading-relaxed">
              KUBA (the Harari Sport & Cultural Festival) is an annual gathering of the global Harari community featuring sports
              tournaments, cultural showcases, music, fashion, food, and family-friendly programming. It celebrates Harari heritage
              and unity while welcoming friends and neighbors from all backgrounds. Inshallah, Memphis will proudly host the 28th KUBA from
              June 29 – July 5, 2026.
            </p>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <div className="rounded-2xl bg-emerald-900/30 border border-white/10 p-4">
                <p className="font-semibold">Family-Friendly</p>
                <p className="text-sm text-white/85">Youth clinics, storytelling, and kid friendly events throughout the week.</p>
              </div>
              <div className="rounded-2xl bg-emerald-900/30 border border-white/10 p-4">
                <p className="font-semibold">Cultural Showcase</p>
                <p className="text-sm text-white/85">Traditional displays, music, dance, and language sessions.</p>
              </div>
              <div className="rounded-2xl bg-emerald-900/30 border border-white/10 p-4">
                <p className="font-semibold">Community & Networking</p>
                <p className="text-sm text-white/85">
                  Opportunities to connect with Harari families, leaders, and organizations from across America.
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-900/30 border border-white/10 p-4">
                <p className="font-semibold">Sports & Awards</p>
                <p className="text-sm text-white/85">Soccer, basketball, and more!</p>
              </div>
            </div>
          </div>

          <Card className="rounded-2xl bg-emerald-900/30 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Key Info</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-amber-300" />
                <span>When: June 29 – July 5, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-300" />
                <span>Where: Memphis, Tennessee (venue and hotels TBA)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-300" />
                <span>Who: Open to all — Harari heritage celebrated</span>
              </div>
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4 text-amber-300" />
                <span>Halal food options on-site</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Travel & Venue */}
      <section id="travel" className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="h-6 w-6 text-amber-300" />
          <h2 className="text-3xl font-extrabold">Travel & Venue</h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <Card className="rounded-2xl bg-emerald-900/30 border-white/10">
            <CardHeader>
              <CardTitle>Getting to Memphis</CardTitle>
            </CardHeader>
            <CardContent className="text-white/90 text-sm grid gap-2">
              <p>
                <strong>Masajid:</strong> Memphis Islamic Center, Midtown Mosque, Masjid al-Rahman
              </p>
              <p>
                <strong>Hotels:</strong> TBA
              </p>
              <p>
                <strong>Halal Food &amp; Coffee:</strong> For halal food & dessert options, please visit{" "}
                <a
                  href="https://www.memphishalal.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 underline hover:text-amber-200"
                >
                  memphishalal.com
                </a>
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl bg-emerald-900/30 border-white/10">
            <CardHeader>
              <CardTitle>Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full rounded-xl bg-emerald-950/60 grid place-content-center text-white/80">
                Interactive map coming soon
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mt-10">
          <h3 className="text-2xl font-extrabold mb-4">FAQ</h3>
          <Accordion type="single" collapsible className="bg-emerald-900/30 rounded-2xl border border-white/10">
            <AccordionItem value="item-1">
              <AccordionTrigger className="px-6 py-4">Is this event open to everyone?</AccordionTrigger>
              <AccordionContent className="px-6 pt-2 pb-4">
                Yes. While KUBA celebrates Harari heritage, all respectful attendees are welcome.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="px-6 py-4">Are the schedule items final?</AccordionTrigger>
              <AccordionContent className="px-6 pt-2 pb-4">
                No. The schedule here is a preview; final times and locations will be announced closer to festival week.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-3xl font-extrabold mb-2">Contact</h2>
            <p className="text-white/90">
              For inquiries, email us directly at{" "}
              <a href="mailto:contact@kuba2026.org" className="text-amber-300 underline">
                contact@kuba2026.org
              </a>
              .
            </p>

            <div className="mt-6 flex gap-3">
              <Button
                asChild
                variant="outline"
                className="rounded-2xl border-white/20 bg-white text-black hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <a href="https://www.instagram.com/memphiskuba2026/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                  Instagram
                </a>
              </Button>

              <Button
                variant="outline"
                asChild
                className="rounded-2xl border-white/20 bg-white text-black hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <a href="https://www.facebook.com/profile.php?id=61574823466873" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4 mr-2 text-black" /> Facebook
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-top border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-sm text-white/85">
          <div>
            <p className="font-semibold">KUBA 2026 • Memphis</p>
            <p className="mt-2">© {new Date().getFullYear()} Memphis Host Committee. All rights reserved.</p>
            <p className="mt-1 text-xs text-white/70">This is a coming-soon page. Details subject to change.</p>
          </div>
          <div>
            <p className="font-semibold">Quick Links</p>
            <ul className="mt-2 grid gap-1">
              <li>
                <NavLink href="#schedule" className="hover:underline">
                  Schedule
                </NavLink>
              </li>
              <li>
                <NavLink href="#travel" className="hover:underline">
                  Travel
                </NavLink>
              </li>
              <li>
                <NavLink href="#contact" className="hover:underline">
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Accessibility & Conduct</p>
            <ul className="mt-2 grid gap-1">
              <li>Accessible seating & family rooms planned</li>
              <li>Zero-tolerance harassment policy</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
