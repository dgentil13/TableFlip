const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameboardSchema = new Schema({
    name: String,
    description: String,
    image_url: String,
    numbermax: Number,
    numbermin: Number,
    time: String,
}, {
    timestamps: true
  });

const Gameboard = mongoose.model('Gameboard', gameboardSchema);

module.exports = Gameboard;