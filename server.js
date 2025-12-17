const express = require('express')
const dbconnection = require('./database/db.js')
const dotenv = require('dotenv').config()
const router = require('./routes/approutes.js')
const app = express()


app.use(express.json())
app.use('/api/auth',router)

port = process.env.PORT
app.listen(port,()=>console.log(`server running on port ${port}`))

