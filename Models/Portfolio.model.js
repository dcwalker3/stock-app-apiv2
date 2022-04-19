const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1,
        maxlength: 100,
    },

    // stockHoldings is an array of objects that has the following properties:
    // stockTicker and stockQuantity
    stockHoldings: {
        type: Array,
        default: [],
        required: true,
        minlength: 1,
        maxlength: 100,
    },

    portfolioValue: {
        type: Number,
        default: 0,
        min: 0,
        max: 1000000,
    },
}, {timestamps: true});

module.exports = Portfolio = mongoose.model('Portfolio', PortfolioSchema);

