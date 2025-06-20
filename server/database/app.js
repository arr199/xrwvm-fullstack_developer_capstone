const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = 3030;

app.use(cors());
app.use(require("body-parser").urlencoded({ extended: false }));

const reviews_data = JSON.parse(fs.readFileSync("reviews.json", "utf8"));
const dealerships_data = JSON.parse(
  fs.readFileSync("dealerships.json", "utf8")
);

const Reviews = require("./review");
const Dealerships = require("./dealership");

async function seedDatabase() {
  try {
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews_data["reviews"]);
    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealerships_data["dealerships"]);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

mongoose
  .connect("mongodb://mongo-db:27017/", { dbName: "dealershipsDB" })
  .then(async () => {
    console.log("MongoDB connected");
    await seedDatabase();

    // Start the Express server only after seeding
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Express route to home
app.get("/", async (req, res) => {
  res.send("Welcome to the Mongoose API");
});

// Express route to fetch all reviews
app.get("/fetchReviews", async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching documents" });
  }
});

// Express route to fetch reviews by a particular dealer
app.get("/fetchReviews/dealer/:id", async (req, res) => {
  try {
    const documents = await Reviews.find({ dealership: req.params.id });
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching documents" });
  }
});

// Express route to fetch all dealerships
app.get("/fetchDealers", async (req, res) => {
  try {
    const data = await Dealerships.find();
    console.log("Dealerships found:", data);
    return res.json(data);
  } catch {
    return res.status(500).json({ error: "Error fetching dealerships" });
  }
});

// Express route to fetch Dealers by a particular state
app.get("/fetchDealers/:state", async (req, res) => {
  try {
    const data = await Dealerships.find({ state: req.params.state });
    return res.json(data);
  } catch {
    return res.status(500).json({ error: "Error fetching dealerships" });
  }
});

// Express route to fetch dealer by a particular id
app.get("/fetchDealer/:id", async (req, res) => {
  try {
    const data = await Dealerships.find({ id: req.params.id });
    return res.json(data);
  } catch {
    return res.status(500).json({ error: "Error fetching dealerships" });
  }
});

//Express route to insert review
app.post("/insert_review", express.raw({ type: "*/*" }), async (req, res) => {
  const data = JSON.parse(req.body);
  const documents = await Reviews.find().sort({ id: -1 });
  let new_id = documents[0]["id"] + 1;

  const review = new Reviews({
    id: new_id,
    name: data["name"],
    dealership: data["dealership"],
    review: data["review"],
    purchase: data["purchase"],
    purchase_date: data["purchase_date"],
    car_make: data["car_make"],
    car_model: data["car_model"],
    car_year: data["car_year"],
  });

  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error inserting review" });
  }
});
