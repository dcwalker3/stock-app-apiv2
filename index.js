const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors({
    origin: "*",
}));

// Import dotenv so we can get the PORT and DB_CONNECTION_STRING out of the .env.local file
require('dotenv').config();
const port = process.env.PORT || 4000;

// Enable json for req and res on server
const bodyParser = require('body-parser');
app.use(bodyParser.json());


// Import DB connection;
const db = require("./DB/conn");

const stock = require("./Routes/Stock");
const user = require("./Routes/User");
const portfolio = require("./Routes/Portfolio");

app.use("/stock", stock);
app.use("/user", user);
app.use("/portfolio", portfolio);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});