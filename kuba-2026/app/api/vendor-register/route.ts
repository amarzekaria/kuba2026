import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

const VENDOR_EMAIL = "memphiskuba@gmail.com";
const DAY_COST = 50;
const VALID_DAYS = new Set(["mon", "tue", "wed", "sat", "sun"]);

const DAY_LABELS: Record<string, string> = {
  mon: "Monday, June 29",
  tue: "Tuesday, June 30",
  wed: "Wednesday, July 1",
  sat: "Saturday, July 4",
  sun: "Sunday, July 5",
};

/* ── Rate limiter: max 5 submissions per IP per hour ── */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT    = 5;
const RATE_WINDOW   = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Purge expired entries to prevent unbounded memory growth
  for (const [key, val] of rateLimitMap) {
    if (now > val.resetAt) rateLimitMap.delete(key);
  }

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

/* ── Sanitize: strip HTML/script tags, control chars, trim, cap length ── */
function sanitize(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .replace(/<[^>]*>/g, "")                          // strip HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // strip control chars
    .replace(/javascript\s*:/gi, "")                   // strip JS protocol
    .replace(/data\s*:/gi, "")                         // strip data URIs
    .slice(0, maxLen);
}

/* ── HTML escape for email output ── */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ── Validators ── */
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const hasLetter = (s: string) => /[a-zA-Z]/.test(s);

function isValidPhone(s: string): boolean {
  // Must match allowed chars and contain at least 7 actual digits
  if (!/^[\d\s\-()+]{7,20}$/.test(s)) return false;
  return (s.match(/\d/g) ?? []).length >= 7;
}

