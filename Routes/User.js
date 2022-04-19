const express = require('express');
const router = express.Router();

// import functions from Route-Functions/User-Functions/index.js;
const { 
    getUser,
    addUser,
    deleteUser,
    updateUser
 } = require("../Route-Functions/User-Functions/index.js");


router.get('/', (req, res) => {
    getUser(req.query.email, (data) => {
        if(data === false){
            res.status(400).json({
                message: "Unable to get user data from database"
            });
        } else {
            res.status(200).json({
                data
            });
        }
    });
});


router.post('/', (req, res) => {
    addUser(req.body.email, (data) => {
        if(data === false){
            res.status(500).send("Error creating user.");
        } else {
            res.status(200).send("User created.");
        }
    });
});


router.put('/', (req, res) => {
    updateUser(req.body.email, req.body.portfolioID, (data) => {
        if(data === false){
            res.status(500).send("Error updating user.");
        } else {
            res.status(200).send("User updated.");
        }
    });
});


router.delete('/', (req, res) => {
    deleteUser(req.body.email, (data) => {
        if(data === false){
            res.status(500).send("Error deleting user.");
        } else {
            res.status(200).send("User deleted.");
        }
    });
});


module.exports = router;
