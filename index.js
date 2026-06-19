const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
app.use(cors()); // 🔥 IMPORTANT
app.use(express.json());

const PORT = process.env.PORT || 4000;
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let fashion_cardCollection;

// 🔥 GET ROUTE
app.get("/arival", async (req, res) => {
  try {
    const { category } = req.query;

   const query = category ? { category } : {};
    const result = await fashion_cardCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
app.post("/arival", async(req,res)=>{
    const fashion_card = req.body
    const result = await fashion_cardCollection.insertOne(fashion_card)
    res.send(result)

})

// app.get("/arival", async (req, res) => {
//   try {
//     const { category } = req.query;

//     const query = category ? { category } : {};

//     const result = await fashion_cardCollection.find(query).toArray();

//     res.send(result);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// root route
app.get("/", (req, res) => {
  res.send("server running");
});

// connect DB + start server
async function start() {
  try {
    await client.connect();

    const db = client.db("fasco");
    fashion_cardCollection = db.collection("fashion_card");

    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.log(error);
  }
}

start();