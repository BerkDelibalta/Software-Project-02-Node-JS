const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizePermissions } = require('../middleware/authentication');

const { createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage } = require('../controllers/productController');


router
    .route('/')
    .post([authenticateUser, authorizePermissions('admin')], createProduct)
    .get(getAllProducts);


router
    .route('/:id')
    .patch([authenticateUser, authorizePermissions('admin')], updateProduct)
    .delete([authenticateUser, authorizePermissions('admin')], deleteProduct)
    .get(getSingleProduct);

router
    .route('/uploadImage').post(authenticateUser, authorizePermissions('admin'), uploadImage);


module.exports = router;