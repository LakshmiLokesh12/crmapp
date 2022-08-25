const express = require('express');
const app = express();
const serverConfig = require('./configs/server.config');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dbConfig = require("./configs/db.config");
const User = require("./models/user.model");
const bcrypt = require("bcryptjs");



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;
db.on("error", ()=>{
    console.log("Error while connecting to MongoDB");
});
db.once("open", ()=>{
    console.log("Connected to Mongo DB");
    init();
});


async function init(){
    try{
/*const user = await User.findOne({userId : "admin"});
        if(user){
            console.log("ADMIN user is already present");
            return;
        }
  */
        await User.collection.drop();
        const user = await User.create({
            name : "Vishwa",
            userId : "admin",
            password : bcrypt.hashSync("Welcome",8),
            email : "kankvish@gmail.com",
            userType : "ADMIT"
        });
        console.log(user);
    } catch (err){
        console.log("error in db initialization," + err.message);
    }
    }
    
require("./routes/auth.route")(app);
require("./routes/user.route")(app);
app.listen(serverConfig.PORT, ()=>{
    console.log("Started the server on PORT number :", serverConfig.PORT);
});

