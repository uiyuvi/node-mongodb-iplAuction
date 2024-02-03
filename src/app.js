const express = require("express");
const adminRouter = require("./routers/admin");
require("./mongoose/db/mongoose");
const Admin = require('./mongoose/models/admin');
const jwt = require("jsonwebtoken");
//setting up express router
const app = express();

//setting up the express middlewares
app.use(express.json());
app.use(adminRouter);

app.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        const admin = await Admin.findOne({ name });
        if (!admin || password !== admin.password) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token
        const token = jwt.sign({ _id : admin._id }, 'xeEo2M0ol8CeWr7Nw2g2GjH8QEUK4dyyKCHi4TYJK6znm5fuAHIIPHSQ5YvdVcLlnaxppN64xK6xbhRileWvIlzCEqrBMCiITD8z', {
            expiresIn: '1h', // Set token expiration time
        });

        // Update admin's tokens array
        admin.tokens.push({ token });
        await admin.save();

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Server error.' });
    }
});

//exporting the app
module.exports = app;