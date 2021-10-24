const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
//
const app = express();
const port = process.env.PORT || 5000;

// middleware use
app.use(cors());
app.use(express.json());

// connect MongoDB server
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o4xkh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//
async function run() {
  try {
    await client.connect();

    const database = client.db("carMechanic");
    const servicesCollection = database.collection("services");

    // GET API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // get single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      //   console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    // post api
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hitting post api", service);

      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    // DELETE API

    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// default connect check
app.get("/", (req, res) => {
  res.send("Running Genius Server");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
