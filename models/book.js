const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  category: String,
  published_at: Date,
  total_book: Number,
  remain_book: Number,
  bills: [
    {
      bill_info: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Bill",
        },
      },
    },
  ],
});

module.exports = mongoose.model("Book", bookSchema);
