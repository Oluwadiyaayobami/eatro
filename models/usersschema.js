const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    role:{
        type :String,
        default :'user' ,
        required : true
    }
})

const loginschema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const register = mongoose.model('users', userschema)
const login = mongoose.model('login', loginschema)

module.exports = { register, login }
