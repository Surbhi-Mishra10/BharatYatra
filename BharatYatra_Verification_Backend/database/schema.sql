CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS bookings (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 pnr VARCHAR(32) NOT NULL UNIQUE,
 verification_token UUID NOT NULL UNIQUE,
 passenger_name VARCHAR(160) NOT NULL,
 passenger_email VARCHAR(255),
 origin VARCHAR(120) NOT NULL,
 destination VARCHAR(120) NOT NULL,
 start_date VARCHAR(40), end_date VARCHAR(40),
 transit_type VARCHAR(40), transit_name VARCHAR(180), transit_number VARCHAR(40), transit_class VARCHAR(100), coach VARCHAR(80), seat VARCHAR(80),
 hotel_name VARCHAR(180), hotel_category VARCHAR(80), hotel_room VARCHAR(160),
 attractions JSONB NOT NULL DEFAULT '[]'::jsonb,
 crowd_percentage INTEGER,
 total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
 payment_id VARCHAR(120),
 payment_status VARCHAR(30) NOT NULL DEFAULT 'PAID',
 booking_status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bookings_verification_token ON bookings(verification_token);
CREATE INDEX IF NOT EXISTS idx_bookings_pnr ON bookings(pnr);
