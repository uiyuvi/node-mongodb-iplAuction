const mongoose = require("mongoose");

//connection to database
mongoose.connect("mongodb://127.0.0.1:27017/ipl-auction-medium", {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});