import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
     status: {
      type: Number, 
      default: 0,
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;