const jwt = require("jsonwebtoken");
const Admin = require('../mongoose/models/admin');

//write your code for JWT token authentication for admin

// Middleware function to authenticate admin endpoints
async function adminAuth(req, res, next) {
    const secretToken = 'xeEo2M0ol8CeWr7Nw2g2GjH8QEUK4dyyKCHi4TYJK6znm5fuAHIIPHSQ5YvdVcLlnaxppN64xK6xbhRileWvIlzCEqrBMCiITD8z'; // Secret token for generating JWT

    // Extract the token from the request headers
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('token not correct')
        return res.status(400).json({ error: 'Please authenticate' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token part

    if (!token) {
        console.log('token not found')
        return res.status(400).json({ error: 'Please authenticate' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, secretToken);

        // Check if the decoded payload contains admin information (e.g., admin ID)
        if (decoded._id.length > 0) {
            // Admin is authenticated, proceed to the next middleware/route
            req.adminId = decoded._id; // Store admin ID for further use

            // Fetch the admin from the database (assuming you have an Admin model)
            const admin = await Admin.findById(req.adminId);
            if (!admin) {
                console.log('not an admin')
                return res.status(400).json({ error: 'Please authenticate' });
            }

            // Validate the token (optional step)
            if (!admin.tokens.filter((adminToken)=> adminToken.token === token).length > 0) {
                console.log('token not valid')
                return res.status(400).json({ error: 'Please authenticate' });
            }
            console.log('admin access verified')

            next();
        } else {
            console.log('not a admin', decoded)
            return res.status(400).json({ error: 'Please authenticate' });
        }
    } catch (error) {
        console.log('admin auth middleware error', error)
        return res.status(400).json({ error: 'Please authenticate' });
    }
}

module.exports = adminAuth;