const mongoose = require('mongoose');
const validator = require('../services/validators');
const bcrypt = require ('bcryptjs');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
  firstName: {
    type: String,
    validate: {
      validator: validator.validateName,
      message: 'First name is not valid'
    },
    required: [true, 'First name is required']
  },

  lastName: {
    type: String,
    validate: {
      validator: validator.validateName,
      message: 'Last name is not valid'
    },
    required: [true, 'Last name is required']
  },

  email: {
    type: String,
    validate: {
      validator: validator.validateEmail,
      message: 'Email is not valid'
    },
    required: [true, 'User email is required'],
    unique: [true, 'Email is already in use']
  },

  password: {
    type: String,
    required: [true, 'User password is required']
  },

  dateOfBirth: {
    type: Date,
    validate: {
      validator: validator.validateDateOfBirth,
      message: 'Date of birth is not valid'
    }
  },

  profilePhoto: {
    type: ObjectId,
    ref: 'Photo'
  },

  photoAlbums: [{
    type: ObjectId,
    ref: 'Album'
  }],

  photos: [{
    type: ObjectId,
    ref: 'Photo'
  }],

  posts: [{
    type: ObjectId,
    ref: 'Post'
  }],

  contacts: [{
    type: ObjectId,
    ref: 'User'
  }],

  messages : [{
    type: ObjectId,
    ref: 'Message'
  }]

});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);;
