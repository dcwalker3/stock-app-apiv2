const axios = require('axios');
const Portfolio  = require('../../Models/Portfolio.model');

const { getStockPrice } = require('../Stock-Functions/index');

function getPortfolioValue(portfolioID, Callback) {
    // Get the portfolio holdings from the database;
    Portfolio.findOne({portfolioID: portfolioID}, (err, portfolio) => {
        if(err){
            console.log(err);
            Callback(false);
        } else {
            // Get the stock prices from the API;
            let stockPrices = [];
            for(let i = 0; i < portfolio.stockHoldings.length; i++){
                let stockTicker = portfolio.stockHoldings[i].stockTicker;
                let stockQuantity = portfolio.stockHoldings[i].stockQuantity;
                let stockPrice = getStockPrice(stockTicker);
                stockPrices.push({stockTicker: stockTicker, stockPrice: stockPrice, stockQuantity: stockQuantity});
            }
            // Calculate the portfolio value;
            let portfolioValue = 0;
            for(let i = 0; i < stockPrices.length; i++){
                portfolioValue += stockPrices[i].stockPrice * stockPrices[i].stockQuantity;
            }
            // Update the portfolio value in the database;
            Portfolio.findOneAndUpdate({portfolioID: portfolioID}, {portfolioValue: portfolioValue}, (err, portfolio) => {
                if(err){
                    console.log(err);
                    Callback(false);
                } else {
                    Callback(portfolioValue);
                }
            });
        }
    })
}

function addPortfolio( userEmail, stockHoldings=[], Callback) {
    // Create a new portfolio in the database;
    let newPortfolio = new Portfolio({
        userEmail: userEmail,
        stockHoldings: stockHoldings,
    });

    console.log("User: " + userEmail);
    console.log("New Portfolio: " + newPortfolio);

    newPortfolio.save((err, portfolio) => {
        if(err){
            console.log(err);
            Callback(false);
        } else {
            Callback(true);
        }
    });
}

function getPortfolio(userEmail, Callback){
    Portfolio.findOne({userEmail: userEmail}, (err, portfolio) => {
        if(err){
            console.log(err);
            Callback(false);
        } else {
            if(portfolio){
                Callback(portfolio);
            } 
            else {
                addPortfolio(userEmail, function(portfolio){
                    Callback(portfolio);
                })
            }
        }
    });
}


function updatePortfolioPositions(userEmail, stockHoldings, Callback){
    Portfolio.findOneAndUpdate({userEmail: userEmail}, {stockHoldings: stockHoldings}, (err, portfolio) => {
        if(err){
            console.log(err);
            Callback(false);
        } else {
            if(portfolio){
                Callback(portfolio);
            } else {
                addPortfolio(userEmail, stockHoldings, function(portfolio){
                    Callback(portfolio);
                });
            }
        }
    });
}

module.exports = {
    getPortfolioValue,
    addPortfolio,
    getPortfolio,
    updatePortfolioPositions
}