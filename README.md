# JobNest Full Stack

JobNest is a MERN job portal where the website owner can publish job openings, fetch job information from a company's job URL for review, control paid application access, manage subscription plans and monitor users/payments/revenue.

## Folder structure

- `backend/` — Express + MongoDB API, authentication, admin authorization, jobs, subscriptions, Razorpay and reporting.
- `frontend/` — React + Vite + Tailwind UI for public pages, user dashboard and owner/admin panel.

## Run locally

### Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill MongoDB + Razorpay TEST credentials. Then create the owner account:

```bash
npm run create-admin
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Owner/Admin panel

Open `http://localhost:5173/admin` or sign in directly at `http://localhost:5173/admin/login`. If you are not logged in, JobNest sends you to the owner/admin login page. Only a user whose backend role is `ADMIN` can access the admin panel and APIs; regular user accounts are sent back to their dashboard.

Admin sections:

- Dashboard — users, jobs, companies, active subscriptions, applications and revenue KPIs.
- Jobs — fetch/preview a company job URL, review/edit, publish/draft, edit and delete.
- Companies — add, edit and delete companies.
- Subscription Plans — set price, duration and application limit; activate/deactivate plans.
- Users — search users and activate/block accounts.
- Applications — see who unlocked/applied to which job and update status.
- Payments — successful, created, failed and refunded payment records.
- Revenue — gross subscription revenue and daily trend.
- Settings — owner account and operating notes.

## Security

Do not commit `backend/.env`. The supplied `.env` is sanitized; copy `.env.example` and add your own secrets. Admin authorization is enforced on the backend, not just by hiding frontend routes.

## Job URL fetching

The fetcher first checks for standard `JobPosting` JSON-LD. If a page does not expose structured job data, it returns a manual-review text preview rather than pretending that guessed fields are accurate. Always respect the source website's terms and automated-access rules.
