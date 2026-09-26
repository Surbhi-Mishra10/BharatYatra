const pool = require('../db');
async function verifyBooking(req,res,next){
 try{
  const token=String(req.params.token||'').trim();
  if(!token) return res.status(400).json({valid:false,error:'Missing verification token.'});
  const q=await pool.query(`SELECT pnr,passenger_name,origin,destination,start_date,end_date,transit_type,transit_name,transit_number,transit_class,coach,seat,hotel_name,hotel_category,hotel_room,attractions,crowd_percentage,total_amount,payment_id,payment_status,booking_status,created_at FROM bookings WHERE verification_token::text=$1 LIMIT 1`,[token]);
  if(!q.rowCount) return res.status(404).json({valid:false,status:'NOT_FOUND',error:'This BharatYatra pass could not be verified.'});
  const b=q.rows[0];
  if(b.payment_status!=='PAID'||b.booking_status!=='CONFIRMED') return res.json({valid:false,status:b.booking_status,error:'This pass is not currently valid.'});
  res.json({valid:true,status:'PAID',booking:{pnr:b.pnr,passengerName:b.passenger_name,origin:b.origin,destination:b.destination,startDate:b.start_date,endDate:b.end_date,transitType:b.transit_type,transitName:b.transit_name,transitNumber:b.transit_number,transitClass:b.transit_class,coach:b.coach,seat:b.seat,hotelName:b.hotel_name,hotelCategory:b.hotel_category,hotelRoom:b.hotel_room,attractions:b.attractions,crowdPercentage:b.crowd_percentage,totalAmount:Number(b.total_amount),paymentId:b.payment_id,createdAt:b.created_at}});
 }catch(e){next(e)}
}
module.exports={verifyBooking};
