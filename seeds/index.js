if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const Listing = require("../models/listing");
const User = require("../models/user");
const { data: sampleListings } = require("./sampleListings");

const dbUrl = process.env.ATLASDB_URL;

main().then(() => console.log("MongoDB connected")).catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}

const seedDB = async () => {
  // Find or create default admin user
  let user = await User.findOne({ username: "admin" });
  if (!user) {
    user = new User({ username: "admin", email: "admin@example.com" });
    await User.register(user, "admin123"); 
    console.log("✅ Created default user: admin/admin123");
  } else {
    console.log("ℹ️ Using existing user:", user.username);
  }

  // Clear old listings
  await Listing.deleteMany({});

  // Attach owner to each sample listing
  const listingsWithOwner = sampleListings.map(listing => ({
    ...listing,
    owner: user._id
  }));

  await Listing.insertMany(listingsWithOwner);
  console.log("✅ Database seeded with sample listings");
};

seedDB().then(() => {
  mongoose.connection.close();
});
