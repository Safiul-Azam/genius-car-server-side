const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
require('dotenv').config()


//middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6m4yg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect()
    const serviceCollection = client.db('geniusCar').collection('service')


    app.get('/service', async (req, res) => {
     const query = {}
     const cursor = serviceCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/service/:id', async (req, res)=>{
      const id = req.params.id
      const query = {_id:ObjectId(id)}
      const service = await serviceCollection.findOne(query)
      res.send(service)
    })
    app.post('/service', async(req, res)=>{
      const serviceDoc = req.body 
      const result = await serviceCollection.insertOne(serviceDoc)
      res.send(result)
    })
    app.delete('/service/:id', async(req, res)=>{
      const id = req.params.id 
      const query = {_id:ObjectId(id)}
      const result = await serviceCollection.deleteOne(query)
      res.send(result)
    })

  }
  finally {

  }

}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('running genius car server')
})
app.listen(port, () => {
  console.log('listening ', port)
})