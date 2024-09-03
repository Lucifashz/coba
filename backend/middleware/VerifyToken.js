import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];

   if (token !== null) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
         if (!error) {
            req.email = decoded.email;
            next()
         } else {
            return res.sendStatus(403);
         }
      })
   } else {
      return res.sendStatus(401);
   }
}
