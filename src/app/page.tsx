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
            Complete 3 simple steps and enter
            <br className="sm:hidden" /> for a chance to win.
          </p>
        </div>

        {/* ---- Steps ---- */}
        <ol className="mt-9 space-y-1">
          <Step num={1} href={CONTEST_CONFIG.appStoreUrl}>
            <StepText
              title="Download Kitchly"
              desc="Free on the App Store"
            />
          </Step>
          <Step num={2}>
            <StepText
              title="Start your free trial"
              desc="7 days free — cancel anytime"
            />
          </Step>
          <Step num={3}>
            <StepText title="Scan 2 barcodes" desc="Any items from your kitchen" />
          </Step>
       
        </ol>

        {/* ---- Instagram CTA ---- */}
        <a
          href={CONTEST_CONFIG.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-4 flex items-center gap-3 rounded-2xl bg-primary/[0.06] px-4 py-3.5 transition-colors hover:bg-primary/[0.1] active:bg-primary/[0.12]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
            2x
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold text-foreground">
              Follow @{CONTEST_CONFIG.instagramHandle}
            </span>
            <span className="block text-[12px] text-text-secondary">
              Double your entry chances
            </span>
          </span>
          <ArrowIcon />
        </a>

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
                If you&apos;ve already completed the steps above, you&apos;re
                automatically entered.
              </p>
              <p className="mx-auto mt-1.5 max-w-[300px] text-[14px] leading-relaxed text-text-secondary">
                Haven&apos;t finished yet? No worries — your entry will count
                as soon as all steps are done.
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
                you&apos;ve completed all 3 steps above.
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

function Step({
  num,
  href,
  children,
}: {
  num: number;
  href?: string;
  children: React.ReactNode;
}) {
  const inner = (
    <>
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-white">
        {num}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
      {href && <ArrowIcon />}
    </>
  );

  const cls =
    "group flex items-center gap-3.5 rounded-2xl px-4 py-3.5 transition-colors";

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <li>
        <a
          href={href}
          {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
          className={`${cls} hover:bg-card-bg active:bg-card-bg`}
        >
          {inner}
        </a>
      </li>
    );
  }

  return (
    <li className={cls}>
      {inner}
    </li>
  );
}

function StepText({ title, desc }: { title: string; desc: string }) {
  return (
    <>
      <span className="block text-[14px] font-semibold leading-tight text-foreground">
        {title}
      </span>
      <span className="block text-[12px] leading-snug text-text-secondary">
        {desc}
      </span>
    </>
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
