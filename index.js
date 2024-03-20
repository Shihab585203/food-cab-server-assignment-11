const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();

//Middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xlp2yoh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(process.env.DB_USER, process.env.DB_PASSWORD);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const productsCollection = client.db("foodCab").collection("foodItems");
    const reviewsCollection = client.db("foodCab").collection("myReviews");

    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const cursor = await productsCollection.findOne(query);
      res.send(cursor);
    });

    app.get("/limitedProducts", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.limit(3).toArray();
      res.send(products);
    });

    //Review API Part
    app.post("/reviews", async (req, res) => {
      const query = req.body;
      const review = await reviewsCollection.insertOne(query);
      res.send(review);
    });

    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewsCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    });
  } finally {
  }
}
run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("Food Cab Server is Running Successfully!");
});

app.listen(port, () => {
  console.log(`This server is running on Port ${port}`);
});
