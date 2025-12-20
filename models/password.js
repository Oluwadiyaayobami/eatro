const mongoose  = require('mongoose')
const paswordschema = new mongoose.Schema({
     userId: {
    type: String,  
    required: true
  },

  appName: {
    type: String,
    required: true
  },

  username: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  }

}, { timestamps: true })

const createnewpassword = mongoose.model('password',paswordschema)
module.exports = createnewpassword