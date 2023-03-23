
/**
 * This file will contain the logic for the
 * registration of the user and login of the user
 * 
 * User :
 * 
 * Customer
 *    1. Registers and is approved by default
 *    2. Should be able to login immediately
 *
 */
 
//  * Engineer 
//  *    1. Should be able to registered
//  *    2. Initially he/she will be in PENDING state
//  *    3. ADMIN should be able to approve this
//  * 
//  * 
//  * Admin
//  *    1. ADMIN user should be only created from the backend...No API should be supported
//  * for it
//  


const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config")
const constants = require("../utils/constants");

exports.signup = async (req, res)=>{
     if(req.body.userType != ConstantSourceNode.userTypes.customer){
        req.body.userStatus = constants.userStatus.pending;
     }
     const userObj = {
        name : req.body.name,
        userId : req.body.userId,
        email : req.body.email,
        userType : req.body.userType,
        password : bcrypt.hashSync(req.body.password,8),
        userStatus : req.body.userStatus
     };
     try{
     const userCreated = await User.create(userObj);
    const response = {
        name : userCreated.name,
        userid : userCreated.userId,
        email : userCreated.email,
        userType : userCreated.userType,
        userStatus : userCreated.userStatus,
        createdAt : userCreated.createdAt,
        updatedAt : userCreated.updateAt
    }
    res.status(201).send(response);
    }catch(err){
        console.log("some error happened", err.message);
        res.status(500).send({
        message : "Some internal server error"
    });
    }
}





exports.signin = async (req, res)=>{
    try{

    const user = await User.findOne({userId: req.body.userId});
    if(user == null){
        return res.status(400).send({
        message : "Faied !! User Id passed doesn't exist"
    });
}

if(user.userStatus == constants.userStatus.pending){
    return res.status(400).send({
        message : "Not yet approved from the admin"
    })
}

const passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
if(!passwordIsValid){
    return res.status(401).send({
        message : "Wrong password"
    });
    

}

const token = jwt.sign({
    id : user.userId
}, authConfig.secret,{
    expiresIn :600
});
res.status(200).send({
    name: user.name,
    userId : user.userId,
    email : user.email,
    userType : user.userType,
    userStatus : user.userStatus,
    accessToken : token
    });
}catch(err){
    console.log("Internal error , " , err.message);
    res.status(500).send({
        message : "Some internal error while signin"
    });
}

}