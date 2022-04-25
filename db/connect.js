const mongoose = require('mongoose');

const connectDB = (url) => {
  return mongoose.connect('mongodb+srv://ecommerce:ecommerce@ecommercecloud.cfyhi.mongodb.net/EcommerceDatabase?retryWrites=true&w=majority');
};

module.exports = connectDB;
