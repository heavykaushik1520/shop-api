const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");

//..............................................
const app = express();
dotenv.config();

//..............................................
// try {

//     mongoose.connect(process.env.MONGO_URL)
//     .then(()=>
//     {
//         console.log("connection successful")
//     })
//     .catch((e)=>
//     {
//         console.log(e);
//     })

// } catch (error) {

//     console.log(error)

// }

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connection successful");
  } catch (error) {
    console.error("Connection failed:", error);
  }
}

// Call the async function to connect to the database
connectToDatabase();

//..............................................
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

//..............................................
app.listen(process.env.PORT || 5000, () => {
  console.log("Backend running on server 5000");
});
