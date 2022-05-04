const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: [true, 'Please provide rating'],
        min: 1,
        max: 5
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'Please provide a review title'],
        maxlength: [100, 'Please write a title less than 50 characters']
    },
    comment: {
        type: String,
        required: [true, 'Please write a comment']
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,

    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true,
    }
},
    { timestamps: true });

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);