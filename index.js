require('dotenv').config()
const { DbConnect } = require("./src/Database/index");
const { app } = require('./app')
DbConnect().then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log("Server Running on Port 3000");
    })

}).catch((err) => {
    console.log("From index.js file database connnection error", err);
})


