"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { CONTEST_CONFIG } from "@/config";

export default function Home() {
  const [instagram, setInstagram] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  function validateHandle(value: string): boolean {
    const trimmed = value.trim().replace(/^@/, "");
    if (!trimmed) {
      setFieldError("Instagram handle is required.");
      return false;
    }
    if (!/^[a-zA-Z0-9._]{1,30}$/.test(trimmed)) {
      setFieldError("Please enter a valid Instagram handle.");
      return false;
    }
    setFieldError(null);
    return true;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validateHandle(instagram)) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instagram: instagram.trim().replace(/^@/, ""),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setIsSubmitted(true);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-6 py-6">
      <div className="w-full max-w-[400px]">
        {/* ---- Header + Hero ---- */}
        <div className="flex flex-col items-center text-center">
          <div className="rounded-[22px] bg-gradient-to-br from-[#0d9668]/10 to-[#34d399]/10 p-[3px]">
            <Image
              src="/assets/logo.png"
              alt="Kitchly"
              width={84}
              height={84}
              className="rounded-[20px]"
              priority
            />
          </div>
          <p className="mt-2 text-[12px] font-medium text-text-muted">
            @{CONTEST_CONFIG.instagramHandle}
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[11px] font-semibold tracking-wide text-primary uppercase">
              Giveaway
            </span>
          </div>
          <h1 className="mt-2 text-[28px] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-[34px]">
            Win a $100 Visa Gift Card
          </h1>
          <p className="mt-1.5 text-[13px] text-text-secondary">
            2 steps and you&apos;re entered for a chance to win.
          </p>
        </div>

        {/* ---- CTA Buttons ---- */}
        <div className="mt-6 space-y-2.5">
          <a
            href={CONTEST_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-[54px] items-center gap-3.5 rounded-2xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] px-5 shadow-[0_3px_16px_rgba(220,39,67,0.25)] transition-all hover:shadow-[0_5px_24px_rgba(220,39,67,0.35)] hover:brightness-105 active:scale-[0.98]"
          >
            <InstagramIcon />
            <span className="flex-1 text-[14px] font-semibold text-white">
              Follow @{CONTEST_CONFIG.instagramHandle}
            </span>
            <ChevronIcon opacity="70" />
          </a>

          <a
            href={CONTEST_CONFIG.appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-[54px] items-center gap-3.5 rounded-2xl bg-black px-5 shadow-[0_3px_16px_rgba(0,0,0,0.15)] transition-all hover:shadow-[0_5px_24px_rgba(0,0,0,0.25)] hover:bg-[#1a1a1a] active:scale-[0.98]"
          >
            <AppStoreIcon />
            <span className="flex-1 text-[14px] font-semibold text-white">
              Download on App Store
            </span>
            <ChevronIcon opacity="50" />
          </a>
        </div>

        {/* ---- Divider ---- */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] font-semibold tracking-widest text-text-muted uppercase">Then</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* ---- Entry Form ---- */}
        <section id="entry">
          {isSubmitted ? (
            <div className="py-2 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-foreground">
                You&apos;re all set!
              </h2>
              <p className="mx-auto mt-1.5 max-w-[300px] text-[13px] leading-relaxed text-text-secondary">
                If you&apos;ve followed us and downloaded the app, you&apos;re entered.
                If not, your entry counts once both steps are done.
              </p>
              <p className="mt-3 text-[11px] font-medium text-text-muted">
                Winner announced {CONTEST_CONFIG.winnerAnnouncementDate}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <p className="mb-3 text-center text-[12px] text-text-secondary">
                Enter your handle below. Entry counts once both steps are done.
              </p>

              {error && (
                <p className="mb-3 rounded-xl bg-error/[0.06] px-4 py-2.5 text-center text-[12px] font-medium text-error" role="alert">
                  {error}
                </p>
              )}

              <div className="flex gap-2.5">
                <input
                  id="instagram"
                  type="text"
                  required
                  value={instagram}
                  onChange={(e) => {
                    setInstagram(e.target.value);
                    if (fieldError) validateHandle(e.target.value);
                  }}
                  onBlur={() => { if (instagram) validateHandle(instagram); }}
                  placeholder="@yourusername"
                  disabled={isSubmitting}
                  className="h-[48px] min-w-0 flex-1 rounded-xl border border-border bg-card-bg px-4 text-foreground outline-none transition-all placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-50"
                  aria-describedby={fieldError ? "ig-error" : undefined}
                  aria-invalid={fieldError ? "true" : undefined}
                  suppressHydrationWarning
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-[48px] flex-shrink-0 rounded-xl bg-primary px-6 text-[14px] font-semibold text-white shadow-[0_2px_10px_rgba(13,150,104,0.3)] transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-50 disabled:shadow-none"
                >
                  {isSubmitting ? "..." : "Enter"}
                </button>
              </div>
              {fieldError && (
                <p id="ig-error" className="mt-1.5 text-[11px] text-error" role="alert">{fieldError}</p>
              )}
            </form>
          )}
        </section>

        {/* ---- Footer ---- */}
        <footer className="mt-5 text-center text-[11px] text-text-muted">
          <p>
            Ends {CONTEST_CONFIG.deadline} &middot;{" "}
            <a
              href={CONTEST_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-text-secondary underline underline-offset-2"
            >
              DM us
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}

/* ---- Sub-components ---- */

function InstagramIcon() {
  return (
    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function AppStoreIcon() {
  return (
    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function ChevronIcon({ opacity }: { opacity: string }) {
  return (
    <svg className={`h-4 w-4 text-white/${opacity} transition-transform group-hover:translate-x-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
