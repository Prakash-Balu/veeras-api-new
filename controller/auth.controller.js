const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { CommentsSchema, UserSchema, AuthenticationSchema,RepliesSchema } = require("../schema");
const { AuthService, UserService } = require("../service");
const uuid = require("node-uuid");
const db = require("mongoose");

class AuthController {

    // constructor() {
    //     // super();
    // }
    async validateBeforeLogin(req, res, next) {
        console.log(req.body);
        const { mailId, password } = req.body;

        const userData = await UserSchema.findOne({
            mailId: { $regex: new RegExp("^" + mailId.toLowerCase(), "i") }
        });
        const user = await AuthenticationSchema.findOne({
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

    async viewComment(req, res, next) {
        const commentData = await CommentsSchema.find({});
        var threadObject = await CommentsSchema.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project:
                   {
                    _id: 1,
                    user_id: 1,
                    segment_id: 1,
                    seq_no: 1,
                    comments_text:1,
                    audio_path: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    userName: "$user.userName",
                    role: "$user.role",
                   }
             }
        ]);

        console.log('====>',threadObject);
        const finalObject = [];
        const ObjectId = db.Types.ObjectId;
        for (const val of threadObject) {
            let id =  val._id.toString() ;
            const query = [
                {
                    $match: {
                        comment_id: id
                      }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $unwind: "$user" },
                
                {
                    $project:
                       {
                        _id: 1,
                        user_id: 1,
                        comment_id: 1,
                        seq_no: 1,
                        reply_text:1,
                        audio_path: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        userName: "$user.userName",
                        role: "$user.role",
                       }
                 }
                ];
            
            var replyObject = await RepliesSchema.aggregate(query);
            val.reply = replyObject;
            finalObject.push(val);
        }
        return res.json({
            status: 200,
            message: "Successfully Login!!!.",
            data: finalObject,
        });

    }
    async addComment(req, res, next) {
        try {
            var comments = new CommentsSchema({
                user_id : req.body.user_id,
                segment_id : req.body.segment_id,
                seq_no : req.body.seq_no,
                comments_text : req.body.comments_text,
                audio_path : req.body.audio_path,
            });
            
            const result = await comments.save();
            return res.json({
                status: 200,
                message: "Successfully added!!!.",
                data: result,
            });
        } catch (error) {
            return res.json({
                status: 200,
                message: error.message,
            });
        }
    }
    async addReplies(req, res, next) {
        try {
            var replyObject = new RepliesSchema({
                user_id : req.body.user_id,
                comment_id : req.body.comment_id,
                seq_no : req.body.seq_no,
                reply_text : req.body.reply_text,
                audio_path : req.body.audio_path,
            });
            const result = await replyObject.save();
            return res.json({
                status: 200,
                message: "Successfully added!!!.",
                data: result,
            });
        } catch (error) {
            return res.json({
                status: 200,
                message: error.message,
            });
        }
    }
}

module.exports = new AuthController;