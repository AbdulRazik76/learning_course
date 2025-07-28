import User from '../models/loginmodles.js';
import jwt from "jsonwebtoken";
export const createUserAuth = async (req, res) => {

    const { name, email, password, role } = req.body;
    try {
        const useCheck = await User.findOne({ email })
        if (useCheck) return res.status(400).json({ message: "User Already Exist" })

        const userCreate = await User.create({ name, email, password, role })
        if (userCreate) return res.status(200).json({ message: "Successfully Inserted" })

    }
    catch (err) {
        return res.status(500).json({ message: "Error: " + err.message })
    }

}


export const loginUserAuth = async (req, res) => {
    const { email, password } = req.body;

    try {

        const userCheck = await User.findOne({ email })
        
        
        if(!userCheck || userCheck.password !== password){
            return res.status(401).json({ message: "User Not available" })
        }
        
        // if (userCheck) return res.status(200).json({ message: "User available" })
        const token = jwt.sign({id:userCheck._id}, process.env.JWT_SECRET,{expiresIn:'1d'})

         res.json({token,userId:userCheck._id,userDetails:userCheck })

       
    }
    catch (err) {
        return res.status(500).json({ message: "Error: " + err.message })

    }
}



export const getDashboard = async (req,res)=>{
    // const {userId }= req.body

    try{

        const user = await User.findById(req.userId).select('-password')
        res.json({message:"Welcome to dashboard",user,token:req.headers.authorization})
    }
    catch(err){
        return res.status(500).json({ message: "Error: " + err.message })

    }
}

export const getAllUsers = async(req,res) =>{
  try{
    const fetchUsers =  await User.find()
    if(fetchUsers.length == 0){
     return res.status(400).json({error:"Failed to fetch"})
    }
    return res.status(200).json(fetchUsers)
  }
  catch(err){
        return res.status(500).json({ message: "Error: " + err.message })

    }
}

