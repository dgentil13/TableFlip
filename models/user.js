const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
  email: {type: String, unique: true},
  googleID: String,
  firstName: String,
  lastName: String,
  description: String,
  // location: { type: { type: String }, coordinates: [Number] },
}, {
    timestamps: true
  });

const User = mongoose.model('User', userSchema);

module.exports = User;