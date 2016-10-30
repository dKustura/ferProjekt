import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const maxLen = 300;

const commentSchema = Schema({
    content: {
        type: String,
        max: [maxLen, `Comment must not be longer than ${maxLen} characters`]
    },

    user: {
        type: ObjectId,
        ref: 'User'
    },

    userLikes: [{
        type: ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Comment', commentSchema);