const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: String,
  name: String,
  price: String,
  status: String,
});

module.exports = mongoose.model('Cart', cartSchema)
