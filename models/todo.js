const mongoose = require('mongoose')

const todoschema = new mongoose.Schema({
    description :{
        type : String,
        requried :true
    },
    title :{
        type : String,
        required : true 
    }

})
const cerateingtodo = mongoose.model('todo',todoschema)
module.exports = cerateingtodo
