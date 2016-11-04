const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const albumSchema = new Schema({

  user: {
     type: ObjectId,
     ref: 'User'
  },

  title: {
    type: String,
    required: true
  },

  description: String,

  createdAt: {
    type: Date,
    default: Date.now
  },

  photos: [{
    type: ObjectId,
    ref: 'Photo'
  }],
});

module.exports = mongoose.model('Album', albumSchema);
