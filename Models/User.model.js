const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1,
        maxlength: 100,
    },
    portfolioID: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1,
        maxlength: 100,
    },
});

module.exports = User = mongoose.model('User', UserSchema);

