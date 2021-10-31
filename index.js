const express = require('express')
const { MongoClient } = require('mongodb')
const app = express()
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT||5000
const cors = require('cors')
require('dotenv').config();


// middleware
app.use(cors());
app.use(express.json());

//uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qp5s8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/* -------------------------- */
async function run() {
  try {
    await client.connect();
    const database = client.db("PicnicSpot");
    const planCollection = database.collection("picnic");
   
    // post
    app.post('/addplans',async(req,res)=>{
          console.log(req.body)
          const plans=req.body;
           console.log(plans)
          const result = await planCollection.insertOne(plans)
         
           res.send(result)
    })

    // get

    app.get('/plans',async(req,res)=>{
      const cursor = planCollection.find({})
     const getplan  = await cursor.toArray();
     res.send(getplan)
     
    })

    // get detail

    app.get('/plans/:id',async(req,res)=>{
      const id = req.params.id;
      console.log('getting',id)
      const query = {_id:ObjectId(id)}
      const book = await planCollection.findOne(query);
      res.json(book);
    })


    // get my orders
    


    
    





  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})