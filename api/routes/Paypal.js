import express from "express";
import dotenv from "dotenv";

const router = express.Router();

dotenv.config();

router.get('/api/config/paypal', (req, res) => {
   res.send(process.env.PAYPAL_CLIENT_ID);
});