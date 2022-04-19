const User = require('../../Models/User.model');
const Portfolio = require('../../Models/Portfolio.model');



function getUser(email,Callback){
    User.findOne({email: email}, (err, user) => {
        if(err){
            console.log(err);
            Callback(err);
        }
        if(user == null){
            addUser(email, (user) => {
                Callback(user);
            });
        } else{
            Callback(user);
        }
    });
}


function addUser(email, Callback){
      
    const newPortfolio = new Portfolio({
        userEmail: email,
    });


    newPortfolio.save((err, portfolio) => {
        if(err){
            console.log(err);
            Callback(err);
        } else {
            const newUser = new User({
                userEmail: email,
                portfolioID: portfolio._id,
            });
            
            newUser.save((err, user) => {
                if(err){
                    console.log(err);
                    Callback(err);
                } else {
                    Callback(user);
                }
            });
        }
    });
}


function deleteUser(email, Callback){
    User.deleteOne({email: email}, (err, user) => {
        if(err){
            console.log(err);
            Callback(err);
        }
        else {
            Portfolio.deleteOne({userEmail: email}, (err, portfolio) => {
                if(err){
                    console.log(err);
                    Callback(err);
                }
                else {
                    Callback(true);
                }
            })
        }
    });
}


function updateUser(email, portfolioID, Callback){
    User.updateOne({email: email}, {portfolioID: portfolioID}, (err, user) => {
        if(err){
            console.log(err);
            Callback(err);
        }
        Callback(true);
    });
}

module.exports = {
    getUser,
    addUser,
    deleteUser,
    updateUser,
}