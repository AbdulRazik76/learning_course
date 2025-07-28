import Category from "../models/categoryModels.js"; 

export async function insertCategory(req, res) {
  const { category_name, status } = req.body;
  console.log(req.body);
  try {
    const existingCategory = await Category.findOne({ category_name });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // const newCategory = new Category({
    //   category_name,
    //   status
    // });

    // await newCategory.save();
    await Category.create({category_name, status})
                        //await newCategory.save();
    return res.status(200).json({ message: "Category successfully inserted" });

  } catch (err) {
    return res.status(500).json({ message: "Error: " + err.message });
  }
}


export async function getCategory(req, res) {
  try {
    const category_get = await Category.find(); // Fetch all categories
    return res.json({ category_get });
  } catch (err) {
    return res.status(500).json({ message: "Error: " + err.message });
  }
}

export async function deleteCategory(req, res) {
  const { id } = req.params;
  console.log("id", id);

  try {
    const deletedCategory = await Category.deleteOne({ _id: id });  // <-- Use _id instead of id

    if (deletedCategory.deletedCount > 0) {
      return res.json({ message: "Deleted Successfully" });
    } else {
      return res.status(404).json({ message: "Category not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error: " + err.message });
  }
}


export async function updateCategory(req, res) {
  const { id } = req.params;
  const { category_name, status } = req.body;
console.log("id",id,category_name, status);

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { category_name, status },
      { new: true } // This option returns the updated document
    );

    if (updatedCategory) {
      return res.json({ message: "Update Successfully", data: updatedCategory });
    } else {
      return res.status(404).json({ message: "Category Not Found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error: " + err.message });
  }
}




