import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const MAX_LENGTH = 60000;

const postSchema = new Schema({

    user: {
        type: ObjectId,
        ref: 'User'
    },

    content: {
        type: String,
        required: true,
        max: [MAX_LENGTH, `Post must not be longer than ${MAX_LENGTH} characters`]
    },

    postedAt: {
        type: Date,
        default: Date.now
    },

    comments: [{
        type: ObjectId,
        ref: 'Comment'
    }],

    likes: [{
        type: ObjectId,
        ref: 'User'
    }],
});

module.exports = mongoose.model ('Post', postSchema);