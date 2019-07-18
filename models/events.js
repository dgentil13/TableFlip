const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventsSchema = new Schema({
    title: String,
    type: {
        type: String,
        enum: ['boardgame', 'cardgame', 'tabletoprpg']
    },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    description: String,
    players : [
        { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    choosegame: { type: Schema.Types.ObjectId, ref: 'Gameboard' },
    cardGameName: String,
    numberplayers: Number,
    address: String,
    date: String,
    comments: [
        { type: Schema.Types.ObjectId, ref: 'Comments' }
      ],
}, {
    timestamps: true
  });

const Events = mongoose.model('Events', eventsSchema);

module.exports = Events;