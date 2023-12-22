const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aj8rb8b.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const tasksCollection = client.db('taskDB').collection('task')

    app.post('/task',async(req,res)=>{
      const newTask = req.body
      const result = await tasksCollection.insertOne(newTask)
      res.send(result)
    })

    app.get('/task',async(req,res)=>{
      const cursor = tasksCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.delete('/task/:id',async(req,res)=>{
      const id = req.params.id
      const query = { _id: new ObjectId(id)}
      const result = await tasksCollection.deleteOne(query)
      res.send(result)
    })

    app.get('/task/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await tasksCollection.findOne(query)
      res.send(result)
    })

    app.put('/update/:id',async(req,res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const options = {upsert : true}
      const updateTask = req.body
      const update = {
        $set:{
          title: updateTask.title,
          description: updateTask.description,
          date: updateTask.date,
          priority: updateTask.priority
        }
      }
      const result = await tasksCollection.updateOne(filter,update,options)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Welcome To TaskNova Server')
})

app.listen(port, () => {
    console.log(`TaskNova Server is running on port ${port}`)
})