const bcrypts = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const createnewpassword = require('../models/password.js')
const cookie = require('cookie-parser')
const authorisation = require('../middleware/authorisation.js')
const {login,register} = require('../models/usersschema.js')
const Cryptr  = require('cryptr')
const cerateingtodo = require('../models/todo.js')


const certingusers =  async (req,res) => {
    try{
        const {username , email ,password } = req.body
        
        const check = await register.findOne({$or: [{email:email},{username:username}]})
        if(check){
            res.status(400).json({
                status : 'failed',
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
            message : 'an error occured ',
            error : `${error}`
        })

    }

    
}
const loginusers = async(req,res) => {
    try{
            const {email, password} = req.body
            const ifuserexist =  await register.findOne({email})
            if(!ifuserexist){
                res.status(401).json({
                    status :'failed',
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
                        email: ifuserexist.email,
                        role: ifuserexist.role 
                    },process.env.jsonkey,{expiresIn :'30m'})
                    const refreshtoken = jsonwebtoken.sign({
                        userid : ifuserexist._id
                    },process.env.jsonrefresh,{expiresIn: '7d'})


                    // storeing refreshtokin on cookie
                    res.cookie('refreshtoken',refreshtoken,{
                                httpOnly: true,     
                                secure: true,         
                                sameSite: 'none',      
                                maxAge: 7 * 24 * 60 * 60 * 1000,
                    })
                    return res.status(200).json({
                        message: `welcome ${ifuserexist.username}`,
                        acesstoken :acesstoken,
                        
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
        const {userid,username} = req.acesstoken
        res.status(200).json({
            message : 'welcome to the user dashboard',
            userid,
            username

        })
        console.log(userid)
        
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            message: 'an error occured '
        })

    }
}
const refresh = async (req,res) => {
    try {
         const refreshToken = req.cookies.refreshtoken
         if(!refreshToken){
            res.status(401).json({
                message :'an error occured ',
                error
            })
         }
         else{
            // verify refresh 
            const verifyrefresh  = jsonwebtoken.verify(refreshToken,process.env.jsonrefresh)
            if(!verifyrefresh){
                res.status(401).json({
                    message:'an error occured ',
                    error
                })
            }
            else{
                const {userid,username} = req.acesstoken
                const newacesstoken = jsonwebtoken.sign({userid,username},process.env.jsonkey,{expiresIn: '15m'})

                return res.status(200).json({
                    accessToken: newacesstoken
                });
                

            }
         }
    }
    catch(error){
        res.status(500).json({
            message : 'failed',
            error
            
        })

    }
}
const passwormanager = async (req,res) =>{
    try{
        const {appName,username,password} = req.body
        const userId = req.acesstoken.userid
        const cryptr = new Cryptr(process.env.encriptionkey)
        const encrypted = cryptr.encrypt(password);

        
        const newpassword = await createnewpassword.create({
            username,
            appName,
            userId,
            password : encrypted
        })
        if(!newpassword){
            res.status(401).json({
                message: 'an error occured ',
                error
                
            })
        }
        else{
            return res.status(200).json({
                message: 'new password cerated',
                newpassword
            })
        }

    }
    catch(error){
        console.log(error)
        res.status(500).json({
            message : 'an error ocured ',
            error : `${error}}`
        })
    }


}
const allpassword = async (req,res) =>{
    try {
        const userid = req.acesstoken.userid
        const getall = await createnewpassword.find({userId:userid}).select('appName username password')
        if(getall.length === 0){
            res.status(404).json({
                message: 'no password found cerate a new one '
            })
        }
        else {
            const cryptr = new Cryptr(process.env.encriptionkey)
            const password = getall.map(p =>({
                appName :p.appName,
                username: p.username,
                password: cryptr.decrypt(p.password)
            }))
            

            
            return res.status(200).json({
                message: 'password found',
                passwords : password
            })
        }

    }
    catch(error){
        console.log(error)
        res.status(500).json({
            message : "an error occured "
        })

    }

}
const todomanager = async (req,res) => {
    try {
        const {description ,title} = req.body
        const userid = req.acesstoken.userid
        const addingnewlist = await cerateingtodo.create({
            description,
            title,
            userId :userid
        })
        if(!addingnewlist){
            res.status(400).json({
                message:'user not cerated',
                error : error.message
            })
        }
        else{
            return res.status(200).json({
                message:'user account cerated sucessfuly '
            })
        }

    }
    catch(error){
        console.log(error)
        res.status(500).json({
            message : 'an error occured ',
            error : error.message
        })

    }

}
const alltodo = async (req,res) =>{
    try {
        const userid  = req.acesstoken.userid
        const fetchingalltodo = await cerateingtodo.find({userId:userid}).select('description title createdAt')
        if(fetchingalltodo.length === 0){
            res.status(404).json({
                message : 'no information '
            })


        }
        else {
            const allinfo = fetchingalltodo.map(p =>({
            description:p.description,
            title:p.title,
            createdAt:p.createdAt

            }))
            return res.status(200).json({
                message : 'user found ',
                fetchingalltodo :allinfo
        })
        }

    }
    catch(error){
    console.log(error)
    res.status(500).json({
        message: 'an error occured ',
        error : error.message
    })
    }
    
}
module.exports = {certingusers,loginusers,userdashboard,refresh,passwormanager,allpassword,todomanager,alltodo}