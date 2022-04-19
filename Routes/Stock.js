const express = require("express");
const router = express.Router();

// import functions from Route-Functions/Stock-Functions/index.js;
const { 
    createNewStock,
    getStockData
 } = require("../Route-Functions/Stock-Functions/index.js");

router.get("/", (req, res) => {
    getStockData(req.query.stockTicker, (data) => {
        if(data === false){
            res.status(400).json({
                message: "Unable to get stock data from finnhub API"
            });
        } else {
            res.status(200).json({
                data
            });
        }
    });
});

router.post("/" , (req, res) => {
    let results = createNewStock(req.body.stockTicker, getStockData(req.body.stockTicker));
    if(results === false){
        res.status(500).send("Error creating stock.");
    } else {
        res.status(200).send(results);
    }
});

module.exports = router;