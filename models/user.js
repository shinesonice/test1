const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  cart: [
    {
      prodId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
      qty: { type: Number, required: true },
    },
  ],
  role: { type: String, required: true, default: "CLIENT" },
  // CLIENT, ADMIN, COUNSELOR
});

module.exports = mongoose.model("User", UserSchema);
