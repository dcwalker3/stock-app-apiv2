
const mongoose = require('mongoose');

require('dotenv').config();

const db_connection_string = process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/Stock-Appv2';

const db = mongoose.connect(db_connection_string)

module.exports = {db}