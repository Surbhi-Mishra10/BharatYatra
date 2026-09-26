const express=require('express'); const cors=require('cors'); require('dotenv').config();
const bookingRoutes=require('./routes/bookingRoutes'); const verificationRoutes=require('./routes/verificationRoutes'); const errorHandler=require('./middleware/errorHandler'); const pool=require('./db');
const app=express(); const PORT=Number(process.env.PORT||5000);
const allowedOrigins = new Set([
  process.env.FRONTEND_ORIGIN,
  "http://localhost:5500",
  "http://127.0.0.1:5500"
].filter(Boolean));

app.use(cors({
  origin: (origin, callback) => {
    // Local development: accept localhost/127.0.0.1 on any frontend port.
    // Requests without an Origin header are also allowed.
    if (!origin) return callback(null, true);
    try {
      const url = new URL(origin);
      const isLocalHost =
        (url.hostname === "localhost" || url.hostname === "127.0.0.1") &&
        (url.protocol === "http:" || url.protocol === "https:");
      if (isLocalHost || allowedOrigins.has(origin)) return callback(null, true);
    } catch (_) {}
    return callback(new Error("CORS origin not allowed"));
  }
}));

app.use(express.json({limit:'1mb'}));
app.get('/api/health',async(req,res)=>{try{await pool.query('SELECT 1');res.json({ok:true,service:'bharatyatra-verification-backend',database:'connected'});}catch(e){res.status(503).json({ok:false,service:'bharatyatra-verification-backend',database:'unavailable'});}});
app.use('/api/bookings',bookingRoutes); app.use('/api/verify',verificationRoutes); app.use(errorHandler);
app.listen(PORT, '0.0.0.0', ()=> {console.log(`BharatYatra backend running on port ${PORT}`);});
