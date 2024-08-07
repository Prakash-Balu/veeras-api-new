const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const twilio = require("twilio");
const User = require("../model/model");
const Location = require("../model/Location");
const qr = require("qrcode");
const qrCode = require("qr-image");
const crypto = require("crypto");
const Controller = require("../controller/controllers");
const AuthController = require("../controller/auth.controller");
const { isValidToken } = require("../utils");
const QRCode = require("../model/qrcode");
const axios = require("axios");
const qrcode = require("qrcode");
require("dotenv").config();
const Token = require("../model/Token");
const { v4: uuidv4 } = require("uuid");
const environment = require('../etc/environment');

router.use(bodyParser.json());
router.use(express.json());
const Razorpay = require("razorpay");
const SegmentController = require("../controller/segment.controller");
const PlanController = require("../controller/plan.controller");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

router.use(bodyParser.urlencoded({ extended: false }));

const phoneNumbers = {};

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

function sendOTP(phoneNumber, otp) {
    return client.messages
        .create({
            body: `Your OTP is: ${otp}`,
            from: twilioPhoneNumber,
            to: phoneNumber,
        })
        .then((message) => {
            console.log(`OTP sent successfully. Message SID: ${message.sid}`);
        })
        .catch((err) => {
            console.error("Failed to send OTP:", err.message);
            throw err;
        });
}

function generateSessionDetails() {
    return {
        sessionId: uuidv4(),
        secretKey: uuidv4(),
    };
}

router.get("/", function(req, res) {
    res.json({
        status: "API Works",
        message: "Welcome to User API",
    });
});

router.post("/send", express.json(), (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ error: "Invalid phone number" });
    }

    const otp = generateOTP();

    phoneNumbers[phoneNumber] = otp;

    sendOTP(phoneNumber, otp)
        .then(() => {
            res.json({ success: true, message: "OTP sent successfully" });
        })
        .catch((err) => {
            console.error(err);

            if (err.code === 20003) {
                res
                    .status(500)
                    .json({ error: "Failed to send OTP. Twilio authentication error." });
            } else {
                res
                    .status(500)
                    .json({ error: "Failed to send OTP", details: err.message });
            }
        });
});

async function generateQRCode(qrCodeData) {
    try {
        const qrCodeDataURL = await qrcode.toDataURL(JSON.stringify(qrCodeData));
        return qrCodeDataURL;
    } catch (error) {
        console.error("Error generating QR code:", error.message);
        throw error;
    }
}

