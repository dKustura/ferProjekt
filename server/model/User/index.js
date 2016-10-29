const mongoose = require('mongoose');
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
    firstname: {
        type: String,
        validate: {
            validator: nameValidator,
            message: 'Firstname is not valid'
        },
        required: [true, 'First name is required']
    },

    lastname: {
        type: String,
        validate: {
            validator: nameValidator,
            message: 'Lastname is not valid'
        },
        required: [true, 'Last name is required']
    },

    email: {
        type: String,
        validate: {
            validator: validateEmail,
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
            validator: dateValidator,
            message: 'Date of birth is not valid'
        }
    },

    profilePhoto: {
        type: ObjectId,
        ref: 'Photo'
    },

    photoAlbums: [{
        type: ObjectId,
        ref: 'Photo-Album'
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
  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt, null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};



module.exports = mongoose.model('User', userSchema);;