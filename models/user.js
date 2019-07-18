const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, unique: true },
    password: String,
    email: { type: String, unique: true },
    status: { type: String, enum: ["Active", "Pending"], default: "Pending" },
    confirmationCode: String,
    googleID: String,
    firstName: String,
    lastName: String,
    description: String,
    address: String,
    imageUrl: String
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
