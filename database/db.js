const mongoose = require("mongoose")
const { error } = require("node:console")
const dotenv = require("dotenv").config()

const dbconnection  = mongoose.connect(process.env.mongooseurl).then(()=>console.log('mongoose db connected ')).catch((error)=>console.log('an error occured '))

module.exports = dbconnection