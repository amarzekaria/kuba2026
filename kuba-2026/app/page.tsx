"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays, PartyPopper, DribbbleIcon, Star, MapPin, Instagram, Facebook,
  Menu, X, Users, UtensilsCrossed, HeartHandshake, Dribbble, BriefcaseBusiness,
  Footprints, HandHeart, Clock, Mail, Camera,
} from "lucide-react";

/* ─── helpers ─── */
function getFestivalDay(now: Date) {
  const start = new Date("2026-06-29T00:00:00-05:00");
  const end   = new Date("2026-07-06T00:00:00-05:00");
  if (now < start || now >= end) return null;
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

function isFestivalLive(now: Date) {
  const start = new Date("2026-06-29T00:00:00-05:00");
  const end   = new Date("2026-07-06T00:00:00-05:00");
  return now >= start && now < end;
}

const COUNTDOWN_TARGET = new Date("2026-06-29T00:00:00-05:00");

function useCountdown(target: Date) {
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/* ─── NavLink ─── */
type NavLinkProps = { href: string; children: React.ReactNode; className?: string; onClick?: () => void };
const NavLink = ({ href, children, className, onClick }: NavLinkProps) => {
  const isHash = href.startsWith("#");
  const handle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHash) { onClick?.(); return; }
    e.preventDefault();
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", location.pathname + location.search);
    onClick?.();
  };
  return <a href={isHash ? "/" : href} onClick={handle} className={className}>{children}</a>;
};

