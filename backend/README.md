# JobOrbit Backend

MERN backend for the JobOrbit job portal, including a protected owner/admin panel, job URL preview, subscription plans, Razorpay payments, applications and revenue reporting.

## Setup

1. Copy `.env.example` to `.env` and fill in MongoDB, JWT and Razorpay TEST credentials.
2. Install dependencies:
   `npm install`
3. Create the owner/admin account:
   `npm run create-admin`
4. Start the API:
   `npm run dev`

API: `http://localhost:5000`
API status: `GET /`
Health: `GET /api/health`

In production, set `CORS_ORIGINS` to a comma-separated list of allowed frontend origins (for example, `https://frontend-black-psi-72.vercel.app`). `FRONTEND_URL` remains supported for a single additional origin.

## Admin panel

Frontend route: `http://localhost:5173/admin`

The `/admin` route is protected twice: the frontend requires an authenticated user with `role === ADMIN`, and every admin API endpoint requires a valid JWT plus the ADMIN role on the backend.

The owner panel includes:
- Dashboard KPIs and recent activity
- Job management, URL fetch/preview, publish/draft, edit and delete
- Company management
- Subscription plan price, duration and application-limit management
- User list and account blocking/activation
- Application tracking and status management
- Payment history
- Revenue analytics
- Owner settings

## Job URL fetching

The URL fetcher first looks for `JobPosting` JSON-LD structured data and falls back to raw page text for manual review. Company pages differ, and some prohibit automated access, so always review fetched content and comply with the source site's terms/robots rules.

## Razorpay

Use TEST mode credentials during development. Keep `RAZORPAY_KEY_SECRET` server-side and never commit `.env` or secrets to GitHub.
