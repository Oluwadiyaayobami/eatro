const bcrypts = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const {login,register} = require('../models/usersschema.js')


const certingusers =  async (req,res) => {
    try{
        const {username , email ,password } = req.body
        
        const check = await register.findOne({$or: [{email:email},{username:username}]})
        if(check){
            res.status(400).json({
                message: 'user already exist ',
            })
        }
        else{
            const hassedpasword = await bcrypts.hash(password,10)
            const newuser = await register.create({
                username : username,
                email : email,
                password : hassedpasword
            }) 
            if(!newuser){
                res.status(404).json({
                    message : 'user not cerated an error occured '
                })
            }
            else{
                res.status(200).json({
                    message : 'user cerated sucessfully ',
                    userinformation : newuser
                })
            }
            
        }
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            message : 'an error occures ',
            error : error
        })

    }

    
}
const loginusers = async(req,res) => {
    try{
            const {email, password} = req.body
            const ifuserexist =  await register.findOne({email})
            if(!ifuserexist){
                res.status(401).json({
                    message : 'user not found',
                })
            }
            else{
                const checkpassword = await bcrypts.compare(password,ifuserexist.password)
                if(!checkpassword){
                    res.status(401).json({
                        message : 'invalid password pls try again '
                    })
                }
                else{
                    const acesstoken = jsonwebtoken.sign({
                        username : ifuserexist.username,
                        userid : ifuserexist._id,
                        email: ifuserexist.email
                    },process.env.jsonkey,{expiresIn :'15m'}) 

                    return res.status(200).json({
                        message: `welcome ${ifuserexist.username}`,
                        acesstoken :acesstoken
                    })

                }
            }
        }    
    catch(error){
        console.log(error)
            res.status(500).json({
                message : 'an error occured ',
                error: `${error}`
                
            })

        }
}
const userdashboard = async(req,res) => {
    try {
        res.status(200).json({
            message : 'welcome to the user dashboard'
        })

    }
    catch(error){
        console.log(error)
        res.status(500).json({
            message: 'an error occured '
        })

    }
}
module.exports = {certingusers,loginusers,userdashboard}