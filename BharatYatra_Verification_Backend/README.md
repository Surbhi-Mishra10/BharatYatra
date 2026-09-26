# BharatYatra Verification Backend

Stores paid BharatYatra passes in PostgreSQL and verifies them cross-device through a QR token.

## Run
1. `npm install`
2. Copy `.env.example` to `.env` and set `DATABASE_URL`.
3. Create database `bharatyatra`.
4. Run `database/schema.sql` in PostgreSQL/pgAdmin.
5. `npm start` (or `npm run dev`).
6. Test `GET http://localhost:5000/api/health`.

## API
- `POST /api/bookings` — store a paid booking and return verification URL/token.
- `GET /api/verify/:token` — verify a stored pass.

This verifies BharatYatra's own stored pass; it does not verify live IRCTC/airline/hotel provider records.
