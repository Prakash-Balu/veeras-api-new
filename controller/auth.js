"use strict";

const uuid = require("node-uuid");
const bcrypt = require('bcryptjs');
const { UserService } = require("../service");

module.exports = function (mongoose, utils, constants) {
    
    const authCtrl = {};
    const Users = mongoose.model("users");
    const Authentications = mongoose.model("authentications");
    const userService = require('../service/user.service')(mongoose, utils);

    authCtrl.validateBeforeLogin = async (req, res, next) => {
        try {
            const { mailId, password } = req.body;
            const userData = await Users.findOne({
                mailId: { $regex: new RegExp("^" + mailId.toLowerCase(), "i") }
            });
            const user = await Authentications.findOne({
                mailId: { $regex: new RegExp("^" + mailId.toLowerCase(), "i") }
            });

            if (!userData) {
                return utils.sendErrorNew(req, res, 'BAD_REQUEST', 'INVALID_USER');
            }

            if (!user) {
                return utils.sendErrorNew(req, res, 'BAD_REQUEST', 'USER_NOT_FOUND');
            }

            const isMatchPwd = await bcrypt.compare(password, user.password);
            if (!isMatchPwd) {
                return next(new Error("Password is incorrect. Please check and try again!"));
            }
            req.user = userData;
            req.auth = user;
            next();
        } catch (err) {
            console.log(err);
            return utils.sendErrorNew(req, res, 'BAD_REQUEST', err.message);
        }
    };

    authCtrl.login = async(req, res) => {
        try {
            const authUser = req.auth;
            const userData = req.user;

            const payload = {
                id: userData._id,
                mailId: userData.mailId,
                role: userData.role,
                phoneNo: userData.phone_no,
                whatsappNo: userData.whatsapp_no,
                mailId: userData.mailId,
                fullName: userData.fullName,
                userName: userData.userName,
                isPaid: userData.isPaid,
                countryCode: userData.countryCode,
                city: userData.city,
                state: userData.state,
                country: userData.country,
                address: userData.address,
                pincode: userData.pincode
            }

            const authPayload = {
                id: authUser._id,
                mailId: authUser.mailId,
                phoneNo: authUser.phone_no,
                mailId: authUser.mailId,
                isFirstLogin: authUser.isFirstLogin
            }

            const token = uuid.v4(); //AuthService.generateToken(authPayload);
            const refreshToken = uuid.v4(); //AuthService.generateRefreshToken(authPayload);
            const uId = userData._id.toString();
            console.log(token);
            console.log(refreshToken);
            await userService.updateUserData(req, res, uId, {
                isFirstLogin: false,
                updatedAt: new Date(),
                lastActivity: new Date(),
            });

            const respData = {
                access_token: token,
                refresh_token: refreshToken,
                user: payload,
                auth: authPayload,
            }

            return utils.sendResponseNew(req, res, 'OK', 'SUCCESS', respData);
        } catch (err) {
            console.log(err);
            return utils.sendErrorNew(req, res, 'BAD_REQUEST', err.message);
        }
    };

    return authCtrl;
}