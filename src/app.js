const express = require("express");
const adminRouter = require("./routers/admin");
require("./mongoose/db/mongoose");

//setting up express router
const app = express();

//setting up the express middlewares
app.use(express.json());
app.use(adminRouter);

//exporting the app
module.exports = app;