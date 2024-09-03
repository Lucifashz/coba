import express from "express";
import dotenv from "dotenv";


dotenv.config();
const router = express.Router();


router.get('/paypal',  (req, res) => {
   res.send(process.env.PAYPAL_CLIENT_ID);
});

export default router;