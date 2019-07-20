const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentsSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    description: String,
}, {
    timestamps: true
  });

const Comments = mongoose.model('Comments', commentsSchema);

module.exports = Comments;