const express = require("express");
require("../mongoose/db/mongoose");
const adminAuth = require('../middlewares/adminAuth'); // Import the middleware
const Players = require("../mongoose/models/players")
//setting up the admin router
const adminRouter = express.Router();

//write your code for admin endpoints here

adminRouter.post('/addPlayer', adminAuth, (req, res) => {
    console.log("addplayer", req.body)

    Players.find({ name: req.body.name }, function (err, data) {
        console.log('inside find player', req.body.name)
        if (err) {
            console.log('error')
            return res.status(400).json({ error: err });
        }
        if (data && data.length > 0) {
            console.log('user with same name exist')
            return res.status(400).json({ error: "not possible to add user" });
        }
        console.log('about to create', req.body.name)
        Players.create(req.body, function (error, createdData) {
            if (error) {
                return res.status(400).json({ error: err });
            }
            return res.status(201).json("created");
        })
    });
});

module.exports = adminRouter;