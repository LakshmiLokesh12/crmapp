
const jwt = require("jsonwebtoken");

const authConfig = require("../configs/auth.config");
const User = require("../models/user.model");
const constants = require("../utils/constants");


const verifyToken = (req,res,next) =>{
    const token = req.headers["x-access-token"];

    if(!token){
        return res.status(403).send({
            message : "No token provided ! Access prohibited"

        })
    }

    jwt.verify(token, authConfig.secret , (err,decoded) =>{
        if(err){
            return res.status(401).send({
                message : "UnAuthorized !"
            });
        }
        req.userId = decoded.id;
        next();
    })

    const isAdmin = async(req, res, next) =>{
        const user = await User.findOne({userId : req.userId});
        if(user && userType == ConstantSourceNode.userTypes.admin){
            next();

        }else{
            res.status(403).send({
                messaga : "Only ADMIN users are allowed to access this endpoint"
            })
        }
    }
    const isValidUserIdInReqParam = async (req, res, next) => {
        try {
            const user = User.find({ userId: req.params.id });
            if (!user) {
                return res.status(400).send({
                    message: "UserId passed doesn't exist"
                })
            }
            next();
        } catch (err) {
            console.log("Error while reading the user info", err.message);
            return res.status(500).send({
                message: "Internal server error while reading the user data"
            })
        }
    }
    
    const isAdminOrOwner = async (req, res, next) => {
        /**
         * Either the caller should be the ADMIN or the caller should be the
         * owner of the userId
         */
    
        try {
            const callingUser = await User.findOne({ userId: req.userId });
            if (callingUser.userType == constants.userTypes.admin
                || callingUser.userId == req.params.id) {
                next();
            } else {
                res.status(403).send({
                    message: "Only admin or the owner is allowed to make this call"
                })
            }
    
    
        } catch (err) {
            console.log("Error while reading the user info", err.message);
            return res.status(500).send({
                message: "Internal server error while reading the user data"
            })
        }
    
    
    }
    


    const authJwt = {
        verifyToken : verifyToken,
        isAdmin : isAdmin,
        isValidUserIdInReqParam : isValidUserIdInReqParam,
        isAdminOrOwner : isAdminOrOwner
    };
    module.exports = authJwt;


}