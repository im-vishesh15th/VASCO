const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/payment", async (req, res) => {
  console.log("pay time");
  try {
    console.log("pay time");
    const { products, orderId } = req.body;
    const lineItems = await Promise.all(
      products.map(async (item) => {

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.title,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        };
      }))
      ;

    const session = await stripe.checkout.sessions.create({
      shipping_address_collection: { allowed_countries: ['US', 'IN'] },
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `http://localhost:5173/fail?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      line_items: lineItems,
    });
    console.log(session);
    res.status(200).json({ stripeSession: session, orderId: orderId });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/retrieve-session", async (req, res) => {
  const { session_id } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log(session);

    res.status(200).json(session);
  } catch (error) {
    console.error("Error retrieving session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
