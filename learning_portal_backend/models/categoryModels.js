import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: true,
      
    },
    status: {
      type: Number, 
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true, 
  }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
