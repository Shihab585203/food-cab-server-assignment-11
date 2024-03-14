const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()


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
  }
});

async function run() {
  try {
    await client.connect();

    const productsCollection = client.db("foodCab").collection("foodItems");

    app.get("/products", async (req, res) => {
        const query = {};
        const cursor = productsCollection.find(query);
        const products = await cursor.toArray();
        res.send(products);
    });

    app.get("/limitedProducts", async (req, res) => {
        const query = {};
        const cursor = productsCollection.find(query);
        const products = await cursor.limit(3).toArray();
        res.send(products);
    });
   
  } finally {
  }
}
run().catch(error => console.log(error));



app.get("/", (req, res) => {
    res.send("Food Cab Server is Running Successfully!")
});

app.listen(port, () => {
    console.log(`This server is running on Port ${port}`);
});