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
    imageUrl: { type: String, default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
