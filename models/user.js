const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {type: String, unique: true},
  password: String,
  email: {type: String, unique: true},
  googleID: String,
  firstName: String,
  lastName: String,
  description: String,
  address: String,
}, {
    timestamps: true
  });

const User = mongoose.model('User', userSchema);

module.exports = User;