const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

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

albumSchema.plugin(deepPopulate);

module.exports = mongoose.model('Album', albumSchema);
