const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentsSchema = new Schema({
    title: String,
    owner: Schema.Types.ObjectId,
    description: String,
}, {
    timestamps: true
  });

const Comments = mongoose.model('Comments', commentsSchema);

module.exports = Comments;