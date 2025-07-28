import Employee from "../models/employeeModel.js";
import path from "path";

export async function InsertEmployee(req, res) {

  console.log("r",req.body);
  
  const { name, phone, email, designation } = req.body;
  const profilePhoto = req.file ? req.file.filename : null;

  try {
    const newEmployee = await Employee.create({
      name,
      phone,
      email,
      designation,
      profilePhoto
    });

    if (newEmployee) {
      return res.status(200).json({ message: "Successfully Inserted" });
    }

    return res.status(401).json({ message: "Not Inserted" });

  } catch (err) {
    return res.status(500).json({ message: "Error: " + err.message });
  }
}


export const getEmployee = async (req,res) =>{
  try{
    const fetchEmployee = await Employee.find();
  
      return res.json({fetchEmployee})
  
   }
    catch (err) {
    return res.status(500).json({ message: "Error: " + err.message });
  }

}


export const deleteEmployee = async (req,res) =>{
  const {id} = req.params

  try{
    const deleteEmployee = await Employee.findOneAndDelete({_id:id})
    if(deleteEmployee.deleteCount>0){
      return res.json({ message: "Deleted Successfully" });
    }
    else{
      return res.json({ message: "Employee not found" });

    }
  }
  catch(err){
    return res.status(500).json({ message: "Error: " + err.message });

  }
}