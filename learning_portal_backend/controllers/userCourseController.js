import UserCourse from "../models/userCourseModel.js";

export const InsertUserCourse = async (req,res)=>{

    const {user_id,course_id}=req.body;
    console.log("gg",user_id,course_id);
    
    try{
        const checkData = await UserCourse.find({user_id,course_id})
        if(checkData.length>0){
            return res.status(404).json({message:"Course Already Purchased"})
        }

        const insertCourse = await UserCourse.create({user_id,course_id})
          if(insertCourse){
             return res.status(200).json({message:"Inserted successfully"})
        }
        return res.status(404).json({message:"Not Inserted"})
    }
    catch(err){
        return res.status(500).json({message:"Failed to insert"})
    }
}

