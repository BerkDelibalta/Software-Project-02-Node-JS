const Review = require('../models/Review');
const Product = require('../models/Product');
const http = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

const createReview = async (req, res) => {
    const { product: productId } = req.body;

    const isValidProduct = await Product.findOne({ _id: productId });

    if (!isValidProduct) {
        throw new CustomError.NotFoundError(`No Product with id :  ${productId}`);
    }

    const alreadySubmitted = await Review.findOne({
        product: productId,
        user: req.user.userId
    })

    if (alreadySubmitted) {
        throw new CustomError.BadRequestError(
            'Already submitted review for this product');
    }

    res.body.user = req.user.userId;
    const review = await Review.create(req.body);
    res.status(http.StatusCodes.CREATED).json({ review })
}

const getAllReviews = async (req, res) => {
    const reviews = await Review.find({})
        .populate({
            path: 'product',
            select: 'name company price'
        });
    res.status(http.StatusCodes.OK).json({ reviews, count: reviews.length });
}

const getSingleReview = async (req, res) => {
    const { id: reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
        throw new CustomError.NotFoundError(`The review with id ${reviewId} does not exist`);
    }
    res.status(http.StatusCodes.OK).json({ review });
}

const updateReview = async (req, res) => {
    const { id: reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId });
    if (!review) {
        throw new CustomError.NotFoundError(`The review with id ${reviewId} does not exist`);
    }

    checkPermissions(req.user, review.user);

    const { rating, title, comment } = req.body;

    review.rating = rating;
    review.title = title;
    review.comment = comment;

    await review.save();

    res.status(http.StatusCodes.OK).json({ review });
}

const deleteReview = async (req, res) => {
    const { id: reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
        throw new CustomError.NotFoundError(`Review with id ${reviewId} not found`);
    }

    checkPermissions(req.user, review.user);

    await review.delete();

    res.status(http.StatusCodes.OK).json({ review });
}


module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
}