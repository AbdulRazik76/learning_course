import Course from '../models/Course.js';
import Cart from '../models/cartModel.js';
import path from 'path';

export const createCourse = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      duration,
      level,
      status,
      description,
      videoTitles
    } = req.body;

    console.log('Body:', req.body);
    console.log('Files:', req.files);

    const images = req.files?.images?.map(file =>
      `/uploads/images/${file.filename}`
    ) || [];

    const videos = req.files?.videos?.map((file, index) => ({
      url: `/uploads/videos/${file.filename}`,
      title: Array.isArray(videoTitles)
        ? videoTitles[index]
        : videoTitles // if only one title was sent
    })) || [];

    const newCourse = new Course({
      name,
      category,
      price,
      duration,
      level,
      status,
      description,
      images,
      videos
    });

    await newCourse.save();

    res.status(200).json({
      success: true,
      message: 'Course created successfully',
      data: newCourse
    });
  } catch (error) {
    console.error('Create Course Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const getCourse = async (req, res) => {
  try {
    const courses = await Course.find().populate('category', 'category_name')
    .sort({createdAt:-1})
    res.json({ getCourse: courses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCourseUser = async (req, res) => {
  const { user_id } = req.body;
  console.log("user", user_id);

  try {
    // Get all courses and user cart
    const courses = await Course.find();
    const cart = await Cart.find({ user_id });

    // Create a map from course_id to cart status
    const cartMap = new Map();
    cart.forEach(item => {
      cartMap.set(item.course_id.toString(), item.status);
    });

    // Combine course with cart status if available
    const result = courses.map(course => {
      const status = cartMap.has(course._id.toString())
        ? cartMap.get(course._id.toString())
        : null;
      return {
        ...course.toObject(),
        status,
      };
    });

    res.json({ getCourse: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCourseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ 
      success: true,
      message: 'Course status updated',
      course: updatedCourse
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCourse = async(req,res)=>{
  const {id}=req.params;
  try{
    const deleteCourse = await Course.deleteOne({_id:id})
    if(deleteCourse.deletedCount > 0){
      return res.status(200).json({message:"Deleted successfully"})
    }
    else{
      return res.status(401).json({message:"Cant find course"})
    }
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const getCourseById = async (req, res) => {
  const {courseId} = req.body
  try {
    const courses = await Course.findOne({_id:courseId})
    .sort({createdAt:-1})
    
    res.json({ getCourse: courses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      category, 
      price, 
      duration, 
      level, 
      status, 
      description 
    } = req.body;

    // Find existing course
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Handle file upload if exists
    const imageUrl = req.file 
      ? `/uploads/course/${req.file.filename}`
      : existingCourse.images[0]; // Assuming single image from your pattern

    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        name: name || existingCourse.name,
        category: category || existingCourse.category,
        price: price || existingCourse.price,
        duration: duration || existingCourse.duration,
        level: level || existingCourse.level,
        status: status !== undefined ? status : existingCourse.status,
        description: description || existingCourse.description,
        images: [imageUrl] // Maintain your single image array pattern
      },
      { new: true }
    );

    res.json({ 
      message: 'Course updated successfully',
      course: updatedCourse 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};