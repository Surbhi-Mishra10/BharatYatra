const pool = require('../db');
const crypto = require('crypto');
const { validate: uuidValidate } = require('uuid');

const clean = v => v == null ? null : String(v).trim();

const amount = v =>
  Number.isFinite(Number(v)) && Number(v) >= 0
    ? Number(v)
    : 0;

const intOrNull = v =>
  v === '' || v == null
    ? null
    : (Number.isInteger(Number(v)) ? Number(v) : null);

function verificationUrl(token) {
  const base = process.env.PUBLIC_VERIFY_URL || '/verify-pass.html';

  return `${base}${base.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`;
}

async function createBooking(req, res, next) {

  // IMPORTANT:
  // Keep b outside the try block because the catch block
  // also needs access to the request body.
  const b = req.body || {};

  try {

    // Required fields
    for (const f of ['pnr', 'passengerName', 'origin', 'destination']) {
      if (!clean(b[f])) {
        return res.status(400).json({
          error: `Missing required field: ${f}`
        });
      }
    }

    // Verification token
    const token =
      clean(b.verificationToken) &&
      uuidValidate(b.verificationToken)
        ? b.verificationToken
        : crypto.randomUUID();

    // Transit and hotel objects
    const t = b.transit || {};
    const h = b.hotel || {};

    // Insert booking
    const q = await pool.query(
      `
      INSERT INTO bookings (
        pnr,
        verification_token,
        passenger_name,
        passenger_email,
        origin,
        destination,
        start_date,
        end_date,
        transit_type,
        transit_name,
        transit_number,
        transit_class,
        coach,
        seat,
        hotel_name,
        hotel_category,
        hotel_room,
        attractions,
        crowd_percentage,
        total_amount,
        payment_id,
        payment_status,
        booking_status
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        $14,
        $15,
        $16,
        $17,
        $18::jsonb,
        $19,
        $20,
        $21,
        'PAID',
        'CONFIRMED'
      )
      RETURNING
        pnr,
        verification_token,
        payment_status,
        booking_status,
        created_at
      `,
      [
        clean(b.pnr),
        token,
        clean(b.passengerName),
        clean(b.passengerEmail),
        clean(b.origin),
        clean(b.destination),
        clean(b.startDate),
        clean(b.endDate),

        clean(t.type),
        clean(t.name),
        clean(t.number || t.trainNumber || t.flightNumber),
        clean(t.className || t.class),
        clean(t.coach),
        clean(t.seat),

        clean(h.name),
        clean(h.category),
        clean(h.room),

        JSON.stringify(
          Array.isArray(b.attractions)
            ? b.attractions
            : []
        ),

        intOrNull(b.crowdPercentage),
        amount(b.totalAmount),
        clean(b.paymentId)
      ]
    );

    const r = q.rows[0];

    return res.status(201).json({
      success: true,
      pnr: r.pnr,
      verificationToken: r.verification_token,
      verificationUrl: verificationUrl(r.verification_token),
      paymentStatus: r.payment_status,
      bookingStatus: r.booking_status,
      createdAt: r.created_at
    });

  } catch (e) {

    // Duplicate booking / verification token
    if (e.code === '23505') {

      try {

        // b is now accessible here
        const existing = await pool.query(
          `
          SELECT
            pnr,
            verification_token,
            payment_status,
            booking_status,
            created_at
          FROM bookings
          WHERE pnr = $1
          LIMIT 1
          `,
          [clean(b.pnr)]
        );

        if (existing.rowCount) {

          const r = existing.rows[0];

          return res.status(200).json({
            success: true,
            alreadyExists: true,
            pnr: r.pnr,
            verificationToken: r.verification_token,
            verificationUrl: verificationUrl(
              r.verification_token
            ),
            paymentStatus: r.payment_status,
            bookingStatus: r.booking_status,
            createdAt: r.created_at
          });
        }

      } catch (lookupError) {
        return next(lookupError);
      }

      return res.status(409).json({
        error:
          'A booking with this PNR or verification token already exists.'
      });
    }

    // Pass other database/server errors to Express
    return next(e);
  }
}

module.exports = {
  createBooking
};