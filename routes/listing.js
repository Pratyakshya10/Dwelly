const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");




// Index
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New
router.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");

    if (!listing) {
      throw new ExpressError("Listing not found", 404);
    }

    res.render("listings/show.ejs", { listing });
  })
);


// Create
router.post(
  "/",
  wrapAsync(async (req, res) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
      throw new ExpressError(error.details[0].message, 400);
    }

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// Edit
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      throw new ExpressError("Listing not found", 404);
    }

    res.render("listings/edit.ejs", { listing });
  })
);

// Update
router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    const { error } = listingSchema.validate(req.body);
    if (error) {
      throw new ExpressError(error.details[0].message, 400);
    }

    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
  })
);

// Delete
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

module.exports = router;