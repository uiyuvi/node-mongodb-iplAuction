const mongoose = require("mongoose");

//set the validations for fields as mentioned in the problem statement

//setting up the players schema
const playersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        // Built in match validator.
        match: /[a-zA-Z]+$/,
    },
    age: {
        type: Number,
        required: true,
        min: 15
    },
    type: {
        type: String,
        required: true,
        enum : ["Batsman", "Bowler", "All-rounder"]
    },
    bats: {
        type: String,
        required: true,
    },
    bowls: {
        type: String,
        required: true,
    },
    bowling_style: {
        type: String,
        required: true,
    },
    bat_avg: {
        type: Number,
        default: 0.00
    },
    bowl_avg: {
        type: Number,
        default: 0.00
    },
    bat_strike_rate: {
        type: Number,
        default: 0.00
    },
    bowl_strike_rate: {
        type: Number,
        default: 0.00
    },
    catches: {
        type: Number,
        default: 0
    },
    run_outs: {
        type: Number,
        default: 0
    },
    thirtys: {
        type: Number,
        default: 0
    },
    fifties: {
        type: Number,
        default: 0
    },
    centuries: {
        type: Number,
        default: 0
    },
    three_WH: {
        type: Number,
        default: 0
    },
    five_WH: {
        type: Number,
        default: 0
    },
    highest_runs: {
        type: Number,
        default: 0
    },
    best_bowling: {
        type: String,
        default: "0/0"
    },
    overseas: {
        type: Boolean,
        default: false
    },
    displayed_count: {
        type: Number,
        default: 0
    },
    unsold: {
        type: Boolean,
        default: true
    },
    base_price: {
        type: Number,
        default: 1000000,
    },
    sold_price: {
        type: Number,
        default: 0
    },
    bought_by: {
        type: String,
        default: ""
    },
    bidded_by: {
        type: String,
        default: ""
    }
});

//setting up players model
const Players = mongoose.model("Players", playersSchema);

//exporting the players collection
module.exports = Players;