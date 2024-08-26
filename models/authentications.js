"use strict";

module.exports = function (mongoose) {
    const Schema = mongoose.Schema;

    const authenticationsSchema = new Schema({
        _id: {
            type: String,
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

    return mongoose.model("authentications", authenticationsSchema);
}