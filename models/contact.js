const mongoose = require('mongoose')

// create schema
const getContacts = mongoose.model('Contact', {
    name: {
        type: String,
        required: true
    },
    noHP: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

module.exports = { getContacts }