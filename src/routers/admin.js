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

adminRouter.get('/viewPlayer/:playerId', adminAuth, (req, res) => {
    console.log("view player", req.params.playerId)

    Players.find({ _id: req.params.playerId }, function (err, data) {
        console.log('inside find player', req.params.playerId)
        if (err) {
            console.log('error')
            return res.status(400).json({ error: err });
        }
        if (data && data.length > 0) {
            console.log('user with same name exist', data[0])
            return res.status(200).json(data[0]);
        }
        console.log('player not found', req.params.playerId)
        return res.status(400).json({ error: "invalid request" });
    });
});

module.exports = adminRouter;