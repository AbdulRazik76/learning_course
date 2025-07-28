import mongoose from "mongoose";


const UserCourseSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    course_id:{
        type:String,
        required:true
    }

})

const  UserCourse = mongoose.model('User_courses',UserCourseSchema); 

export default UserCourse;