const router = require('express').Router();

// import functions from Route-Functions/Portfolio-Functions/index.js;
const { 
    getPortfolio
 } = require("../Route-Functions/Portfolio-Functions/index.js");

router.get('/', (req, res) => {
    getPortfolio(req.query.email, (data) => {
        if(data === false){
            res.status(400).json({
                message: "Unable to get portfolio data from database"
            });
        } else {
            res.status(200).json({
                data
            });
        }
    });
});

module.exports = router;