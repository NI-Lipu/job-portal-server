const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3lgey3i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
})

async function run() {
   try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect()
      // Send a ping to confirm a successful connection
      await client.db('admin').command({ ping: 1 })
      console.log(
         'Pinged your deployment. You successfully connected to MongoDB!'
      )

      // jobs related apis
      const jobsCollection = client.db('jobPortal').collection('jobs')
      const jobApplicationCollection = client
         .db('jobPortal')
         .collection('applicationCollection')

      // Get all jobs
      app.get('/jobs', async (req, res) => {
         const cursor = jobsCollection.find()
         const result = await cursor.toArray()
         res.send(result)
      })

      // Get single Job by id
      app.get('/jobs/:id', async (req, res) => {
         const id = req.params.id
         const query = { _id: new ObjectId(id) }
         const job = await jobsCollection.findOne(query)
         res.send(job)
      })

      // Post jobs Application
      app.post('/job-applications', async (req, res) => {
         const data = req.body
         const result = await jobApplicationCollection.insertOne(data)
         res.send(result)
      })

      // Get a users all job application by query
      app.get('/job-application', async (req, res) => {
         const email = req.query.email
         const query = { applicant_email: email }
         const result = await jobApplicationCollection.find(query).toArray()
         res.send(result)
      })
   } finally {
      // Ensures that the client will close when you finish/error
      // await client.close()
   }
}
run().catch(console.dir)

app.get('/', (req, res) => {
   res.send('Job is falling from the sky')
})

app.listen(port, () => {
   console.log(`Server is running: ${port}`)
})
