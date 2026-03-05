"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { CONTEST_CONFIG } from "@/config";

export default function Home() {
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  function validateEmail(value: string): boolean {
    if (!value.trim()) {
      setEmailError("Email is required.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError(null);
    return true;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validateEmail(email)) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          instagram: instagram.trim() || null,
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
    <main className="min-h-svh bg-background pb-12 pt-10 sm:pt-14">
      <div className="mx-auto w-full max-w-[420px] px-6">
        {/* ---- Header ---- */}
        <div className="flex flex-col items-center">
          <Image
            src="/assets/logo.png"
            alt="Kitchly"
            width={88}
            height={88}
            className="rounded-[22px]"
            priority
          />
          <p className="mt-3 text-[13px] font-medium text-text-secondary">
            @{CONTEST_CONFIG.instagramHandle}
          </p>
        </div>

        {/* ---- Hero ---- */}
        <div className="mt-8 text-center">
          <p className="text-[13px] font-semibold tracking-wide text-primary uppercase">
            Giveaway
          </p>
          <h1 className="mt-1 text-[32px] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-[38px]">
            Win a $100
            <br />
            Visa Gift Card
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
            2 simple steps and you&apos;re entered
            <br className="sm:hidden" /> for a chance to win.
          </p>
        </div>

        {/* ---- Steps ---- */}
        <div className="mt-9 space-y-2.5">
          <p className="px-1 text-[11px] font-semibold tracking-[0.1em] text-text-muted uppercase">
            How to enter
          </p>

          <a
            href={CONTEST_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3.5 rounded-2xl px-4 py-3.5 transition-colors hover:bg-card-bg active:bg-card-bg"
          >
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888]">
              <InstagramIcon />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold leading-tight text-foreground">
                Follow @{CONTEST_CONFIG.instagramHandle}
              </span>
              <span className="block text-[12px] leading-snug text-text-secondary">
                Follow us on Instagram
              </span>
            </span>
            <ArrowIcon />
          </a>

          <a
            href={CONTEST_CONFIG.appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3.5 rounded-2xl px-4 py-3.5 transition-colors hover:bg-card-bg active:bg-card-bg"
          >
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-black">
              <AppStoreIcon />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold leading-tight text-foreground">
                Download Kitchly
              </span>
              <span className="block text-[12px] leading-snug text-text-secondary">
                Free on the App Store
              </span>
            </span>
            <ArrowIcon />
          </a>
        </div>

        {/* ---- Divider ---- */}
        <div className="my-9 h-px bg-border" />

        {/* ---- Entry Form ---- */}
        <section id="entry">
          {isSubmitted ? (
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-foreground">
                You&apos;re all set!
              </h2>
              <p className="mx-auto mt-2 max-w-[300px] text-[14px] leading-relaxed text-text-secondary">
                If you&apos;ve followed us on Instagram and downloaded the
                app, you&apos;re automatically entered.
              </p>
              <p className="mx-auto mt-1.5 max-w-[300px] text-[14px] leading-relaxed text-text-secondary">
                Haven&apos;t finished yet? No worries — your entry will count
                as soon as both steps are done.
              </p>
              <p className="mt-5 text-[12px] font-medium text-text-muted">
                Winner announced {CONTEST_CONFIG.winnerAnnouncementDate}
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-center text-lg font-bold text-foreground">
                Almost done
              </h2>
              <p className="mx-auto mt-1.5 mb-5 max-w-[320px] text-center text-[13px] leading-relaxed text-text-secondary">
                Submit your info below. Your entry only counts once
                you&apos;ve completed both steps above.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                {error && (
                  <p className="mb-4 rounded-xl bg-error/[0.06] px-4 py-3 text-center text-[13px] font-medium text-error" role="alert">
                    {error}
                  </p>
                )}

                <fieldset disabled={isSubmitting} className="space-y-3">
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-foreground">
                      Email used for Kitchly <span className="text-error">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) validateEmail(e.target.value);
                      }}
                      onBlur={() => { if (email) validateEmail(email); }}
                      placeholder="you@email.com"
                      className="h-12 w-full rounded-xl border border-border bg-card-bg px-4 text-foreground outline-none transition-all placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
                      aria-describedby={emailError ? "email-error" : undefined}
                      aria-invalid={emailError ? "true" : undefined}
                      suppressHydrationWarning
                    />
                    {emailError && (
                      <p id="email-error" className="mt-1.5 text-[12px] text-error" role="alert">{emailError}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="instagram" className="mb-1.5 block text-[13px] font-medium text-foreground">
                      Instagram handle <span className="font-normal text-text-muted">(optional)</span>
                    </label>
                    <input
                      id="instagram"
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@yourusername"
                      className="h-12 w-full rounded-xl border border-border bg-card-bg px-4 text-foreground outline-none transition-all placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
                      suppressHydrationWarning
                    />
                  </div>
                </fieldset>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-5 flex h-[52px] w-full items-center justify-center rounded-2xl bg-primary text-[15px] font-semibold text-white shadow-[0_2px_12px_rgba(13,150,104,0.3)] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
                >
                  {isSubmitting ? "Submitting..." : "Submit Entry"}
                </button>
              </form>
            </>
          )}
        </section>

        {/* ---- Footer ---- */}
        <footer className="mt-10 text-center text-[12px] text-text-muted">
          <p>Ends {CONTEST_CONFIG.deadline}</p>
          <p className="mt-1">
            Questions?{" "}
            <a
              href={CONTEST_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-text-secondary underline underline-offset-2"
            >
              DM us on Instagram
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
    <svg className="h-4.5 w-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function AppStoreIcon() {
  return (
    <svg className="h-4.5 w-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4 flex-shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
