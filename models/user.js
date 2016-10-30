import mongoose from 'mongoose';
import {validateName, validateEmail, validateDate} from '../services/validators';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
    firstname: {
        type: String,
        validate: {
            validator: validateName,
            message: 'Firstname is not valid'
        },
        required: [true, 'First name is required']
    },

    lastname: {
        type: String,
        validate: {
            validator: validateName,
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
            validator: validateDate,
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


module.exports = mongoose.model('User', userSchema);;