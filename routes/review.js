const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");



// Create review
router.post(
  "/:id/reviews",
  wrapAsync(async (req, res) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
      throw new ExpressError(error.details[0].message, 400);
    }

    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  })
);

// Edit review form
router.get(
  "/:reviewId/edit",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new ExpressError("Review not found", 404);
    }

    res.render("reviews/edit.ejs", { id, review });
  })
);

// Update review
router.put(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    const { error } = reviewSchema.validate(req.body);
    if (error) {
      throw new ExpressError(error.details[0].message, 400);
    }

    await Review.findByIdAndUpdate(reviewId, req.body.review);

    res.redirect(`/listings/${id}`);
  })
);

// Delete review
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;