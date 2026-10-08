# API Endpoints

## Auth
POST /api/auth/register
POST /api/auth/login

## Jobs
GET /api/jobs
GET /api/jobs/:id
POST /api/jobs/admin/preview-url (ADMIN)
POST /api/jobs/admin (ADMIN)
PUT /api/jobs/admin/:id (ADMIN)
DELETE /api/jobs/admin/:id (ADMIN)

## Companies
GET /api/companies
POST /api/companies (ADMIN)

## Subscriptions
GET /api/subscriptions/plans
GET /api/subscriptions/my (LOGIN)
POST /api/subscriptions/plans (ADMIN)
PUT /api/subscriptions/plans/:id (ADMIN)

## Payments
POST /api/payments/create-order (LOGIN)
POST /api/payments/verify (LOGIN)

## Applications
GET /api/applications/my (LOGIN)
POST /api/applications/:jobId/apply (LOGIN + ACTIVE SUBSCRIPTION)

## Admin
GET /api/admin/dashboard (ADMIN)
GET /api/admin/users (ADMIN)

## Revenue
GET /api/revenue (ADMIN)
