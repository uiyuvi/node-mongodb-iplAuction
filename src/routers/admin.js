const express = require("express");
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

adminRouter.patch('/editPlayer/:playerId', adminAuth, async function (req, res) {
    console.log("edit player", req.params.playerId, req.body.name);

    const updatedResponse = await Players.updateOne({ _id: req.params.playerId }, { name: req.body.name });
    return res.status(200).json(updatedResponse);
});

adminRouter.patch('/playerBought/:teamName', adminAuth, async function (req, res) {
    console.log("edit player bought", req.params.teamName, req.body.id);
    Players.find({ _id: req.body.id }, async function (err, data) {
        console.log('inside find player playerBought', req.body.id)
        if (err) {
            console.log('error')
            return res.status(400).json({ error: err });
        }
        if (data && data.length > 0) {
            const updatedResponse = await Players.updateOne({ _id: req.body.id }, { bought_by: data[0].bidded_by, unsold: false });
            return res.status(200).json(updatedResponse);
        }
        console.log('player not found', req.params.playerId)
        return res.status(400).json({ error: "invalid request" });
    });
});


adminRouter.patch('/players/bid/:playerId', adminAuth, async function (req, res) {
    console.log("edit player bought", req.body.teamName, req.params.playerId);
    Players.find({ _id: req.params.playerId }, async function (err, data) {
        console.log('inside find player bid', req.params.playerId)
        if (err) {
            console.log('error')
            return res.status(400).json({ error: err });
        }
        if (data && data.length > 0) {
            console.log('originalsoldprice', data[0].sold_price, 'base price', data[0].base_price)
            let soldPrice = data[0].sold_price;
            if (soldPrice === 0) {
                soldPrice = data[0].base_price;
            }
            if (1000000 <= soldPrice && soldPrice < 10000000) {
                soldPrice += 500000;
            } else if (10000000 <= soldPrice && soldPrice < 50000000) {
                soldPrice += 1000000;
            } else if (50000000 <= soldPrice && soldPrice < 100000000) {
                soldPrice += 2500000;
            } else if (100000000 <= soldPrice && soldPrice < 200000000) {
                soldPrice += 5000000;
            } else if (200000000 <= soldPrice) {
                soldPrice += 10000000;
            }
            const updatedResponse = await Players.updateOne({ _id: req.params.playerId }, { bidded_by: req.body.teamName, sold_price: soldPrice });
            return res.status(200).json(updatedResponse);
        }
        console.log('player not found', req.params.playerId)
        return res.status(400).json({ error: "invalid request" });
    });
});

adminRouter.delete('/deletePlayer/:playerId', adminAuth, async function (req, res) {
    console.log("delete player", req.params.playerId, req.body.name);

    const updatedResponse = await Players.deleteOne({ _id: req.params.playerId });
    return res.status(200).json(updatedResponse);
});

adminRouter.get('/viewPlayers/:teamName', adminAuth, (req, res) => {
    console.log("view player", req.params.teamName)

    Players.find({ bought_by: req.params.teamName }, function (err, data) {
        console.log('inside find player', req.params.teamName)
        if (err) {
            console.log('error')
            return res.status(400).json({ error: err });
        }
        if (data && data.length > 0) {
            console.log('user with same name exist', data)
            return res.status(200).json(data);
        }
        console.log('player not found', req.params.teamName)
        return res.status(400).json({ error: "invalid request" });
    });
});

adminRouter.get('/displayPlayer/:count', adminAuth, (req, res) => {
    console.log("display player", req.params.count, req.query.type);
    Players.find(function (err, fgh) {
        if (err) return console.error(err);
        console.table(JSON.stringify(fgh));
    });
    Players.aggregate(
        [
            { $sort: { base_price: -1 } },
            { $match: { unsold: true, type: req.query.type, displayed_count: parseInt(req.params.count) } },
            { $limit: 1 },
            // { $set: { displayed_count: parseInt(req.params.count) + 1 } }
        ]).
        exec(async function (err, response) {
            if (err) {
                console.log('player not found', req.query.type)
                return res.status(400).json({ error: "invalid request" });
            }
            await Players.updateOne({ _id: response[0]._id }, { displayed_count: parseInt(req.params.count) + 1 });
            Players.find({ _id: response[0]._id }, function (err, data) {
                console.log('display player', data)

                return res.status(200).json(data);
            })
        })


});

module.exports = adminRouter;