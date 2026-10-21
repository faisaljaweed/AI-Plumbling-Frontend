# RapidFlow frontend

Run `npm run dev`. Home opens the dashboard directly, without login. Customers use `/new-lead`.

Configure server-only API_BASE_URL and API_ADMIN_KEY in `.env.local`. API_ADMIN_KEY matches backend ADMIN_API_KEY. The browser talks through `/api/backend`; no backend key is exposed in client code.

The workspace is open for the requested demo. Use sample data for this public demo. Customer enquiry sessions still use their individual access tokens for chat and booking.

Checks: `npm run lint`, `npm run build`, and `node scripts/test-access.mjs` while frontend/backend are running.

Production: `npm ci && npm run build`, then `npm start`, or use the Dockerfile. See `D:/plumbling-backend/DEMO-SETUP.md` for database setup.

