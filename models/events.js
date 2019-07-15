const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventsSchema = new Schema({
    title: String,
    type: {
        type: String,
        enum: ['boardgame', 'cardgame', 'tabletoprpg']
    },
    owner: Schema.Types.ObjectId,
    description: String,
    players :[
     { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    comments: [
        {
        commentsID: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
        }
      ],
}, {
    timestamps: true
  });

const Events = mongoose.model('Events', eventsSchema);

module.exports = Events;