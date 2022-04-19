const axios = require('axios');

const Stock = require('../../Models/Stock.model');

require('dotenv').config();
const finnhub_api_key = process.env.FINNHUB_API_KEY || "c7cqcmqad3idhma6f4qg";

// Check if a ticker is in our database;
function checkIfTickerExists(ticker, Callback) {
    // Check if stock ticker exists in our database;
    Stock.findOne({stockTicker: ticker}, (err, stock) => {
        if(err){
            console.log(err);
            Callback(false);
        } else {
            if(stock){
                console.log(`Stock ${stock.stockTicker} exists in database`);
                console.log(stock);
                Callback(stock);
            } else {
                Callback(false);
            }
        }
    });
}

// Check what stock data is past 30 minutes old;
function checkIfStockDataIsOld(stockTicker) {
    const thirtyMinutes = 1800000;

    // Check if stock ticker exists in our database;
    Stock.find({stockTicker: stockTicker}, (err, stock) => {
        if(err){
            console.log(err);
            return(false);
        } else {
            if(stock){
                // Convet stock.updatedAt and date.now to unix timestamp;
                let stockDataAge = Date.now() - stock.updatedAt;
                if(stockDataAge > thirtyMinutes){
                    return(true);
                } else {
                    return(false);
                }
            } else {
                return(false);
            }
        }
    });
    
}

// Check what stock data is past 30 minutes old;
function checkIfStockDataIsOldBatch() {
    const thirtyMinutes = 1800000;

        Stock.find({}, (err, stocks) => {
            if(err){
                console.log(err);
                return(err);
            } else {
                let stocksToUpdate = [];
                for(let i = 0; i < stocks.length; i++){
                    let stock = stocks[i];
                    // Convet stock.updatedAt and date.now to unix timestamp;
                    let stockDataAge = Date.now() - stock.updatedAt;
                    if(stockDataAge > thirtyMinutes){
                        stocksToUpdate.push(stock);
                    }
                }
                return(stocksToUpdate);
            }
        });
    
}

// function to get stock data from the finnhub API for multiple stocks;
function getStockDataForBatch(stocks) {
    if(stocks.length < 1){
        return false;
    } else {
        // Iterate through array of stocks;
        stocks.map(stock => {

            // Launch API request to finnhub API;
            axios.get(`https://finnhub.io/api/v1/quote?symbol=${stock.stockTicker}&token=${finnhub_api_key}`)
            .then(response => {

                // Stock Data finnhub gave us;
                let stockData = response.data;
                updateStockData(stock.stockTicker, stockData);
                
            })
            .catch(err => {
                console.log(err);
                return false
            });
        });
    }
    return true;
}

// Get stock data for a single stock;
function getStockData(stockTicker, Callback){
    // Returns stock data from database if it exists.
    // Else returns false.
    checkIfTickerExists(stockTicker, (stock) => {
        if(stock){
            // Check if stock data is past 30 minutes old;
            if(stock.updatedAt < Date.now() - 1800000){
                // Launch API request to finnhub API;
                axios.get(`https://finnhub.io/api/v1/quote?symbol=${stockTicker}&token=${finnhub_api_key}`)
                .then(response => {
                    // Stock Data finnhub gave us;
                    let stockData = response.data;
                    
                    if(stock !== false){
                        updateStockData(stockTicker, stockData);
                    } else {
                        createNewStock(stockTicker, stockData);
                    }
                    // Callback to resolve the stock data;
                    console.log("Getting Data from Finnhub API");
                    console.log(stockData);
                    Callback(stock);
                })
                .catch(err => {
                    console.log(err);
                    Callback(false);
                });
                
            } else {
                // Stock data is less than 30 minutes old;
                Callback(stock);
            }
        } 
    });
}

// Function to update stock data in our database;
function updateStockData(stockTicker, data){
    if(data === false){
        // Unable to get stock data from finnhub API;
        return false;
    } else {
        let stockData = {
            stockPrice: data.c,
            dailyChange: data.d,
            dailyChangePercent: data.dp,
            dailyHigh: data.h,
            dailyLow: data.l,
            updatedAt: Date.now()
        }

        Stock.findOneAndUpdate({stockTicker: stockTicker}, stockData, (err, stock) => {
            if(err){
                // Log an error occured;
                console.log(`Error updating ${stock.stockTicker}`);
                return false;
            } else {
                // Log stock data updated;
                console.log(`Updated ${stock.stockTicker} at $${stock.stockPrice} at the time of ${stock.updatedAt}`);
                return true;
            }
        });
    }
}

// Function to create a new stock in our database;
function createNewStock(stockTicker, data){

    // Check if stock ticker exists in our database;
    if(checkIfTickerExists(stockTicker) === true){
        
        // Stock ticker already exists in our database;
        return false;
    } else {
        if(data === false){

            // Unable to get stock data from finnhub API;
            return false;
        } else {

            // Create new stock in our database;
            let newStock = new Stock({
                stockTicker: stockTicker,
                stockPrice: data.c,
                dailyChange: data.d,
                dailyChangePercent: data.dp,
                dailyHigh: data.h,
                dailyLow: data.l,
                updatedAt: Date.now()
            });

            // Save new stock to our database;
            newStock.save((err, stock) => {
                if(err){
                    console.log(`Error saving ${stockTicker}`);
                    console.log(err);
                    return false;
                } else {
                    // Log stock data created;
                    console.log(`Created ${stockTicker} at $${stock.stockPrice} at the time of ${stock.updatedAt}`);
                    return true;
                }
            });
        }
    }
}

// Export our functions;
module.exports = {
    checkIfTickerExists,
    checkIfStockDataIsOld,
    getStockDataForBatch,
    getStockData,
    updateStockData,
    createNewStock
}