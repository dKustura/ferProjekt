const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const MAX_LENGTH = 8000;

const commentSchema = Schema({
  content: {
    type: String,
    max: [MAX_LENGTH, `Comment must not be longer than ${MAX_LENGTH} characters`],
    required: [true, 'Comment content is required']
  },

  user: {
    type: ObjectId,
    ref: 'User'
  },

  likes: [{
    type: ObjectId,
    ref: 'User'
  }],

  createdAt: {
    type: Date,
    default: Date.now
  
});

module.exports = mongoose.model('Comment', commentSchema);
