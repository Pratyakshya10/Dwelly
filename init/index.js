const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB");
  await initDB();
}

const initDB = async () => {
  await Listing.deleteMany({});
  console.log("Old data deleted");

  await Listing.insertMany(initData.data);
  console.log("Database initialized with sample data");

  mongoose.connection.close();
};

main().catch((err) => {
  console.error("Error:", err);
});