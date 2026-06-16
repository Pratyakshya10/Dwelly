const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,

  image: {
    filename: String,
    url: String,
  },

  price: Number,
  location: String,
  country: String,

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;