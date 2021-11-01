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
    const anotherdata = client.db('myspot');
    const myCollection = anotherdata.collection("mybook")
   
    // post
    app.post('/addplans',async(req,res)=>{
          console.log(req.body)
          const plans=req.body;
           console.log(plans)
          const result = await planCollection.insertOne(plans)
         
           res.send(result)
    })


    app.post('/bookinfo',async(req,res)=>{
          console.log(req.body)
          const book=req.body;
           console.log(book)
          const result = await myCollection.insertOne(book)
         
           res.send(result)
    })


    app.get('/bookinfo',async(req,res)=>{
      let query = {}
      const displayName = req.query.name;
      if(displayName){
        query ={displayName :displayName}

      }
            const cursor = myCollection.find(query);
            const books = await cursor.toArray(); 
            res.json(books)
    })

    app.get('/allbooking',async(req,res)=>{
    
            const cursor = myCollection.find({});
            const books = await cursor.toArray(); 
            res.json(books)
    })


   

    // get

    app.get('/plans',async(req,res)=>{
      const cursor = planCollection.find({})
     const getplan  = await cursor.toArray();
     res.send(getplan)


// manageall
app.get("/manageall", async (req, res) => {
  const result = await planCollection.find({}).toArray();
  res.send(result);
});





     app.get("/myplans/:displayName", async (req, res) => {
      const result = await EventsCollection.find({
        displayName: req.params.displayName,
      }).toArray();
      res.send(result);
    });
     
    })

    // get detail

    app.get('/plans/:id',async(req,res)=>{
      const id = req.params.id;
      console.log('getting',id)
      const query = {_id:ObjectId(id)}
      const book = await planCollection.findOne(query);
      res.json(book);
    })


  //  delete
  app.delete("/deletebook/:id", async (req, res) => {
    console.log(req.params.id);
    const result = await myCollection.deleteOne({
      _id: ObjectId(req.params.id),
    });
    res.send(result);
  });
    


    
    





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