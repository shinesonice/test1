const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomChatSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  messages: [
    {
      text: { type: String },
      isUser: { type: Boolean, required: true, default: true },
    },
  ],
});

module.exports = mongoose.model("RoomChat", RoomChatSchema);
