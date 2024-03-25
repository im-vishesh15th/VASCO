const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/payment", async (req, res) => {
  try {
   

    const { tokenId, amount} = req.body;

    if (!tokenId || !amount) {
      return res.status(400).json({ error: "TokenId and amount are required" });
    }

  
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      //shipping:billingAddress,
      payment_method_data: {
        type: "card",
        card: {
          token: tokenId,
        },
      },
      confirm: true,
      return_url: "http://localhost:5173/"
    });

  
    res.status(200).json(paymentIntent);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
