const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.umaiywo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
       
    }
});



//mongo db

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const toysCollection = client.db('toyData').collection('toys');
        


// all data get
        app.get('/toys', async (req, res)=> {
            const cursor = toysCollection.find();
            const result = await cursor.toArray();
            
            
            console.log(req.query)
            let query = {}
            if(req.query?.email){
                query={email: req.query.email}
            }
            const result2 = await toysCollection.find(query).toArray();
            res.send(result2)
            

            



        })



        
  







//single data get

app.get('/toys/:id', async(req,res)=>{
    const id = req.params.id;
    
    const query = {_id : new ObjectId(id)}
    const result= await toysCollection.findOne(query);
    res.send(result)
   })

   //create my toys data
   app.post('/toys', async(req,res)=>{
    const toys = req.body;
    const result = await toysCollection.insertOne(toys);
    res.send(result)
   })








//delete data
app.delete('/toys/:id', async(req,res)=>{
    const id = req.params.id;
    const query = {_id : new ObjectId(id)}
    const result= await toysCollection.deleteOne(query);
    res.send(result)
   })



        

// //    create 
//    app.post('/myToys', async(req,res)=>{
//     const myToys = req.body;
//     console.log(myToys)
//     const result = await myToysCollection.insertOne(myToys);
//     res.send(result)
//    })




//    //get my toys
//    app.get('/myToys', async (req, res)=> {
//     const cursor = myToysCollection.find();
//     const result = await cursor.toArray();
//     res.send(result)

// })


   






     


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
    res.send('server is running')
})



app.listen(port, () => {
    console.log(`server is running on port,${port}`)
})