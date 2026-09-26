const router=require('express').Router();
const {verifyBooking}=require('../controllers/verificationController');
router.get('/:token',verifyBooking); module.exports=router;
