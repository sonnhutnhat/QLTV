const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },

  book: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    title: String,
  },

  date: { type: Date, default: Date.now() },

  deadDate: {
    type: Date,
    default: Date.now() + 7 * 24 * 60 * 60 * 1000
  },

  returnDate: {
    type: Date,
    default: null,
  },

  status: {
    // -1: trả muộn/quá hạn chưa trả, 0: đang mượn, 1: đã trả
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Bill", billSchema);
