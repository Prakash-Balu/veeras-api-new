const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { UsersSchema, AuthenticationsSchema } = require("../schema");
const { AuthService, UserService } = require("../service");
const uuid = require("node-uuid");

class AuthController {

    // constructor() {
    //     // super();
    // }
    async validateBeforeLogin(req, res, next) {
        console.log(req.body);
        const { mailId, password } = req.body;

        const userData = await UsersSchema.findOne({
            mailId: { $regex: new RegExp("^" + mailId.toLowerCase(), "i") }
        });
        const user = await AuthenticationsSchema.findOne({
            mailId: { $regex: new RegExp("^" + mailId.toLowerCase(), "i") }
        })
        console.log(user);

        if (!userData) {
            return next(new Error("Invalid user for this system, check the administrator"));
        }

        if (!user) {
            return next(new Error("Register to get user details"));
        }

        const isMatchPwd = await bcrypt.compare(password, user.password);
        if (!isMatchPwd) {
            return next(new Error("Password is incorrect. Please check and try again!"));
        }
        req.user = userData;
        req.auth = user;
        next();
    }

    async login(req, res, next) {
        try {
            const { mailId } = req.body;
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
            await UserService.updateUserData(uId, {
                isFirstLogin: false,
                updatedAt: new Date(),
                lastActivity: new Date(),
            });

            return res.json({
                status: 200,
                message: "Successfully Login!!!.",
                isFirstLogin: authUser.isFirstLogin,
                data: {
                    access_token: token,
                    refresh_token: refreshToken,
                    user: payload,
                }
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new AuthController;