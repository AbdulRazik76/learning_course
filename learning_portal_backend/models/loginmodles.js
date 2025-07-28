import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

name:String,
email: {type:String, unique:true},
password:String,
role:String,

})


 
const User = mongoose.model('User_modles', userSchema);

export default User;