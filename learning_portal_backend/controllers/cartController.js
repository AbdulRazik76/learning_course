import Employee from "../models/employeeModel.js";
import Course from "../models/Course.js"
import Cart from "../models/cartModel.js";


export const insertCart = async (req, res) => {

    const { user_id, course_id } = req.body;

    try {
        const checkUser = await Employee.findById({ _id: user_id })
        const checkCourse = await Course.findById({ _id: course_id })

        if (checkCourse && checkCourse) {
            var insertCart = await Cart.create({ user_id, course_id })
        }

        if (insertCart) {
            return res.status(200).json({ message: "Cart Inserted Successfully" })
        }
        return res.status(401).json({ message: "Not inserted" })
    }

    catch (err) {
        return res.status(500).json({ message: "Error: " + err.message });
    }
}





export const addToCart = async (req, res) => {
    const { user_id, course_id } = req.body;

    try {
        // Check if course exists
        const course = await Course.findById(course_id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if already in cart
        const existingCartItem = await Cart.find({ user_id, course_id });
        if (existingCartItem) {
            return res.status(400).json({ message: "Course already in cart" });
        }

        // Add to cart
        const newCartItem = new Cart({
            user_id,
            course_id
        });

        await newCartItem.save();

        return res.status(201).json({
            message: "Added to cart successfully",
            cartItem: newCartItem,
            courseDetails: course
        });

    } catch (err) {
        console.error("Error adding to cart:", err);
        return res.status(500).json({ message: "Error: " + err.message });
    }
};

export const getCart = async (req, res) => {
    const { user_id } = req.params;
    console.log('my', user_id);

    try {
        const cartItems = await Cart.find({ user_id,status:0 })
            .populate('course_id')
            .sort({ createdAt: -1 });

        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ message: "Cart is empty" });
        }

        // Calculate total price
        const total = cartItems.reduce((sum, item) => {
            return sum + (item.course_id?.price || 0);
        }, 0);

        return res.status(200).json({
            message: "Fetched successfully",
            cartItems,
            total
        });

    } catch (err) {
        console.error("Error fetching cart:", err);
        return res.status(500).json({ message: "Error: " + err.message });
    }
};


export const getCartCount = async (req, res) => {
    const { user_id } = req.params;

    try {
        const cartItems = await Cart.find({ user_id,status:0 })
            .populate('course_id')
            .sort({ createdAt: -1 });

        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ message: "Cart is empty" });
        }
        const cartCount = cartItems.length


        return res.status(200).json({
            message: "Fetched successfully",
            cartCount,
        });

    } catch (err) {
        console.error("Error fetching cart:", err);
        return res.status(500).json({ message: "Error: " + err.message });
    }
};

export const updateCart = async (req, res) => {
    const { user_id,course_id } = req.body
    
    try {
        for (let i = 0; i < course_id.length; i++) {
            const currentId = course_id[i]
            const cart = await Cart.findOneAndUpdate({ course_id: currentId,user_id:user_id }, { $set: { status: 1 } },)
             
            console.log("cart", cart);

        }
    } catch (error) {
        return res.status(500).json({ error })
    }
}