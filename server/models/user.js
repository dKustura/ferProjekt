const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const validator = require('../services/validators');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const Photo = require('./photo');
const uploadDirectory = require('../config').uploadDirectory;

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
    required: [true, 'User password is required'],
    select: false
  },

  dateOfBirth: {
    type: Date,
    validate: {
      validator: validator.validateDate,
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

  requests: [{
    type: ObjectId,
    ref: 'User'
  }],

  messages: [{
    type: ObjectId,
    ref: 'Message'
  }],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// FIX provjera je li profilna slika
userSchema.methods.isAllowedToView = function(filePath) {
  console.log(filePath);
  const url = uploadDirectory.substr(0, uploadDirectory.length - 1) + filePath;
  return Photo.findOne({url}).deepPopulate('user').then((photo) => {
    return this.id === photo.user.id || this.contacts.find((contact) => {
      return contact == photo.user.id;
    }) !== undefined;
  });
};

userSchema.methods.getMessagesSeparated = function() {
  return this.model('User').findById(this.id).deepPopulate([
    'messages',
    'messages.sender',
    'messages.receiver'
  ]).then((user) => {
    var newMessages = Array.from(new Set(
      user.messages.filter((message) => {
        return !message.isSeen && message.sender.id !== this.id
      }).map((message) => {
          return message.sender;
        })
    ));
    var oldMessages = Array.from(new Set(
      user.messages.filter((message) => {
        var other = getOtherUser(this, message);
        return message.sender.id === this.id
          && newMessages.find((user) => {
            return user.id === other.id;
        }) === undefined;
      }).map((message) => {
          return getOtherUser(this, message);
        })
    ));
    // if(next) {
    //   next({user, newMessages, oldMessages});
    // }
    return {user, newMessages, oldMessages};
  });
};

function getOtherUser(user, message) {
  return message.sender.id === user.id ? message.receiver : message.sender;
};

userSchema.plugin(deepPopulate, {
  populate: {
    'posts': {
      options: {
        sort: {postedAt: -1}
      }
    },
    'messages': {
      options: {
        sort: {sentAt: 1}
      }
    }
  }
});

userSchema.index({firstName: 'text', lastName: 'text'});

module.exports = mongoose.model('User', userSchema);
