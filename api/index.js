import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Paypal from "./routes/Paypal.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT;

//connect db
mongoose
  .connect(process.env.MONGOOSEDB_RUL)
  .then(() => console.log("db connected"))
  .then((err) => {
    err;
  });



app.use(express.json())

app.use(cors())






// paypal payment api for client key;
app.use(Paypal);





app.listen(PORT || 9000, () => {
  console.log(`server listening on port ${PORT}`);
});
















//api product test route
// app.get("/api/products", (req, res) => {
//   res.json(products);
// });
// app.get("/api/products/:id", (req, res) => {
//     const product = products.find((product)=>product.id === req.params.id)
//     res.json(product);
//   });
