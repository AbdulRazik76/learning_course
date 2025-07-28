import mongoose from 'mongoose';


const connectDB = async ()=>{

try{
  
    await mongoose.connect(process.env.MONGOURI)
    console.log('Connected Mongoose')

}
catch(err){
console.error('Not Connected',err.message)
}

}  
export default connectDB;