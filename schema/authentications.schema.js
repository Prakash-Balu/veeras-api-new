const mongoose = require("mongoose");
const { Schema } = mongoose;
// const uuid = require("node-uuid");

const authenticationsSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    password: String,
    phone_no: String,
    mailId: String,
    isFirstLogin: Boolean,
    accessToken: { type: String, default: null },
    createdAt: Date,
    updatedAt: Date,
    lastActivity: Date,
}, {
    timestamps: true,
});

module.exports = mongoose.model("authentications", authenticationsSchema);