export async function POST(req: NextRequest) {
  /* ── Content-Type guard ── */
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Invalid request." }, { status: 415 });
  }

  /* ── Rate limit by IP ── */
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  /* ── Parse body safely ── */
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;

  /* ── Sanitize all string inputs ── */
  const organization_name  = sanitize(raw.organization_name,  120);
  const contact_name       = sanitize(raw.contact_name,       100);
  const phone_number       = sanitize(raw.phone_number,        20);
  const email              = sanitize(raw.email,              254);
  const product_being_sold = sanitize(raw.product_being_sold, 200);
  const activity           = sanitize(raw.activity,           800); // 100 words ≈ 700 chars
  const notes              = sanitize(raw.notes,              500);

  /* ── Coerce booleans and arrays ── */
  const is_non_selling = raw.is_non_selling === true;
  const days = (Array.isArray(raw.days) ? raw.days : [])
    .filter((d): d is string => typeof d === "string" && VALID_DAYS.has(d))
    .slice(0, 5);

  /* ── Validate ── */
  if (organization_name.length < 3 || !hasLetter(organization_name))
    return NextResponse.json({ error: "Organization name must be at least 3 characters and contain letters." }, { status: 400 });

  if (contact_name.length < 3 || !hasLetter(contact_name))
    return NextResponse.json({ error: "Contact name must be at least 3 characters and contain letters." }, { status: 400 });

  if (!isValidPhone(phone_number))
    return NextResponse.json({ error: "A valid phone number is required." }, { status: 400 });

  if (!email || !EMAIL_RE.test(email))
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });

  if (!is_non_selling && (product_being_sold.length < 3 || !hasLetter(product_being_sold)))
    return NextResponse.json({ error: "Product description must be at least 3 characters and contain letters." }, { status: 400 });

  if (days.length === 0)
    return NextResponse.json({ error: "Select at least one day you plan to attend." }, { status: 400 });

  if (is_non_selling) {
    const wordCount = activity.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 5)
      return NextResponse.json({ error: "Please describe what you plan on doing (minimum 5 words)." }, { status: 400 });
    if (wordCount > 100)
      return NextResponse.json({ error: "Description is too long (maximum 100 words)." }, { status: 400 });
  }

  /* ── Recalculate total server-side — never trust client ── */
  const total_cost = is_non_selling ? 0 : days.length * DAY_COST;

  /* ── Save to Supabase ── */
  const { error: dbError } = await supabaseAdmin
    .from("vendor_registrations")
    .insert({
      organization_name,
      contact_name,
      phone_number,
      email,
      product_being_sold: product_being_sold || null,
      activity:           activity           || null,
      days,
      is_non_selling,
      total_cost,
      notes: notes || null,
    });

  if (dbError) {
    console.error("Supabase insert error:", dbError);
    return NextResponse.json({ error: "Failed to save registration. Please try again." }, { status: 500 });
  }

  /* ── Build readable day list (always show days, regardless of selling status) ── */
  const daysAttending = days.map((d) => DAY_LABELS[d] ?? d).join(", ");
  const chargeLabel   = is_non_selling
    ? "Non-selling vendor — no charge"
    : `$${total_cost} due at event`;

  /* ── Send emails ── */
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await Promise.all([
        /* Organizer notification */
        resend.emails.send({
          from: "KUBA 2026 Vendors <noreply@kuba2026.org>",
          to:   VENDOR_EMAIL,
          subject: `New Vendor Registration — ${esc(organization_name)}`,
          html: `
            <h2 style="font-family:sans-serif;">New Vendor Registration</h2>
            <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
              <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Organization</td><td>${esc(organization_name)}</td></tr>
              <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Contact Name</td><td>${esc(contact_name)}</td></tr>
              <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Phone</td><td>${esc(phone_number)}</td></tr>
              <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Email</td><td>${esc(email)}</td></tr>
              <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Type</td><td>${is_non_selling ? "Non-selling vendor" : "Selling vendor"}</td></tr>
              ${!is_non_selling ? `<tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Product</td><td>${esc(product_being_sold)}</td></tr>` : ""}
              ${activity ? `<tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Activity</td><td>${esc(activity)}</td></tr>` : ""}
              <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Days Attending</td><td>${esc(daysAttending)}</td></tr>
              <tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Amount</td><td><strong>${esc(chargeLabel)}</strong></td></tr>
              ${notes ? `<tr><td style="padding:6px 16px 6px 0;font-weight:bold;">Notes</td><td>${esc(notes)}</td></tr>` : ""}
            </table>
          `,
        }),

        /* Vendor confirmation */
        resend.emails.send({
          from: "KUBA 2026 <noreply@kuba2026.org>",
          to:   email,
          subject: "Your KUBA 2026 Vendor Registration is Confirmed!",
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b;">
              <div style="background:#1e3a8a;padding:28px 32px;border-radius:12px 12px 0 0;">
                <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">KUBA 2026 · Memphis</h1>
                <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:14px;">28th Harari Sport &amp; Cultural Festival</p>
              </div>
              <div style="background:#f8fafc;padding:28px 32px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;">
                <h2 style="margin:0 0 6px;font-size:18px;">You&apos;re registered! ✅</h2>
                <p style="color:#475569;font-size:14px;margin:0 0 24px;">
                  Hi ${esc(contact_name)}, your vendor spot at KUBA 2026 has been received. Here&apos;s a summary:
                </p>
                <table style="width:100%;border-collapse:collapse;font-size:14px;">
                  <tr style="border-bottom:1px solid #e2e8f0;">
                    <td style="padding:10px 0;color:#64748b;font-weight:600;width:140px;">Organization</td>
                    <td style="padding:10px 0;color:#1e293b;">${esc(organization_name)}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #e2e8f0;">
                    <td style="padding:10px 0;color:#64748b;font-weight:600;">Days Attending</td>
                    <td style="padding:10px 0;color:#1e293b;">${esc(daysAttending)}</td>
                  </tr>
                  ${!is_non_selling ? `
                  <tr style="border-bottom:1px solid #e2e8f0;">
                    <td style="padding:10px 0;color:#64748b;font-weight:600;">Product</td>
                    <td style="padding:10px 0;color:#1e293b;">${esc(product_being_sold)}</td>
                  </tr>` : ""}
                  ${activity ? `
                  <tr style="border-bottom:1px solid #e2e8f0;">
                    <td style="padding:10px 0;color:#64748b;font-weight:600;">Activity</td>
                    <td style="padding:10px 0;color:#1e293b;">${esc(activity)}</td>
                  </tr>` : ""}
                  <tr>
                    <td style="padding:10px 0;color:#64748b;font-weight:600;">Amount Due</td>
                    <td style="padding:10px 0;font-size:18px;font-weight:700;color:${total_cost > 0 ? "#b45309" : "#15803d"};">
                      ${total_cost > 0 ? `$${total_cost} &mdash; collected at the event` : "No charge"}
                    </td>
                  </tr>
                </table>
                <div style="margin-top:24px;padding:16px;background:#eff6ff;border-radius:8px;border:1px solid #bfdbfe;">
                  <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.6;">
                    <strong>June 29 &ndash; July 5, 2026 · Memphis, TN</strong><br/>
                    Payment is collected on-site &mdash; no payment is needed now.<br/>
                    Questions? Email <a href="mailto:memphiskuba@gmail.com" style="color:#1e40af;">memphiskuba@gmail.com</a>
                  </p>
                </div>
              </div>
            </div>
          `,
        }),
      ]);
    } catch (emailErr) {
      console.error("Email send error (non-fatal):", emailErr);
    }
  }

  return NextResponse.json({ success: true, total_cost });
}
