const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const messageSchema = new Schema({

    title: {
        type: String,
        required: [true, 'Message title is required']
    },

    content: {
        type: String,
        required: [true, 'Message content is required']
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