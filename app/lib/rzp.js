const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RZP_KEY ,
  key_secret: process.env.RZP_SECRET
});

export default razorpay;