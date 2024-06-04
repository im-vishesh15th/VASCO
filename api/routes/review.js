const Review= require("../models/Review");

const router = require("express").Router();

router.post('/', async (req, res) => {
    try {
        console.log("comment");
      const { productId, username, rating, comment } = req.body;
      const newReview = new Review({ productId, username, rating, comment });
      const savedReview = await newReview.save();
      res.status(201).json(savedReview);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  // GET route to retrieve reviews for a specific product
  router.get('/:productId', async (req, res) => {
    try {
      const reviews = await Review.find({ productId: req.params.productId });
      res.status(200).json(reviews);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  module.exports = router;

