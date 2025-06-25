const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true // You can set to false if not always needed
  },
  price: {
    type: Number,
    required: true
  },
  added_to_cart: {
    type: Boolean,
    default: false
  },
  date_of_purchase: {
    type: Date,
    default: Date.now
  }
});
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;


