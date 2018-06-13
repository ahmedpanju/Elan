const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  category: String,
  image: String,
  price: String,
});

module.exports = mongoose.model('Products', productSchema)
