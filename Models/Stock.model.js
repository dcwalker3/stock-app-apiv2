const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    stockTicker: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1,
        maxlength: 5,
    },
    stockName: {
        type: String,
        trim: true,
        minlength: 1,
        maxlength: 100,
    },
    stockPrice: {
        type: Number,
        min: 0,
        max: 1000000,
    },
    dailyHigh: {
        type: Number,
        min: 0,
        max: 1000000,
    },
    dailyLow: {
        type: Number,
        min: 0,
        max: 1000000,
    },
    dailyChange: {
        type: Number,
        min: 0,
        max: 1000000,
    },
    dailyChangePercent: {
        type: Number,
        min: 0,
        max: 1000000,
    },
    dailyVolume: {
        type: Number,
        min: 0,
        max: 1000000,
    },
}, {timestamps: true});

module.exports = Stock = mongoose.model('Stock', StockSchema);

