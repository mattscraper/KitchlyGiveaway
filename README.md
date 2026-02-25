# Kitchly Giveaway - $100 Visa Gift Card Contest

Mobile-first React landing page for the Kitchly $100 Visa gift card giveaway contest. Built with Next.js, Tailwind CSS, and Resend for email notifications.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description | Required |
|---|---|---|
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com) | Yes |
| `EMAIL_TO` | Recipient email for entries (default: contact@risodevelopment.com) | No |
| `EMAIL_FROM` | Sender email address (default: onboarding@resend.dev) | No |

### Setting up Resend

1. Sign up at [resend.com](https://resend.com) (free tier: 100 emails/day)
2. Create an API key in the dashboard
3. Add it to `.env.local` as `RESEND_API_KEY`
4. (Optional) Verify a custom domain to send from your own address

## Configuration

Edit `src/config.ts` to update:

- **Contest deadline** and **winner announcement date**
- **App Store URL**
- **Instagram handle** and URL
- **Email recipient**

## Adding the Logo

1. Place your logo file in `public/` (e.g., `public/kitchly-logo.png`)
2. In `src/app/page.tsx`, uncomment the `<img>` tag in the Header section and remove the placeholder `<div>`

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository
3. Add environment variables in Vercel project settings:
   - `RESEND_API_KEY` — your Resend API key
   - `EMAIL_TO` — recipient email
   - `EMAIL_FROM` — sender email (use your verified Resend domain)
4. Deploy

## Project Structure

```
src/
├── app/
│   ├── api/submit-entry/
│   │   └── route.ts        # Serverless API for form submission + email
│   ├── globals.css          # Tailwind + custom CSS variables
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main giveaway landing page
└── config.ts                # Contest configuration (dates, links)
```

## Tech Stack

- **Next.js 16** (App Router)
- **Tailwind CSS 4**
- **Resend** for transactional email
- **TypeScript**
# KitchlyGiveaway
