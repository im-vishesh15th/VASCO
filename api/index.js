const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
 dotenv.config();
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");
mongoose.set('strictQuery', false);

mongoose
  .connect("mongodb://vishesh15th:13591359abc@ac-xrcxqij-shard-00-00.yxt8ju9.mongodb.net:27017,ac-xrcxqij-shard-00-01.yxt8ju9.mongodb.net:27017,ac-xrcxqij-shard-00-02.yxt8ju9.mongodb.net:27017/vasco-store?replicaSet=atlas-mk2sif-shard-0&ssl=true&authSource=admin")
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

app.listen( 3000, () => {
  console.log("Backend server is running!");
});
