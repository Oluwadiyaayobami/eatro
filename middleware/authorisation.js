const jsonwebtoken = require('jsonwebtoken')
const authorization = async (req,res,next)=>{
    const authorizationtoken = req.headers['authorization']
    console.log(authorization)
    if(!authorizationtoken){
        res.status(404).json({
            message : 'you are not authorised to this page pls login'
        })
    }
    else {
        const acesstoken = authorizationtoken.split(' ')[1]
         
        const verifyingtoken =  jsonwebtoken.verify(acesstoken,process.env.jsonkey)
        if(!verifyingtoken){
            res.status(400).json({
                message :'an error occured '
            })
            
        }
        
        else {
            req.acesstoken = verifyingtoken
            const role = verifyingtoken.role
            if(role === 'admin'){
                res.status(400).json({
                    message :'only users can acess this route '

                })
            }
            else{
                next()
            }
            
        }
        
    }
    
}
module.exports = authorization