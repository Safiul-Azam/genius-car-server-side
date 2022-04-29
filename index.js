const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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
    const orderCollection = client.db('geniusCar').collection('order')

    //AUTH
    app.post('login',async(req, res)=>{
      const user = req.body 
      console.log(user)
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN,{
        expiresIn:'1d'
      })
      res.send(accessToken)
    })

    //SERVICE COLLECTION 
    //GET ALL SERVICE
    app.get('/service', async (req, res) => {
     const query = {}
     const cursor = serviceCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })
    //GET INDIVIDUAL SERVICE WITH ID
    app.get('/service/:id', async (req, res)=>{
      const id = req.params.id
      const query = {_id:ObjectId(id)}
      const service = await serviceCollection.findOne(query)
      res.send(service)
    })
    //INSERT ONE SERVICE FROM CLIENT SIDE 
    app.post('/service', async(req, res)=>{
      const serviceDoc = req.body 
      const result = await serviceCollection.insertOne(serviceDoc)
      res.send(result)
    })
    // DELETE SERVICE WITH ID
    app.delete('/service/:id', async(req, res)=>{
      const id = req.params.id 
      const query = {_id:ObjectId(id)}
      const result = await serviceCollection.deleteOne(query)
      res.send(result)
    })

    //ORDER COLLECTION
    app.get('/order', async(req, res)=>{
      const email = req.query.email
      const query =  {email:email}
      const cursor = orderCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/order', async(req, res)=>{
      const order = req.body 
      const result = await orderCollection.insertOne(order)
      res.send(result)
    })

  }
  finally {

  }

}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('running  genius car server')
})
app.listen(port, () => {
  console.log('listening ', port)
})