/* ─── Background photo slideshow ─── */
function BackgroundAlbum({ images, interval = 5000, resumeAfter = 8000 }: {
  images: string[]; interval?: number; resumeAfter?: number;
}) {
  const [idx, setIdx]             = useState(0);
  const [pausedUntil, setPaused]  = useState(0);
  const [reduceMotion, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const h = () => setReduce(mq.matches);
    mq.addEventListener?.("change", h);
    return () => mq.removeEventListener?.("change", h);
  }, []);

  const next = () => setIdx(i => (i + 1) % images.length);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (reduceMotion) return;
    const t = window.setInterval(() => { if (Date.now() >= pausedUntil) next(); }, interval);
    return () => window.clearInterval(t);
  }, [interval, pausedUntil, reduceMotion]);

  const bump = (fn: () => void) => { fn(); setPaused(Date.now() + resumeAfter); };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {images.map((src, i) => (
        <div key={src + i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}
          style={{ backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" }}
          aria-hidden={i !== idx}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/55 via-emerald-950/70 to-black/92" />
      <div className="absolute inset-0 dot-grid" />
      {/* Arrows */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 sm:px-5 pointer-events-auto">
        {[{ fn: () => bump(prev), label: "Previous photo", chr: "‹" },
          { fn: () => bump(next), label: "Next photo",     chr: "›" }].map(({ fn, label, chr }) => (
          <button key={label} onClick={fn} aria-label={label}
            className="grid place-items-center h-10 w-10 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur border border-white/15 text-white text-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-all">
            {chr}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Section heading ─── */
function SectionHeading({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="h-9 w-9 rounded-xl bg-amber-400/15 border border-amber-400/20 grid place-items-center shrink-0">
        <Icon className="h-4 w-4 text-amber-300" />
      </div>
      <h2 className="text-3xl font-extrabold text-white">{title}</h2>
    </div>
  );
}

/* ─── SCHEDULE DATA ─── */
const SCHEDULE = [
  { key: "day1", date: "Mon · Jun 29", items: [
    { time: "1:00 PM – 5:00 PM",  title: "Opening Day Ceremony",          icon: Users },
    { time: "6:00 PM – 11:00 PM", title: "Soccer Round 1",                icon: Footprints },
  ]},
  { key: "day2", date: "Tue · Jun 30", items: [
    { time: "11:00 AM – 7:00 PM", title: "Volleyball & Basketball Round 1", icon: DribbbleIcon },
    { time: "8:00 PM – 12:00 AM", title: "Mawlud",                          icon: Star },
  ]},
  { key: "day3", date: "Wed · Jul 1", items: [
    { time: "1:00 PM – 8:00 PM",  title: "Harari Day Ceremony",            icon: HeartHandshake },
  ]},
  { key: "day4", date: "Thu · Jul 2", items: [
    { time: "1:00 PM – 8:00 PM",  title: "Ziwariqa",                       icon: UtensilsCrossed },
    { time: "8:00 PM – 11:00 PM", title: "Soccer Playoff & Final",         icon: Footprints },
  ]},
  { key: "day5", date: "Fri · Jul 3", items: [
    { time: "1:00 PM – 5:00 PM",  title: "Mix & Mingle",                   icon: HeartHandshake },
    { time: "8:00 PM – 12:00 AM", title: "Gala Night 1",                   icon: PartyPopper },
  ]},
  { key: "day6", date: "Sat · Jul 4", items: [
    { time: "10:00 AM – 4:00 PM", title: "Basketball Playoff & Finals",    icon: Dribbble },
    { time: "9:00 PM – 3:00 AM",  title: "Gala Night 2",                   icon: PartyPopper },
  ]},
  { key: "day7", date: "Sun · Jul 5", items: [
    { time: "12:00 AM – 2:00 PM", title: "Townhall Meeting",               icon: BriefcaseBusiness },
    { time: "2:00 PM – 3:00 PM",  title: "Farewell Ceremony",              icon: BriefcaseBusiness },
  ]},
];

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function KubaMemphisSite() {
  const [open, setOpen] = useState(false);
  const [igPostId, setIgPostId]   = useState<string | null>(null);
  const [igLoading, setIgLoading] = useState(true);
  const [igPostId2, setIgPostId2]   = useState<string | null>(null);
  const [igLoading2, setIgLoading2] = useState(true);
  const { days, hours, minutes, seconds } = useCountdown(COUNTDOWN_TARGET);
  const now        = new Date();
  const festivalDay = getFestivalDay(now);
  const liveNow    = isFestivalLive(now) || (days === 0 && hours === 0 && minutes === 0 && seconds === 0);

  const DONATE_URL  = "https://checkout.square.site/merchant/MLZ656EDF17D3/checkout/IHXYUZ75LWCKBIOPBYCSWNMF";
  const handleDonate = () => window.open(DONATE_URL, "_blank", "noopener,noreferrer");

  /* Fetch Instagram post IDs */
  useEffect(() => {
    fetch("/api/instagram-latest")
      .then((r) => r.json())
      .then((d) => { setIgPostId(d.postId ?? null); setIgLoading(false); })
      .catch(() => setIgLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/instagram-post-2")
      .then((r) => r.json())
      .then((d) => { setIgPostId2(d.postId ?? null); setIgLoading2(false); })
      .catch(() => setIgLoading2(false));
  }, []);

  /* Scroll setup */
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = prev; };
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "auto", block: "start" });
      history.replaceState(null, "", location.pathname + location.search);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, []);

  const stats = useMemo(() => [
    { label: "Expected Attendees", value: "500+" },
    { label: "Communities",        value: "12+"  },
    { label: "Days of Festivities",value: "7"    },
  ], []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-[#011a14] to-black text-zinc-50">

      {/* ══ HEADER ══ */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-emerald-950/80 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">

          {/* Logo */}
          <NavLink href="#home" className="flex items-center gap-2.5 shrink-0 min-w-0">
            <div className="h-9 w-9 rounded-2xl bg-white/10 grid place-content-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
                <path d="M12 2C7 2 3 6 3 11c0 4 3 7 7 7v4l4-4c4 0 7-3 7-7 0-5-4-9-9-9Z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-amber-300/90 truncate">
                28th Harari Sport &amp; Cultural Festival
              </p>
              <p className="font-bold text-white leading-tight text-sm sm:text-base">KUBA 2026 · Memphis</p>
            </div>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-5">
            {(["#schedule","#about","#travel","#contact"] as const).map(href => (
              <NavLink key={href} href={href}
                className="text-sm font-semibold text-white/80 hover:text-white transition-colors relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded px-1 py-0.5">
                {href.slice(1).charAt(0).toUpperCase() + href.slice(2)}
                <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-amber-400 rounded-full group-hover:w-full transition-all duration-200" />
              </NavLink>
            ))}
            <div className="hidden lg:flex flex-col items-center gap-0.5">
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-sm" asChild>
                <a href="/register">Sports Registration</a>
              </Button>
              <p className="flex items-center gap-1 text-[10px] font-bold text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                Closes May 19!
              </p>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-sm hidden lg:inline-flex" asChild>
              <NavLink href="#social">Get Updates</NavLink>
            </Button>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Button onClick={handleDonate}
              className="bg-amber-400 text-emerald-950 hover:bg-amber-300 rounded-2xl font-bold text-sm shadow-lg shadow-amber-400/20 transition-all px-3 sm:px-4">
              Donate
            </Button>
            <Button variant="ghost" className="md:hidden text-white hover:bg-white/10 p-2"
              onClick={() => setOpen(true)} aria-label="Open Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* ══ MOBILE DRAWER ══ */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-72 sm:w-80 bg-[#011a14] border-l border-white/10 p-6 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <p className="font-bold text-white text-lg">Menu</p>
              <Button variant="ghost" onClick={() => setOpen(false)} aria-label="Close" className="text-white hover:bg-white/10 p-2">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-col gap-5 flex-1">
              {[["#schedule","Schedule"],["#about","About KUBA"],["#travel","Travel & Venue"],["#contact","Contact"],["/register","Sports Registration"]].map(([href, label]) => (
                <div key={href} className="border-b border-white/5 pb-4">
                  <NavLink href={href} onClick={() => setOpen(false)}
                    className="text-base font-semibold text-white/85 hover:text-amber-300 transition-colors">
                    {label}
                  </NavLink>
                  {href === "/register" && (
                    <p className="flex items-center gap-1.5 mt-1 text-xs font-bold text-red-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                      Registration closes May 19!
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
              <Button onClick={handleDonate}
                className="w-full rounded-2xl bg-amber-400 text-emerald-950 hover:bg-amber-300 font-bold">
                Donate
              </Button>
              <Button asChild className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white">
                <NavLink href="#social" onClick={() => setOpen(false)}>Get Updates</NavLink>
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ══ HERO ══ */}
      <section id="home" className="relative overflow-hidden min-h-[90svh] sm:min-h-screen flex items-center">
        <BackgroundAlbum
          images={["/album/hscf_97.jpg","/album/team_pic1.jpg","/album/Ziwariqa26.jpg","/album/culture.jpg","/album/wash_team.jpg","/album/BirtukanGrad-702.jpg","/album/image_3.jpg"]}
          interval={5000} resumeAfter={8000}
        />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid md:grid-cols-2 items-stretch gap-6 md:gap-10">

          {/* Left: intro panel */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="rounded-3xl bg-black/40 backdrop-blur-xl border border-white/20 p-6 sm:p-8 shadow-2xl flex flex-col">
            <Badge className={`self-start mb-4 px-3 py-1 rounded-full text-sm font-semibold border ${
              liveNow ? "bg-red-600 text-white border-red-400 animate-pulse"
                      : "bg-amber-400/15 text-amber-200 border-amber-300/35"}`}>
              {liveNow ? "LIVE NOW" : "Coming Soon"}
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
              <span className="kuba-hero-title">KUBA 2026</span>
              <span className="block text-amber-300 mt-1 text-2xl sm:text-3xl md:text-4xl font-bold">Memphis, Tennessee</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed">
              Celebrate unity, heritage, and community with a week of sports, music, food, and cultural showcases.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { icon: CalendarDays, text: "June 29 – July 5" },
                { icon: MapPin,       text: "Memphis, TN"       },
                { icon: Users,        text: "Harari Community"  },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 text-sm text-white/90 border border-white/10">
                  <Icon className="h-3.5 w-3.5 text-amber-300 shrink-0" /> {text}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button className="rounded-2xl bg-amber-400 text-emerald-950 hover:bg-amber-300 font-bold shadow-lg shadow-amber-400/20" asChild>
                <NavLink href="#contact">Get Notified</NavLink>
              </Button>
              <Button variant="outline" className="rounded-2xl border-white/25 bg-white/10 text-white hover:bg-white/20" asChild>
                <NavLink href="#about">Learn More</NavLink>
              </Button>
            </div>
          </motion.div>

          {/* Right: countdown + donation + stats */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }}
            className="flex flex-col gap-4 sm:gap-5">

            {/* Countdown */}
            <div className="rounded-3xl bg-black/40 backdrop-blur-xl border border-white/20 p-5 sm:p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="h-4 w-4 text-amber-300 shrink-0" />
                <span className="font-semibold text-white text-sm sm:text-base">
                  {liveNow ? "Today's Festival Schedule"
                    : (days === 0 && hours === 0 && minutes === 0 && seconds === 0) ? "Festival Started"
                    : "Countdown to June 29, 2026"}
                </span>
              </div>
              {liveNow || (days === 0 && hours === 0 && minutes === 0 && seconds === 0) ? (
                <div className="text-center py-2">
                  <p className="text-5xl font-extrabold text-amber-300 mb-1">Day {festivalDay || 1}</p>
                  <p className="text-white/70 text-sm">Scroll down to view today&apos;s schedule.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {[{label:"Days",value:days},{label:"Hrs",value:hours},{label:"Min",value:minutes},{label:"Sec",value:seconds}].map(({ label, value }) => (
                      <div key={label} className="rounded-2xl bg-black/50 border border-white/15 p-2.5 sm:p-3 text-center countdown-glow">
                        <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold tabular-nums text-white">{value.toString().padStart(2, "0")}</p>
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-white/55 mt-1">{label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-white/50 text-center">June 29 – July 5, 2026 · Memphis</p>
                </>
              )}
            </div>

            {/* Donation */}
            <div className="rounded-3xl bg-black/40 backdrop-blur-xl border border-white/20 p-5 sm:p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <HandHeart className="h-4 w-4 text-amber-300 shrink-0" />
                <span className="font-semibold text-white">Support KUBA 2026</span>
              </div>
              <p className="text-sm text-white/75 mb-4 leading-relaxed">
                Help fund rentals, programs, hospitality, and the week-long celebration.
              </p>
              <Button onClick={handleDonate}
                className="w-full rounded-2xl bg-amber-400 text-emerald-950 hover:bg-amber-300 font-bold shadow-lg shadow-amber-400/20 transition-all">
                Donate Now
              </Button>
              <p className="text-xs text-white/40 mt-2 text-center">Secure checkout · powered by Square</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {stats.map(s => (
                <div key={s.label} className="rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 p-3 sm:p-4 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-amber-300">{s.value}</p>
                  <p className="text-[10px] sm:text-xs text-white/65 mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ SCHEDULE ══ */}
      <section id="schedule" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <SectionHeading icon={CalendarDays} title="Schedule" />
        <p className="text-sm text-white/50 mb-8 ml-12">
          <span className="text-white/70 font-medium">*NOTE*</span> Locations will be announced as the final date approaches.
        </p>

        <Tabs defaultValue={festivalDay ? `day${festivalDay}` : "day1"} className="w-full">
          {/* Horizontally scrollable tabs on mobile */}
          <div className="overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
            <TabsList className="flex gap-1 bg-emerald-950/70 border border-white/10 rounded-2xl p-1.5 w-max min-w-full">
              {SCHEDULE.map(({ key, date }, i) => (
                <TabsTrigger key={key} value={key}
                  className="shrink-0 flex-1 min-w-[4.5rem] flex flex-col items-center gap-0.5 px-2 sm:px-3 py-2 rounded-xl
                    text-white/60 font-semibold transition-all duration-200
                    data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                  <span className="text-xs sm:text-sm">Day {i + 1}</span>
                  <span className="text-[9px] sm:text-[10px] font-normal opacity-75 hidden sm:block">{date.split(" · ")[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Timeline content */}
          {SCHEDULE.map(({ key, date, items }) => (
            <TabsContent key={key} value={key} className="mt-8">
              {/* Day header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-emerald-700/60 to-transparent" />
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-300/80 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                  {date}
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-emerald-700/60 to-transparent" />
              </div>

              {/* Vertical timeline */}
              <div className="relative max-w-2xl mx-auto">
                {/* Connecting line */}
                {items.length > 1 && (
                  <div className="absolute left-5 top-12 bottom-12 w-px bg-gradient-to-b from-emerald-600/50 via-emerald-700/30 to-transparent" />
                )}
                <div className="space-y-4">
                  {items.map(({ time, title, icon: Icon }) => (
                    <div key={title} className="flex gap-4 group">
                      {/* Icon circle on the timeline */}
                      <div className="relative z-10 shrink-0 h-10 w-10 rounded-full
                        bg-emerald-900/80 border border-emerald-700/50 shadow-lg
                        grid place-items-center
                        group-hover:border-amber-400/60 group-hover:bg-amber-400/10
                        transition-all duration-200">
                        <Icon className="h-4 w-4 text-amber-300" />
                      </div>
                      {/* Event card */}
                      <div className="flex-1 rounded-2xl bg-emerald-900/35 border border-white/10 p-4 sm:p-5
                        group-hover:border-amber-400/25 group-hover:-translate-y-0.5
                        group-hover:shadow-xl group-hover:shadow-emerald-900/40
                        transition-all duration-200">
                        <p className="font-semibold text-white text-base leading-snug">{title}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Clock className="h-3 w-3 text-amber-400/70 shrink-0" />
                          <p className="text-sm text-amber-300/80 font-medium">{time}</p>
                        </div>
                        <p className="text-xs text-white/40 mt-0.5">Memphis, TN</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* ══ SOCIAL FEED ══ */}
      <section id="social" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <SectionHeading icon={Instagram} title="Follow Along" />
        <p className="text-white/50 text-sm mb-8 ml-12">Latest from our social channels.</p>

        <div className="grid md:grid-cols-2 gap-6 items-start">

          {/* ── Instagram post 2 ─────────────────────────────────────────────── */}
          <div className="rounded-2xl overflow-hidden border border-pink-500/20"
            style={{ background: "linear-gradient(135deg, #1a0a25 0%, #250a1a 55%, #1a0d07 100%)" }}>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-pink-500/15">
              <div className="h-9 w-9 rounded-xl grid place-items-center shrink-0"
                style={{ background: "linear-gradient(135deg, #9333ea, #ec4899, #f97316)" }}>
                <Instagram className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm leading-tight">Instagram</p>
                <p className="text-xs text-white/50">Featured post</p>
              </div>
              <a href="https://www.instagram.com/memphiskuba2026/"
                target="_blank" rel="noopener noreferrer"
                className="shrink-0 text-xs font-semibold text-pink-400 hover:text-pink-300 transition-colors bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-full">
                Open ↗
              </a>
            </div>
            {/* Embed / states */}
            <div className="p-4 flex justify-center">
              {igLoading2 ? (
                <div className="rounded-xl bg-white/5 border border-white/10 animate-pulse"
                  style={{ width: 340, height: 600 }} />
              ) : igPostId2 ? (
                <iframe
                  src={`https://www.instagram.com/p/${igPostId2}/embed/`}
                  width={340}
                  height={600}
                  style={{ border: "none", borderRadius: "12px", display: "block", flexShrink: 0 }}
                  scrolling="no"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-storage-access-by-user-activation"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              ) : (
                <div className="w-full rounded-xl bg-white/5 border border-white/10 p-6 text-center flex flex-col items-center justify-center gap-4"
                  style={{ minHeight: 300 }}>
                  <div className="h-12 w-12 rounded-2xl grid place-items-center"
                    style={{ background: "linear-gradient(135deg,#9333ea,#ec4899,#f97316)" }}>
                    <Instagram className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">@memphiskuba2026</p>
                    <p className="text-white/50 text-xs mt-1 max-w-[220px] mx-auto leading-relaxed">
                      Set <code className="text-pink-300 bg-white/10 px-1 py-0.5 rounded text-[10px]">INSTAGRAM_POST_2</code> in your Vercel env vars to show a featured post here.
                    </p>
                  </div>
                  <Button asChild className="rounded-2xl font-semibold text-white hover:opacity-90 transition-all text-sm"
                    style={{ background: "linear-gradient(135deg,#9333ea,#ec4899,#f97316)" }}>
                    <a href="https://www.instagram.com/memphiskuba2026/" target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-3.5 w-3.5" /> View on Instagram
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* ── Instagram most recent post embed ────────────────────────────── */}
          <div className="rounded-2xl overflow-hidden border border-pink-500/20"
            style={{ background: "linear-gradient(135deg, #1a0a25 0%, #250a1a 55%, #1a0d07 100%)" }}>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-pink-500/15">
              <div className="h-9 w-9 rounded-xl grid place-items-center shrink-0"
                style={{ background: "linear-gradient(135deg, #9333ea, #ec4899, #f97316)" }}>
                <Instagram className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm leading-tight">Instagram</p>
                <p className="text-xs text-white/50">Most recent post</p>
              </div>
              <a href="https://www.instagram.com/memphiskuba2026/"
                target="_blank" rel="noopener noreferrer"
                className="shrink-0 text-xs font-semibold text-pink-400 hover:text-pink-300 transition-colors bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-full">
                Open ↗
              </a>
            </div>

            {/* Embed / states */}
            <div className="p-4 flex justify-center">
              {igLoading ? (
                /* Pulse skeleton matching the embed height */
                <div className="rounded-xl bg-white/5 border border-white/10 animate-pulse"
                  style={{ width: 340, height: 600 }} />
              ) : igPostId ? (
                /* Live official Instagram embed — same dimensions as Facebook card */
                <iframe
                  src={`https://www.instagram.com/p/${igPostId}/embed/`}
                  width={340}
                  height={600}
                  style={{ border: "none", borderRadius: "12px", display: "block", flexShrink: 0 }}
                  scrolling="no"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-storage-access-by-user-activation"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              ) : (
                /* Shown only if INSTAGRAM_LATEST_POST env var is not set in Vercel */
                <div className="w-full rounded-xl bg-white/5 border border-white/10 p-6 text-center flex flex-col items-center justify-center gap-4"
                  style={{ minHeight: 300 }}>
                  <div className="h-12 w-12 rounded-2xl grid place-items-center"
                    style={{ background: "linear-gradient(135deg,#9333ea,#ec4899,#f97316)" }}>
                    <Instagram className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">@memphiskuba2026</p>
                    <p className="text-white/50 text-xs mt-1 max-w-[220px] mx-auto leading-relaxed">
                      Set <code className="text-pink-300 bg-white/10 px-1 py-0.5 rounded text-[10px]">INSTAGRAM_LATEST_POST</code> in your Vercel env vars to show the live embed here.
                    </p>
                  </div>
                  <Button asChild className="rounded-2xl font-semibold text-white hover:opacity-90 transition-all text-sm"
                    style={{ background: "linear-gradient(135deg,#9333ea,#ec4899,#f97316)" }}>
                    <a href="https://www.instagram.com/memphiskuba2026/" target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-3.5 w-3.5" /> View on Instagram
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section id="about" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        {/* Ambient glow behind this section */}
        <div className="relative">
          <div className="absolute -inset-x-20 -inset-y-10 bg-emerald-900/10 rounded-3xl blur-3xl -z-10" />

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left: description + features */}
            <div className="lg:col-span-3">
              <SectionHeading icon={Users} title="What is KUBA?" />
              <p className="text-white/80 leading-relaxed mt-4 ml-0 text-sm sm:text-base">
                KUBA (the Harari Sport &amp; Cultural Festival) is an annual gathering of the global Harari community
                featuring sports tournaments, cultural showcases, music, fashion, food, and family-friendly programming.
                It celebrates Harari heritage and unity while welcoming friends and neighbors from all backgrounds.
                Inshallah, Memphis will proudly host the 28th KUBA from June 29 – July 5, 2026.
              </p>

              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                {[
                  { icon: Users,         title: "Family-Friendly",        desc: "Youth clinics, storytelling, and kid-friendly events all week." },
                  { icon: Star,          title: "Cultural Showcase",       desc: "Traditional music, dance, fashion, and language sessions." },
                  { icon: HeartHandshake,title: "Community & Networking",  desc: "Connect with Harari families and organizations from across America." },
                  { icon: Footprints,    title: "Sports & Awards",         desc: "Competitive soccer, basketball tournaments, and more." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title}
                    className="rounded-2xl bg-emerald-900/30 border border-white/10 p-4
                      hover:-translate-y-0.5 hover:border-amber-400/25 hover:shadow-lg hover:shadow-emerald-900/40
                      transition-all duration-200 group">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="h-7 w-7 rounded-lg bg-amber-400/15 border border-amber-400/20 grid place-items-center shrink-0">
                        <Icon className="h-3.5 w-3.5 text-amber-300" />
                      </div>
                      <p className="font-semibold text-white text-sm">{title}</p>
                    </div>
                    <p className="text-sm text-white/65 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: key info */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-emerald-900/30 border border-white/10 p-5 sm:p-6">
                <p className="font-bold text-white text-base mb-4 flex items-center gap-2">
                  <span className="h-1.5 w-5 rounded-full bg-amber-400 inline-block" />
                  Key Info
                </p>
                <div className="grid gap-3 text-sm">
                  {[
                    { icon: CalendarDays,   text: "When: June 29 – July 5, 2026"                     },
                    { icon: MapPin,         text: "Where: Memphis, TN (venue & hotels TBA)"           },
                    { icon: Users,          text: "Who: Open to all — Harari heritage celebrated"     },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <Icon className="h-4 w-4 text-amber-300 mt-0.5 shrink-0" />
                      <span className="text-white/80">{text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-5 flex flex-col gap-2">
                  <Button className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold" asChild>
                    <a href="/register">Register for Sports</a>
                  </Button>
                  <p className="flex items-center justify-center gap-1.5 text-xs font-bold text-red-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                    Registration closes May 19!
                  </p>
                  <Button onClick={handleDonate}
                    className="w-full rounded-2xl bg-amber-400 text-emerald-950 hover:bg-amber-300 font-bold">
                    Donate to Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TRAVEL & VENUE ══ */}
      <section id="travel" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <SectionHeading icon={MapPin} title="Travel & Venue" />
        <p className="text-white/50 text-sm mb-8 ml-12">Everything you need to plan your trip to Memphis.</p>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* Getting here */}
          <div className="rounded-2xl bg-emerald-900/30 border border-white/10 p-5 sm:p-6">
            <p className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="h-1.5 w-5 rounded-full bg-amber-400 inline-block" />
              Getting to Memphis
            </p>
            <div className="text-white/80 text-sm grid gap-4">
              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 grid place-items-center shrink-0 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-amber-300" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm mb-0.5">Masajid</p>
                  <p className="text-white/65 text-sm">Memphis Islamic Center · Midtown Mosque · Masjid al-Rahman</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 grid place-items-center shrink-0 mt-0.5">
                  <BriefcaseBusiness className="h-3.5 w-3.5 text-amber-300" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm mb-0.5">Hotels</p>
                  <p className="text-white/65 text-sm">To be announced — check back soon.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 grid place-items-center shrink-0 mt-0.5">
                  <UtensilsCrossed className="h-3.5 w-3.5 text-amber-300" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm mb-0.5">Halal Food &amp; Coffee</p>
                  <a href="https://www.google.com/maps/d/u/0/viewer?mid=1jIl3kd9BTMa3HDpAfoI_n_eGs5cqesTQ&ll=35.14770656054214%2C-89.85940621849579&z=11"
                    target="_blank" rel="noopener noreferrer"
                    className="text-amber-300 underline hover:text-amber-200 transition-colors">
                    View on Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="rounded-2xl bg-emerald-900/30 border border-white/10 p-5 sm:p-6">
            <p className="font-bold text-white mb-4 flex items-center gap-2">
              <span className="h-1.5 w-5 rounded-full bg-amber-400 inline-block" />
              Venue Map
            </p>
            <div className="aspect-video w-full rounded-xl bg-emerald-950/60 border border-white/5 grid place-items-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-amber-300/40 mx-auto mb-2" />
                <p className="text-sm text-white/45">Interactive map coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <p className="font-bold text-white text-xl mb-4">FAQ</p>
          <Accordion type="single" collapsible
            className="bg-emerald-900/30 rounded-2xl border border-white/10 overflow-hidden">
            {[
              { value: "q1", q: "Is this event open to everyone?",
                a: "Yes. While KUBA celebrates Harari heritage, all respectful attendees are warmly welcome." },
              { value: "q2", q: "Are the schedule items final?",
                a: "No. The schedule shown is a preview — final times and locations will be confirmed closer to festival week." },
              { value: "q3", q: "Is there a registration fee?",
                a: "Details on fees and registration will be announced closer to the event. Sports registration is now open until May 19th." },
            ].map(({ value, q, a }) => (
              <AccordionItem key={value} value={value} className="border-white/10">
                <AccordionTrigger className="px-5 sm:px-6 py-4 text-white hover:text-amber-300 hover:no-underline font-medium text-left text-sm sm:text-base transition-colors">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="px-5 sm:px-6 pb-4 pt-0 text-white/65 text-sm leading-relaxed">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <SectionHeading icon={Mail} title="Contact" />
        <p className="text-white/50 text-sm mb-8 ml-12">Get in touch or follow us for updates.</p>

        <div className="grid sm:grid-cols-3 gap-4">
          {/* Email card */}
          <div className="sm:col-span-3 md:col-span-1 rounded-2xl bg-emerald-900/30 border border-white/10 p-5 sm:p-6 flex flex-col gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-400/15 border border-amber-400/20 grid place-items-center">
              <Mail className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <p className="font-semibold text-white">Email Us</p>
              <p className="text-white/55 text-sm mt-0.5">For general inquiries and information</p>
            </div>
            <a href="mailto:contact@kuba2026.org"
              className="text-amber-300 font-medium hover:text-amber-200 transition-colors text-sm">
              contact@kuba2026.org →
            </a>
          </div>

          {/* Instagram card */}
          <div className="rounded-2xl bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-white/10 p-5 sm:p-6 flex flex-col gap-3 hover:border-pink-400/30 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
            <div className="h-10 w-10 rounded-xl bg-pink-500/15 border border-pink-400/20 grid place-items-center">
              <Instagram className="h-5 w-5 text-pink-300" />
            </div>
            <div>
              <p className="font-semibold text-white">Instagram</p>
              <p className="text-white/55 text-sm mt-0.5">Photos, updates &amp; stories</p>
            </div>
            <a href="https://www.instagram.com/memphiskuba2026/" target="_blank" rel="noopener noreferrer"
              className="text-pink-300 font-medium hover:text-pink-200 transition-colors text-sm">
              @memphiskuba2026 →
            </a>
          </div>

          {/* Facebook card */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-900/30 to-blue-950/20 border border-white/10 p-5 sm:p-6 flex flex-col gap-3 hover:border-blue-400/30 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
            <div className="h-10 w-10 rounded-xl bg-blue-500/15 border border-blue-400/20 grid place-items-center">
              <Facebook className="h-5 w-5 text-blue-300" />
            </div>
            <div>
              <p className="font-semibold text-white">Facebook</p>
              <p className="text-white/55 text-sm mt-0.5">Events, announcements &amp; community</p>
            </div>
            <a href="https://www.facebook.com/profile.php?id=61574823466873" target="_blank" rel="noopener noreferrer"
              className="text-blue-300 font-medium hover:text-blue-200 transition-colors text-sm">
              Memphis Harari Community →
            </a>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-white/10 bg-black/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-2 md:grid-cols-3 gap-8 text-sm text-white/60">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-xl bg-white/10 grid place-content-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-white">
                  <path d="M12 2C7 2 3 6 3 11c0 4 3 7 7 7v4l4-4c4 0 7-3 7-7 0-5-4-9-9-9Z" />
                </svg>
              </div>
              <p className="font-bold text-white">KUBA 2026 · Memphis</p>
            </div>
            <p className="text-white/50">2026 Memphis Harari Co. All rights reserved.</p>
            <p className="mt-1 text-xs text-white/35">Details subject to change.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Quick Links</p>
            <ul className="grid gap-2">
              {[["#schedule","Schedule"],["#about","About"],["#travel","Travel & Venue"],["#contact","Contact"],["/register","Sports Registration"]].map(([href, label]) => (
                <li key={href}>
                  <NavLink href={href} className="hover:text-white hover:underline transition-colors">{label}</NavLink>
                </li>
              ))}
              <li>
                <button onClick={handleDonate} className="hover:text-amber-300 hover:underline transition-colors text-left">
                  Donate
                </button>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Accessibility &amp; Conduct</p>
            <ul className="grid gap-2 text-white/55">
              <li>Accessible seating &amp; family rooms planned</li>
              <li>Zero-tolerance harassment policy</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
