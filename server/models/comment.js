const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const MAX_LENGTH = 8000;

const commentSchema = new Schema({

  content: {
    type: String,
    maxlength: [MAX_LENGTH, `Comment must not be longer than ${MAX_LENGTH} characters`],
    required: [true, 'Comment content is required']
  },

  user: {
    type: ObjectId,
    ref: 'User'
  },

  post: {
    type: ObjectId,
    ref: 'Post'
  },

  photo: {
    type: ObjectId,
    ref: 'Photo'
  },

  likes: [{
    type: ObjectId,
    ref: 'User'
  }],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

commentSchema.plugin(deepPopulate);

module.exports = mongoose.model('Comment', commentSchema);
