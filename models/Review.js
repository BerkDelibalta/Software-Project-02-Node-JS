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

reviewSchema.statics.calculateAverageRating = async function (productId) {
    const result = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                numOfReviews: { $sum: 1 },
            },
        },
    ]);
    try {
        await this.model('Product').findOneAndUpdate({ _id: productId }, {
            averageRating: Math.ceil(result[0]?.averageRating || 0),
            numOfReviews: Math.ceil(result[0]?.numOfReviews || 0),
        });
    } catch (error) {

    }
}

reviewSchema.post('save', async function () {
    await this.constructor.calculateAverageRating(this.product);
})

reviewSchema.post('remove', async function () {
    await this.constructor.calculateAverageRating(this.product);
})

module.exports = mongoose.model('Review', reviewSchema);