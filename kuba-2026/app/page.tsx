"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/lib/useTheme";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays, MapPin, Instagram, Facebook,
  Menu, X, Users, HandHeart, Mail, Sun, Moon,
  PartyPopper, Footprints, HeartHandshake, Star, Dribbble, UtensilsCrossed,
} from "lucide-react";

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
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/55 via-blue-950/70 to-black/92" />
      <div className="absolute inset-0 dot-grid" />
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
      <div className="h-9 w-9 rounded-xl bg-blue-100 border border-blue-200 dark:bg-amber-400/15 dark:border-amber-400/25 grid place-items-center shrink-0">
        <Icon className="h-4 w-4 text-blue-600 dark:text-amber-300" />
      </div>
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">{title}</h2>
    </div>
  );
}

/* ─── Highlights data ─── */
const HIGHLIGHTS = [
  { icon: Users,           day: "Day 1 · Jun 29", title: "Opening Ceremony",    desc: "The 28th annual festival kicked off at Cordova High with the community coming together." },
  { icon: Footprints,      day: "Day 1 · Jun 29", title: "Soccer Kickoff",      desc: "Teams from across the country took to the field for the start of the tournament." },
  { icon: Dribbble,        day: "Day 2 · Jun 30", title: "Basketball Round 1",  desc: "Packed courts and intense competition as teams battled in the opening basketball rounds." },
  { icon: Star,            day: "Day 2 · Jun 30", title: "Mawlud Night",        desc: "A beautiful evening of spiritual reflection and community gathering." },
  { icon: HeartHandshake,  day: "Day 3 · Jul 1",  title: "Harari Day Ceremony", desc: "A celebration of Harari heritage, culture, and tradition at Cordova High." },
  { icon: UtensilsCrossed, day: "Day 4 · Jul 2",  title: "Ziwariqa",            desc: "An unforgettable outdoor feast at Shelby Farms Park — food, family, and sunshine." },
  { icon: Footprints,      day: "Day 4 · Jul 2",  title: "Soccer Finals",       desc: "The tournament crowned its champions in an electric final match." },
  { icon: PartyPopper,     day: "Day 5 · Jul 3",  title: "Family Night",        desc: "An evening of fun, laughter, and togetherness at The Esplanade." },
  { icon: Dribbble,        day: "Day 6 · Jul 4",  title: "Basketball Finals",   desc: "Champions were crowned on Independence Day at Cordova High." },
  { icon: PartyPopper,     day: "Day 6 · Jul 4",  title: "Gala Night",          desc: "The festival closed in style — music, dancing, and memories that will last forever." },
];

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function KubaMemphisSite() {
  const [open, setOpen] = useState(false);
  const { isDark, toggle: toggleTheme } = useTheme();
  const [igPostId, setIgPostId]   = useState<string | null>(null);
  const [igLoading, setIgLoading] = useState(true);
  const [igPostId2, setIgPostId2]   = useState<string | null>(null);
  const [igLoading2, setIgLoading2] = useState(true);

  const DONATE_URL  = "https://checkout.square.site/merchant/MLZ656EDF17D3/checkout/IHXYUZ75LWCKBIOPBYCSWNMF";
  const handleDonate = () => window.open(DONATE_URL, "_blank", "noopener,noreferrer");

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
    { label: "Attendees",          value: "500+" },
    { label: "Communities",        value: "12+"  },
    { label: "Days of Festivities",value: "6"    },
    { label: "Years Running",      value: "28"   },
  ], []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-gradient-to-b dark:from-blue-950 dark:via-[#060d1f] dark:to-black dark:text-zinc-50">

      {/* ══ ANNOUNCEMENT STRIP ══ */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-2.5 text-center">
          <p className="text-sm font-extrabold uppercase tracking-widest">
            KUBA 2026 Memphis is a wrap — See you in Los Angeles 2027!
          </p>
        </div>
      </div>

      {/* ══ HEADER ══ */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 border-b border-slate-200 shadow-sm dark:bg-blue-950/80 dark:border-white/10 dark:shadow-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <NavLink href="/" className="flex items-center gap-2.5 shrink-0 min-w-0">
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
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-5">
            {([["#highlights","Highlights"],["#contact","Contact"]] as const).map(([href, label]) => (
              <NavLink key={href} href={href}
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-white/80 dark:hover:text-white transition-colors relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded px-1 py-0.5">
                {label}
                <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-blue-600 dark:bg-amber-400 rounded-full group-hover:w-full transition-all duration-200" />
              </NavLink>
            ))}
            {([["About","/about"]] as const).map(([label, href]) => (
              <a key={href} href={href}
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-white/80 dark:hover:text-white transition-colors relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded px-1 py-0.5">
                {label}
                <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-blue-600 dark:bg-amber-400 rounded-full group-hover:w-full transition-all duration-200" />
              </a>
            ))}
            <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm hidden lg:inline-flex" asChild>
              <NavLink href="#social">Follow Along</NavLink>
            </Button>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" onClick={toggleTheme} aria-label="Toggle theme"
              className="text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 p-2 rounded-xl">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button onClick={handleDonate}
              className="hidden md:inline-flex bg-amber-500 text-white hover:bg-amber-400 dark:bg-amber-400 dark:text-blue-950 dark:hover:bg-amber-300 rounded-2xl font-bold text-sm shadow-lg shadow-amber-400/20 transition-all px-3 sm:px-4">
              Donate
            </Button>
            <Button variant="ghost" className="md:hidden text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 p-2"
              onClick={() => setOpen(true)} aria-label="Open Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* ══ MOBILE DRAWER ══ */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-slate-900/30 dark:bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-72 sm:w-80 bg-white dark:bg-[#060d1f] border-l border-slate-200 dark:border-white/10 p-6 flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <p className="font-bold text-slate-900 dark:text-white text-lg">Menu</p>
              <Button variant="ghost" onClick={() => setOpen(false)} aria-label="Close" className="text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 p-2">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-col gap-5 flex-1">
              {[["#highlights","Highlights"],["#contact","Contact"],["/about","About KUBA"]].map(([href, label]) => (
                <div key={href} className="border-b border-slate-100 dark:border-white/5 pb-4">
                  <NavLink href={href} onClick={() => setOpen(false)}
                    className="text-base font-semibold text-slate-700 hover:text-blue-600 dark:text-white/85 dark:hover:text-amber-300 transition-colors">
                    {label}
                  </NavLink>
                </div>
              ))}
              <button onClick={toggleTheme}
                className="flex items-center gap-3 text-base font-semibold text-slate-700 dark:text-white/85 hover:text-blue-600 dark:hover:text-amber-300 transition-colors">
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDark ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
            <div className="flex flex-col gap-3 pt-6 border-t border-slate-200 dark:border-white/10">
              <Button onClick={() => { handleDonate(); setOpen(false); }}
                className="w-full rounded-2xl bg-amber-500 text-white hover:bg-amber-400 dark:bg-amber-400 dark:text-blue-950 dark:hover:bg-amber-300 font-bold">
                Donate
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

          {/* Left: thank you panel */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="rounded-3xl bg-white/92 backdrop-blur-xl border border-white/60 dark:bg-black/40 dark:border-white/20 p-6 sm:p-8 shadow-2xl flex flex-col">
            <Badge className="self-start mb-4 px-3 py-1 rounded-full text-sm font-semibold border bg-blue-100 text-blue-700 border-blue-300 dark:bg-amber-400/15 dark:text-amber-200 dark:border-amber-300/35">
              It&apos;s a Wrap · Memphis 2026
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
              <span className="kuba-hero-title">KUBA 2026</span>
              <span className="block text-blue-700 dark:text-amber-300 mt-1 text-2xl sm:text-3xl md:text-4xl font-bold">Memphis, Tennessee</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-700 dark:text-white/85 leading-relaxed">
              Six incredible days of sports, culture, music, food, and community. Thank you Memphis — and thank you to everyone who made the 28th Harari Sport &amp; Cultural Festival unforgettable.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { icon: CalendarDays, text: "June 29 – July 4, 2026" },
                { icon: MapPin,       text: "Memphis, TN"            },
                { icon: Users,        text: "28th Annual Festival"   },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-white/10 rounded-full px-3 py-1.5 text-sm text-slate-700 dark:text-white/90 border border-slate-200 dark:border-white/10">
                  <Icon className="h-3.5 w-3.5 text-blue-600 dark:text-amber-300 shrink-0" /> {text}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="outline" className="rounded-2xl border-blue-300 bg-white text-blue-700 hover:bg-blue-50 dark:border-blue-400/40 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20" asChild>
                <NavLink href="#highlights">See Highlights</NavLink>
              </Button>
              <Button variant="outline" className="rounded-2xl border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/25 dark:bg-white/10 dark:text-white dark:hover:bg-white/20" asChild>
                <NavLink href="#social">Follow Us</NavLink>
              </Button>
            </div>
          </motion.div>

          {/* Right: KUBA 2027 + stats */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }}
            className="flex flex-col gap-4 sm:gap-5">

            {/* KUBA 2027 teaser */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-950 border border-blue-500/40 dark:border-blue-500/20 p-5 sm:p-6 shadow-2xl text-white">
              <p className="text-xs font-extrabold uppercase tracking-widest text-blue-200 dark:text-amber-300/80 mb-2">Coming Next</p>
              <p className="text-3xl sm:text-4xl font-extrabold leading-tight">KUBA 2027</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-200 dark:text-amber-200 mt-1">Los Angeles, California</p>
              <p className="mt-3 text-sm text-blue-100/80 leading-relaxed">
                The 29th Harari Sport &amp; Cultural Festival is heading to LA. Stay connected for dates and details.
              </p>
              <Button onClick={handleDonate}
                className="mt-4 w-full rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg transition-all">
                Support KUBA 2027
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {stats.map(s => (
                <div key={s.label} className="rounded-2xl bg-white/92 backdrop-blur-md border border-white/60 dark:bg-black/40 dark:border-white/15 p-3 sm:p-4 text-center shadow-lg">
                  <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-300">{s.value}</p>
                  <p className="text-[10px] sm:text-xs text-slate-600 dark:text-white/65 mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ HIGHLIGHTS ══ */}
      <section id="highlights" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <SectionHeading icon={PartyPopper} title="KUBA 2026 Highlights" />
        <p className="text-sm text-slate-500 dark:text-white/50 mb-10 ml-12">
          Six days. Ten events. One unforgettable festival.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {HIGHLIGHTS.map(({ icon: Icon, day, title, desc }) => (
            <div key={title}
              className="rounded-2xl bg-white dark:bg-blue-900/30 border border-slate-200 dark:border-white/10 p-5 shadow-sm
                hover:-translate-y-0.5 hover:border-blue-300 dark:hover:border-amber-400/25 hover:shadow-md transition-all duration-200 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-amber-400/10 border border-blue-200 dark:border-amber-400/20 grid place-items-center shrink-0">
                  <Icon className="h-4 w-4 text-blue-600 dark:text-amber-300" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{title}</p>
                  <p className="text-xs text-blue-600 dark:text-amber-300/80 font-medium mt-0.5">{day}</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-white/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ SOCIAL FEED ══ */}
      <section id="social" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <SectionHeading icon={Instagram} title="Follow Along" />
        <p className="text-slate-500 dark:text-white/50 text-sm mb-8 ml-12">Latest from our social channels.</p>

        <div className="grid md:grid-cols-2 gap-6 items-start">

          <div className="rounded-2xl overflow-hidden border border-pink-500/20"
            style={{ background: "linear-gradient(135deg, #1a0a25 0%, #250a1a 55%, #070d1a 100%)" }}>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-pink-500/15">
              <div className="h-9 w-9 rounded-xl grid place-items-center shrink-0"
                style={{ background: "linear-gradient(135deg, #9333ea, #ec4899, #f97316)" }}>
                <Instagram className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm leading-tight">Instagram</p>
                <p className="text-xs text-white/50">Featured post</p>
              </div>
              <a href="https://www.instagram.com/memphiskuba2026/" target="_blank" rel="noopener noreferrer"
                className="shrink-0 text-xs font-semibold text-pink-400 hover:text-pink-300 transition-colors bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-full">
                Open ↗
              </a>
            </div>
            <div className="p-4 flex justify-center">
              {igLoading2 ? (
                <div className="rounded-xl bg-white/5 border border-white/10 animate-pulse" style={{ width: 340, height: 600 }} />
              ) : igPostId2 ? (
                <iframe src={`https://www.instagram.com/p/${igPostId2}/embed/`} width={340} height={600}
                  style={{ border: "none", borderRadius: "12px", display: "block", flexShrink: 0 }}
                  scrolling="no"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-storage-access-by-user-activation"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" />
              ) : (
                <div className="w-full rounded-xl bg-white/5 border border-white/10 p-6 text-center flex flex-col items-center justify-center gap-4" style={{ minHeight: 300 }}>
                  <div className="h-12 w-12 rounded-2xl grid place-items-center" style={{ background: "linear-gradient(135deg,#9333ea,#ec4899,#f97316)" }}>
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

          <div className="rounded-2xl overflow-hidden border border-pink-500/20"
            style={{ background: "linear-gradient(135deg, #1a0a25 0%, #250a1a 55%, #070d1a 100%)" }}>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-pink-500/15">
              <div className="h-9 w-9 rounded-xl grid place-items-center shrink-0"
                style={{ background: "linear-gradient(135deg, #9333ea, #ec4899, #f97316)" }}>
                <Instagram className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm leading-tight">Instagram</p>
                <p className="text-xs text-white/50">Most recent post</p>
              </div>
              <a href="https://www.instagram.com/memphiskuba2026/" target="_blank" rel="noopener noreferrer"
                className="shrink-0 text-xs font-semibold text-pink-400 hover:text-pink-300 transition-colors bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-full">
                Open ↗
              </a>
            </div>
            <div className="p-4 flex justify-center">
              {igLoading ? (
                <div className="rounded-xl bg-white/5 border border-white/10 animate-pulse" style={{ width: 340, height: 600 }} />
              ) : igPostId ? (
                <iframe src={`https://www.instagram.com/p/${igPostId}/embed/`} width={340} height={600}
                  style={{ border: "none", borderRadius: "12px", display: "block", flexShrink: 0 }}
                  scrolling="no"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-storage-access-by-user-activation"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" />
              ) : (
                <div className="w-full rounded-xl bg-white/5 border border-white/10 p-6 text-center flex flex-col items-center justify-center gap-4" style={{ minHeight: 300 }}>
                  <div className="h-12 w-12 rounded-2xl grid place-items-center" style={{ background: "linear-gradient(135deg,#9333ea,#ec4899,#f97316)" }}>
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

      {/* ══ CONTACT ══ */}
      <section id="contact" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <SectionHeading icon={Mail} title="Contact" />
        <p className="text-slate-500 dark:text-white/50 text-sm mb-8 ml-12">Get in touch or follow us for updates.</p>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3 md:col-span-1 rounded-2xl bg-white dark:bg-blue-900/30 border border-slate-200 dark:border-white/10 p-5 sm:p-6 flex flex-col gap-3 shadow-sm dark:shadow-none">
            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-400/15 border border-blue-200 dark:border-blue-400/20 grid place-items-center">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Email Us</p>
              <p className="text-slate-500 dark:text-white/55 text-sm mt-0.5">For general inquiries and information</p>
            </div>
            <a href="mailto:memphiskuba@gmail.com"
              className="text-blue-600 dark:text-amber-300 font-medium hover:text-blue-700 dark:hover:text-amber-200 transition-colors text-sm">
              memphiskuba@gmail.com →
            </a>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/20 border border-pink-200 dark:border-white/10 p-5 sm:p-6 flex flex-col gap-3 hover:border-pink-300 dark:hover:border-pink-400/30 hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-lg transition-all duration-200 shadow-sm dark:shadow-none">
            <div className="h-10 w-10 rounded-xl bg-pink-100 dark:bg-pink-500/15 border border-pink-200 dark:border-pink-400/20 grid place-items-center">
              <Instagram className="h-5 w-5 text-pink-600 dark:text-pink-300" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Instagram</p>
              <p className="text-slate-500 dark:text-white/55 text-sm mt-0.5">Photos, updates &amp; stories</p>
            </div>
            <a href="https://www.instagram.com/memphiskuba2026/" target="_blank" rel="noopener noreferrer"
              className="text-pink-600 dark:text-pink-300 font-medium hover:text-pink-700 dark:hover:text-pink-200 transition-colors text-sm">
              @memphiskuba2026 →
            </a>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/30 dark:to-blue-950/20 border border-blue-200 dark:border-white/10 p-5 sm:p-6 flex flex-col gap-3 hover:border-blue-300 dark:hover:border-blue-400/30 hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-lg transition-all duration-200 shadow-sm dark:shadow-none">
            <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-400/20 grid place-items-center">
              <Facebook className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Facebook</p>
              <p className="text-slate-500 dark:text-white/55 text-sm mt-0.5">Events, announcements &amp; community</p>
            </div>
            <a href="https://www.facebook.com/profile.php?id=61574823466873" target="_blank" rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-300 font-medium hover:text-blue-700 dark:hover:text-blue-200 transition-colors text-sm">
              Memphis Harari Community →
            </a>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-black/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-2 md:grid-cols-3 gap-8 text-sm text-slate-500 dark:text-white/60">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-xl bg-blue-600 dark:bg-white/10 grid place-content-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-white">
                  <path d="M12 2C7 2 3 6 3 11c0 4 3 7 7 7v4l4-4c4 0 7-3 7-7 0-5-4-9-9-9Z" />
                </svg>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">KUBA 2026 · Memphis</p>
            </div>
            <p className="text-slate-500 dark:text-white/50">2026 Memphis Harari Co. All rights reserved.</p>
            <p className="mt-2 text-xs font-semibold text-blue-600 dark:text-amber-300">Next stop: Los Angeles 2027</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white mb-3">Quick Links</p>
            <ul className="grid gap-2">
              {[["#highlights","Highlights"],["#contact","Contact"],["/about","About KUBA"]].map(([href, label]) => (
                <li key={href}>
                  <NavLink href={href} className="hover:text-slate-900 dark:hover:text-white hover:underline transition-colors">{label}</NavLink>
                </li>
              ))}
              <li>
                <button onClick={handleDonate} className="hover:text-amber-600 dark:hover:text-amber-300 hover:underline transition-colors text-left">
                  Donate
                </button>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
