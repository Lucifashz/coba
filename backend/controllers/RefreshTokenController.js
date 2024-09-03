import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
   const refreshToken = req.cookies.refreshToken;
   if (refreshToken) {
      await User.findOne({ refresh_token: refreshToken })
      .then((result) => {
         if (result) {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
               if (!error) {
                  const accessToken = jwt.sign({
                     userId: result._id, 
                     name: result.name,
                     username: result.username,
                     email: result.email,
                     partnerId: result.partnerId
                  }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'});

                  res.json({ accessToken });
               } else {
                  return res.sendStatus(403);
               }
            });
         } else {
            return res.sendStatus(403);
         }
      })
      .catch((error) => {
         console.log(error);
      })
   } else {
      return res.status(200).json({ message: "belum login" });
   }
}