module.exports = (io) => {
    router.post("/login", async(req, res) => {
        try {
            const { phoneNumber, otp } = req.body;

            if (!phoneNumber || !otp) {
                return res
                    .status(400)
                    .json({ error: "Phone number and OTP are required" });
            }

            if (phoneNumbers[phoneNumber] && phoneNumbers[phoneNumber] == otp) {
                delete phoneNumbers[phoneNumber];

                let user = await User.findOne({ phoneNumber });

                if (!user) {
                    user = new User({
                        phoneNumber: phoneNumber,
                    });
                    console.log("New user created:", user);
                }

                if (user.loggedIn) {
                    return res.status(401).json({ error: "User is already logged in" });
                }

                user.lastLoginTime = new Date();
                await user.save();

                const { sessionId, secretKey } = generateSessionDetails();

                user.sessionId = sessionId;
                user.secretKey = secretKey;

                await user.save();

                const loginDetails = {
                    loginTime: user.lastLoginTime,
                    sessionId: user.sessionId,
                    secretKey: user.secretKey,
                };

                res.json({
                    success: true,
                    message: "Login successful",
                    user: {
                        userId: user._id,
                        phoneNumber: user.phoneNumber,
                    },
                    loginDetails: loginDetails,
                });
            } else {
                res.status(401).json({ error: "Invalid OTP" });
            }
        } catch (error) {
            console.error("Error in login:", error);
            res
                .status(500)
                .json({ error: "Internal Server Error", message: error.message });
        }
    });

    router.post("/getUserDetails", async(req, res) => {
        try {
            const { sessionId } = req.body;

            if (!sessionId) {
                return res.status(400).json({ error: "Session ID is required" });
            }

            const user = await User.findOne({ sessionId });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const userDetails = {
                userId: user._id,
                phoneNumber: user.phoneNumber,
                lastLoginTime: user.lastLoginTime,
                location: user.location,
                qrcode: user.qrcode,
                token: Token.token,
            };

            res.json({
                success: true,
                message: "User details retrieved successfully",
                user: userDetails,
            });
        } catch (error) {
            console.error("Error in getUserDetails:", error);
            res
                .status(500)
                .json({ error: "Internal Server Error", message: error.message });
        }
    });

    async function validateScannedData(secretKey, sessionId, userId) {
        const expectedUser = await User.findOne({ userId, sessionId, secretKey });
        return !!expectedUser;
    }

    router.post("/scan", async(req, res) => {
        const { sessionId, secretKey, userId } = req.body;

        if (!sessionId || !secretKey || !userId) {
            return res.status(400).json({ error: "Invalid scanned data" });
        }

        const isValid = await validateScannedData(secretKey, sessionId, userId);

        if (isValid) {
            res.json({ success: true, message: "Scanned data is valid" });
        } else {
            res.status(401).json({ error: "Invalid scanned data" });
        }
    });

    router.post("/verify-secretkey", async(req, res) => {
        const { secretKey } = req.body;

        if (!secretKey) {
            return res.status(400).json({ error: "secretKey is required" });
        }

        try {
            const user = await User.findOne({ secretKey });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            if (secretKey !== user.secretKey) {
                return res.status(401).json({ error: "Invalid secret key" });
            }

            res.json({
                success: true,
                message: "Secret key is valid",
                user: {
                    userId: user._id,
                    phoneNumber: user.phoneNumber,
                    sessionId: user.sessionId,
                },
            });
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .json({ error: "Internal Server Error", details: error.message });
        }
    });

    router.get("/secretKey", async(req, res) => {
        try {
            const users = await User.find();

            if (!users || users.length === 0) {
                return res.status(404).json({ error: "No users found" });
            }

            const secretKeys = users.map((user) => user.secretKey);

            res.json({
                success: true,
                secretKeys,
            });
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .json({ error: "Internal Server Error", details: error.message });
        }
    });

    router.post("/location", async(req, res) => {
        try {
            const { ipAddress, latitude, longitude, countryName } = req.body;

            const newLocation = new Location({
                ipAddress,
                latitude,
                longitude,
                countryName,
            });

            await newLocation.save();

            res.status(201).json({ message: "Location details stored successfully" });
        } catch (error) {
            console.error(error);
            res
                .status(500)
                .json({ error: "Internal Server Error", details: error.message });
        }
    });

    router.post("/logout", async(req, res) => {
        try {
            const { userId } = req.body;

            const user = await User.findById(userId);

            if (!user) {
                return res.status(401).json({ error: "User not found" });
            }

            const sessionTimeoutMinutes = 1440; // 24 hours
            const currentTime = new Date();
            const lastLoginTime = user.lastLoginTime;

            if (
                lastLoginTime &&
                currentTime - lastLoginTime > sessionTimeoutMinutes * 60 * 1000
            ) {
                user.loggedIn = false;
                await user.save();
                return res
                    .status(401)
                    .json({ error: "Session expired. Please log in again." });
            }

            user.loggedIn = false;
            await user.save();

            res.json({ success: true, message: "Logout successful" });
        } catch (error) {
            console.error("Error in logout:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    router.get("/checkSession/:sessionId", async(req, res) => {
        try {
            const { sessionId } = req.params;

            const session = await User.findOne({ sessionId: sessionId });

            if (!session) {
                return res.status(404).json({ error: "Session not found" });
            }

            const sessionTimeoutMinutes = 1440; // 24 hours
            const currentTime = new Date();

            if (currentTime - session.createdAt > sessionTimeoutMinutes * 60 * 1000) {
                return res.json({ expired: true, message: "Session expired" });
            } else {
                return res.json({ expired: false, message: "Session still valid" });
            }
        } catch (error) {
            console.error("Error checking session:", error);
            res.status(500).json({ error: error.message });
        }
    });

    router.get("/generateQR", async(req, res) => {
        const token = generateToken();
        const timestamp = Date.now();
        const channelName = `${token}-${timestamp}`;

        qr.toDataURL(channelName, async(err, url) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Error generating QR code" });
            } else {
                try {
                    const qrCode = new QRCode({ channelName, qrCodeUrl: url });

                    await qrCode.save();
                    res.json({ channelName, qrCodeUrl: url });
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ error: "Error saving data to database" });
                }
            }
        });
    });

    router.get("/generate-token", async(req, res) => {
        try {
            const uniqueToken = uuidv4();
            const tokenDocument = new Token({ token: uniqueToken });
            await tokenDocument.save();
            res.status(200).json({ token: uniqueToken });
        } catch (error) {
            console.error("Error generating and saving token:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    router.post("/token", async(req, res) => {
        const { token } = req.body;
        try {
            if (await isValidToken(token)) {
                res
                    .status(200)
                    .json({ success: true, message: "Token received successfully" });
            } else {
                res.status(400).json({ success: false, message: "Invalid token" });
            }
        } catch (error) {
            console.error("Error validating token:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    const generateToken = () => {
        return Math.random().toString(36).substring(2, 10);
    };

    router.post("/orderAPI", async(req, res) => {
        // const orderData = await createOrderAPI();

        var instance = new Razorpay({
            key_id: environment.RAZOR_PAY_KEY_ID,
            key_secret: environment.RAZOR_PAY_KEY_SECRET,
        });

        var options = {
            amount: 50000, // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"

        };

        await instance.orders.create(options, function(err, order) {
            // console.log(order);
            res
                .status(200)
                .json({ success: true, orderData: order });
        });
    });

    router.post("/acknowledgment", function(req, res) {
        if (!!req.body.razorpay_payment_id && !!req.body.razorpay_order_id && !!req.body.razorpay_signature)
            res.redirect(environment.REDIRECT_URL + "/#/login");
        // } else if (req.body.code == 'PAYMENT_ERROR') {
        //     res.redirect("http://locahost:4200/#/payment/failure");
        // }
    });

    

    router.post("/adminLogin", AuthController.validateBeforeLogin, AuthController.login);

    router.route("/user").get(Controller.index);
    router
        .route("/user/:number")
        .get(Controller.view)
        .patch(Controller.update)
        .put(Controller.update)
        .delete(Controller.Delete);

    router.route("/viewComment").get(AuthController.viewComment);
    router.route("/comment").post(AuthController.addComment);
    router.route("/reply").post(AuthController.addReplies);
    router.route("/userDetails").post(AuthController.getUserDetails);
    router.route("/addLocation").post(AuthController.addLocation);
    router.route("/getLocationPriceDetails").post(AuthController.getLocationPriceDetails);
    router.route("/getPriceList").get(AuthController.getPriceList);
    router.route("/updatePrice").post(AuthController.updatePrice);

    //Segment Related Api
    router.route('/getSegments').get(SegmentController.getSegments);
    router.route('/addSegment').post(SegmentController.addSegment);
    router.route('/deleteSegment').post(SegmentController.deleteSegment);

    //Plan Related Api
    router.route('/addPlan').post(PlanController.addPlan);
    router.route('/getPlanDetails').get(PlanController.getPlanDetails);

    return router;
};