const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: 'string',
        required: true,
        minlength: 6,
        maxlength: 20,
        unique: true
    },
    password: {
        type: 'string',
        required: true,
        minlength: 6,
    },
    admin: {
        type: 'boolean',
        default: false
    },

}, { timestamps: true })

module.exports = mongoose.model('User', userSchema);