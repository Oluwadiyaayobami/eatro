const mongoose = require('mongoose')

const todoschema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    }
  },
  { timestamps: true } 
)

const cerateingtodo = mongoose.model('Todo', todoschema)
module.exports = cerateingtodo
