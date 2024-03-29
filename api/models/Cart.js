const mongoose = require("mongoose");
const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
        },
        title: { type: String, required: true, unique: true },
      
        quantity: {
          type: Number,
          default: 1,
        },
        img: { type: String, required: true },
        color: { type: Array },
        price: { type: Number, required: true },
        uid:{
          type:String,
          required:true,
         
        }

      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
