import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  designation: String,
  profilePhoto: String, // store filename or relative path
  skills: [String]
});

export default mongoose.model("Employee", employeeSchema);
