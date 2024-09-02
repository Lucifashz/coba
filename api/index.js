import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
import "./utils/db.js";


dotenv.config();

const app = express();


app.use(cors({credentials: true, origin: true}));
// app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());


// paypal payment api for client key; 
app.use("/", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});


app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));

