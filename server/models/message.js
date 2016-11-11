const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const MAX_LENGTH = 20000;

const messageSchema = new Schema({

  content: {
    type: String,
    required: [true, 'Message content is required'],
    max: [MAX_LENGTH, `Message must not be longer than ${MAX_LENGTH} characters`]
  },

  sentAt: {
    type: Date,
    default: Date.now()
  },

  sender: {
    type: ObjectId,
    ref: 'User'
  },

  receiver: {
    type: ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Message', messageSchema);
