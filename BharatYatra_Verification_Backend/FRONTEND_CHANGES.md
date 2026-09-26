# Existing frontend changes

## ticket_generator.html
Keep your current AI/data/booking flow. In `confirmPaymentAndIssue()`, after payment success and after `bookingDraft.paymentId` is set, POST the final booking to:

`https://bharatyatra-verification-backend-zkhy.onrender.com/api/bookings`

Example:

```js
const response = await fetch('https://bharatyatra-verification-backend-zkhy.onrender.com/api/bookings', {
  method: 'POST',
  headers: {'Content-Type':'application/json'},
  body: JSON.stringify({
    pnr: bookingDraft.pnr,
    passengerName: traveler.name,
    passengerEmail: traveler.email || '',
    origin: bookingDraft.origin,
    destination: bookingDraft.destination,
    startDate: bookingDraft.startDate,
    endDate: bookingDraft.endDate,
    transit: bookingDraft.transit || {},
    hotel: bookingDraft.hotel || {},
    attractions: bookingDraft.attractions || [],
    crowdPercentage: bookingDraft.crowd?.percentage ?? null,
    totalAmount: bookingDraft.totalPrice,
    paymentId: bookingDraft.paymentId
  })
});
const savedBooking = await response.json();
if (!response.ok || !savedBooking.success) throw new Error(savedBooking.error || 'Could not store booking');
bookingDraft.verificationToken = savedBooking.verificationToken;
bookingDraft.verificationUrl = savedBooking.verificationUrl;
```

Use `bookingDraft.verificationUrl` in your QR function. Do not create a new local-only token when the backend has returned one.

For development, the API URL is `https://bharatyatra-verification-backend-zkhy.onrender.com`. For a phone on another device, `localhost` will not work; use a LAN-accessible host for a local demo or deploy the backend/frontend to HTTPS.

## verify-pass.html
Read `token` from the query string and call:

```js
const token = new URLSearchParams(location.search).get('token');
const response = await fetch(`https://bharatyatra-verification-backend-zkhy.onrender.com/api/verify/${encodeURIComponent(token)}`);
const data = await response.json();
```

Render `data.valid` and `data.booking`. Remove reliance on localStorage for the actual verification result.

## chatbot.html
No QR/backend-specific change is required. Keep your current route/date forwarding and AI workflow.

## AI layer
Keep your current AI/model/dataset logic. Preserve accurate source labels:
- `Verified dataset`
- `Dataset-derived estimate`
- `AI model estimate`
- `Government / licensed dataset` only when actually sourced that way.

Do not label model-generated train/flight availability as verified.

## Important
The sample backend marks a booking PAID because it is designed to attach to your existing demo payment-success flow. For a production system, payment status must be established by a server-side payment gateway webhook/verification, not by a frontend-only success callback.
