import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import MatchRoute from "./routes/MatchRoute.js";
import UserRoute from "./routes/UserRoute.js";
import ChallengeRoute from "./routes/ChallengeRoute.js";
import PartnerRoute from "./routes/PartnerRoute.js";
import "./utils/db.js";


dotenv.config();
const app = express();


app.use(cors({credentials: true, origin: true}));
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});


// Matches
app.use(MatchRoute);

// Users
app.use(UserRoute);

// Challenges
app.use(ChallengeRoute);

// Partner
app.use(PartnerRoute);


app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));