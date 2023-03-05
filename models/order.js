const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  items: [
    {
      prodId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      qty: {
        type: Number,
        required: true,
      },
    },
  ],
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  state: {
    type: String,
    required: true,
    default: "Booked",
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
