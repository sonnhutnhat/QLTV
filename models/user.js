const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  password: String,
  joined: { type: Date, default: Date.now() },
  gender: String,
  isAdmin: { type: Boolean, default: false },
  point: {
    type: Number,
    default: 5
  },

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

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
