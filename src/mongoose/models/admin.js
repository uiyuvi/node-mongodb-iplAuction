const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//setting up the admin schema
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String
            }
        }
    ]
});

//setting up the model
const Admin = mongoose.model("Admin", adminSchema);

//exporting admin model
module.exports = Admin;