const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  email: {type: String, unique: true},
  googleID: String,
  // firstName: String,
  // lastName: String,
  // role: {
  //   type: String,
  //   enum: ['GUEST', 'EDITOR', 'ADMIN'],
  //   default: 'GUEST'
  // },
  // gameInterests: String,
  // level: Number,
}, {
    timestamps: true
  });

const User = mongoose.model("User", userSchema);

module.exports = User;