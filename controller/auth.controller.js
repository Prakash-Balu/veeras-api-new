const express = require("express");

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const {
    CommentsSchema,
    UsersSchema,
    AuthenticationSchema,
    RepliesSchema,
    LocationDetailsSchema,
    PriceDetailsSchema,
} = require("../schema");
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

        const userData = await UsersSchema.findOne({
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
        const segmentId = req.query.segmentId;
        // console.log(segmentId)
        const commentData = await CommentsSchema.find({});
        var threadObject = await CommentsSchema.aggregate([
            { $match: { segment_id: segmentId } },
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
                    comments_text: 1,
                    audio_path: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    userName: "$user.userName",
                    role: "$user.role",
                }
            }
        ]);

        console.log('====>', threadObject);
        const finalObject = [];
        const ObjectId = db.Types.ObjectId;
        for (const val of threadObject) {
            let id = val._id.toString();
            const query = [
                {
                    $match: {
                        comment_id: val._id
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
                        reply_text: 1,
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
                user_id: req.body.user_id,
                segment_id: req.body.segment_id,
                seq_no: req.body.seq_no,
                comments_text: req.body.comments_text,
                audio_path: req.body.audio_path,
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
                user_id: req.body.user_id,
                comment_id: req.body.comment_id,
                seq_no: req.body.seq_no,
                reply_text: req.body.reply_text,
                audio_path: req.body.audio_path,
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

    async getUserDetails(req, res, next) {
        try {
            const { userId } = req.body;
            // console.log("userId:", userId);

            const userData = await UsersSchema.findById(userId);
            // console.log("userData:", userData);
            return res.json({
                status: 200,
                message: "Get User Details!!!.",
                data: userData,
            });
        } catch (error) {
            return res.json({
                status: 200,
                message: error.message,
            });
        }
    }

    async addLocation(req, res, next) {
        // const session = await LocationDetailsSchema.startSession();
        // session.startTransaction();
        try {
            // const opts = { session };
            const locationDetails = req.body;

            var locationDataObject = new LocationDetailsSchema({
                country_name: locationDetails.countryName,
                country_code: locationDetails.countryCode,
                phone_code: locationDetails.phoneCode,
                currency_code: locationDetails.currencyCode,
                country_flag: locationDetails.countryFlag,
                currency_symbol: locationDetails.currencySymbol,
                currency_name: locationDetails.currencyName,
                currency_symbol_position: locationDetails.currencySymbolPosition,
                localityLanguage: locationDetails.localityLanguage,
            });
            const A = await locationDataObject.save();

            var priceDataObject = new PriceDetailsSchema({
                location_id: A._id,
                month_fee: locationDetails.monthFee,
                extendedplan1_fee: locationDetails.extendedPlan1Fee,
                extendedplan2_fee: locationDetails.extendedPlan2Fee,
            });

            const B = await priceDataObject.save();
            // await session.commitTransaction();
            // session.endSession();

            return res.json({
                status: 200,
                message: "Successfully added!!!.",
                data: B,
            });
        } catch (error) {
            // await session.abortTransaction();
            // session.endSession();
            return res.json({
                status: 200,
                message: error.message,
            });
        }
    }

    async getLocationPriceDetails(req, res, next) {
        try {
            let { countryCode } = req.body;

            const isCountryExists = await LocationDetailsSchema.findOne({ country_code: countryCode });
            // console.log("isCountryExists",isCountryExists)
            if (isCountryExists == null) {
                countryCode = "OT";
            }
            // console.log("countryCode",countryCode)
            const query = [
                {
                    $match: {
                        country_code: countryCode
                    }
                },
                {
                    $project:
                    {
                        _id: 1,
                        country_name: 1,
                        country_code: 1,
                        phone_code: 1,
                        currency_code: 1,
                        country_flag: 1,
                        currency_symbol: 1,
                        currency_name: 1,
                        currency_symbol_position: 1,
                        localityLanguage: 1,
                        createdAt: 1,
                        updatedAt: 1,
                    }
                }
            ];

            var threadObject = await LocationDetailsSchema.aggregate(query);

            // console.log('====>', threadObject);
            const finalObject = [];

            for (const val of threadObject) {
                let id = val._id.toString();
                const query1 = [
                    {
                        $match: {
                            location_id: val._id
                        }
                    },
                    {
                        $project:
                        {
                            _id: 1,
                            location_id: 1,
                            month_fee: 1,
                            extendedplan1_fee: 1,
                            extendedplan2_fee: 1,
                            createdAt: 1,
                            updatedAt: 1,
                        }
                    }
                ];

                var priceObject = await PriceDetailsSchema.aggregate(query1);
                val.price = priceObject;
                finalObject.push(val);
            }

            return res.json({
                status: 200,
                message: "Successfully Login!!!.",
                data: finalObject,
            });
        } catch (error) {
            return res.json({
                status: error.status,
                message: error.message,
            });
        }
    }

    async getPriceList(req, res, next) {
        try {
            console.log("get price list method")
            var threadObject = await PriceDetailsSchema.aggregate([
                {
                    $lookup: {
                        from: "location_details",
                        localField: "location_id",
                        foreignField: "_id",
                        as: "locationdtl"
                    }
                },
                { $unwind: "$locationdtl" },
                {
                    $project:
                    {
                        _id: 1,
                        name: "$locationdtl.country_name",
                        code: "$locationdtl.country_code",
                        phone_code: "$locationdtl.phone_code",
                        currency_code: "$locationdtl.currency_code",
                        country_flag: "$locationdtl.country_flag",
                        currency_symbol: "$locationdtl.currency_symbol",
                        currency_name: "$locationdtl.currency_name",
                        currency_symbol_position: "$locationdtl.currency_symbol_position",
                        localityLanguage: "$locationdtl.localityLanguage",
                        location_id: "$locationdtl._id",
                        month_fee: 1,
                        extendedplan1_fee: 1,
                        extendedplan2_fee: 1,
                    }
                }
            ]);

            // console.log('====>', threadObject);
            return res.json({
                status: 200,
                message: "Price List!!!.",
                data: threadObject,
            });
        } catch (error) {
            return res.json({
                status: error.status,
                message: error.message,
            });
        }
    }

    async updatePrice(req, res, next) {
        try {
            const priceDetails = req.body;
            console.log("update price list method", priceDetails);

            const locationUpdate = {
                currency_symbol_position: priceDetails.currencySymbolPosition,
                localityLanguage: priceDetails.localityLanguage,
            }

            const update1 = await LocationDetailsSchema.findByIdAndUpdate(
                { _id: priceDetails.location_id },
                { ...locationUpdate },
                { new: true },
            );

            const priceUpdate = {
                month_fee: priceDetails.monthFee,
                extendedplan1_fee: priceDetails.extendedPlan1Fee,
                extendedplan2_fee: priceDetails.extendedPlan2Fee,
            }

            const update2 = await PriceDetailsSchema.findByIdAndUpdate(
                { _id: priceDetails._id },
                { ...priceUpdate },
                { new: true },
            );

            return res.json({
                status: 200,
                message: "price updated",
                update1,
                update2,
            });
        } catch (error) {
            return res.json({
                status: error.status,
                message: error.message,
            });
        }
    }
}

module.exports = new AuthController;