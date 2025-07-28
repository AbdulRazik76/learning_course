import jwt from "jsonwebtoken";


const protect = (req,res,next) =>{
const token = req.headers.authorization;

if(!token) {
    return res.status(401).json ({msg:'No Token, Access denied'})
}


try{

    const decode = jwt.verify(token,process.env.JWT_SECRET)
        console.log("r",decode);
        
        req.userId = decode.id
        next()
    
}
catch(err){
    return res.status(401).json ({msg:'Invalid Token, Access denied'})

}



}

export default protect;