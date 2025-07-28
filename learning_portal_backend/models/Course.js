import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  status: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  videos: [{
    url: String,
    title: String
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add text index for search functionality
courseSchema.index({ name: 'text', description: 'text' });

const Course = mongoose.model('Course', courseSchema);
export default Course;