const mongoose = require("mongoose");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
require("./mongoose");

const adminObjectID = new mongoose.Types.ObjectId();

const admin = {
    _id: adminObjectID,
    name: "IPL Admin",
    password: "Ipl@1234",
    tokens: [
        {
            token: jwt.sign({_id: adminObjectID}, "xeEo2M0ol8CeWr7Nw2g2GjH8QEUK4dyyKCHi4TYJK6znm5fuAHIIPHSQ5YvdVcLlnaxppN64xK6xbhRileWvIlzCEqrBMCiITD8z"),
        }
    ]
}

const setUpDatabase = async () => {
    await Admin.deleteMany();
    await new Admin(admin).save();
    await mongoose.disconnect();
}

setUpDatabase();