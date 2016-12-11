const mongoose = require('mongoose');
const validateURL = require('../services/validators').validateURL;
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const photoSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },

  url: {
    type: String,
    validate: {
      validator: validateURL,
      message: 'URL is not valid'
    },
    required: [true, 'Photo URL is required']
  },

  likes: [{
    type: ObjectId,
    ref: 'User'
  }],

  comments: [{
    type: ObjectId,
    ref: 'Comment'
  }],

  description: String,

  createdAt: {
    type: Date,
    default: Date.now
  },

  photoAlbum: {
    type: ObjectId,
    ref: 'Album'
  }
});

photoSchema.plugin(deepPopulate);

module.exports = mongoose.model('Photo', photoSchema);
