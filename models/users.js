"use strict";

module.exports = function (mongoose) {
    const Schema = mongoose.Schema;

    const usersSchema = new Schema({
        _id: {type: Schema.Types.ObjectId},
        password: String,
        phone_no: String,
        whatsapp_no: String,
        mailId: String,
        fullName: String,
        userName: String,
        isPaid: Boolean,
        role: String,
        countryCode: String,
        city: String,
        state: String,
        country: String,
        address: String,
        pincode: String,
        createdAt: Date,
        updatedAt: Date,
    }, {
        timestamps: true,
    });

    return mongoose.model("users", usersSchema);
};