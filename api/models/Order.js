const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  { address:{type: String}, 
    userId: { type: String, required: true },
    products: [
      { price:{type:Number},
      
        title: {
          type: String,
        },
        productId: {
          type: String,
        },
        productImg: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: { type: Number, required: true },
    
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
