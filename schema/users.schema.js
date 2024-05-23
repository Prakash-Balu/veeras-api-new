const mongoose = require("mongoose");
const { Schema } = mongoose;
// const uuid = require("node-uuid");

const usersSchema = new Schema({
    _id: String,
    password: String,
    phoneNumber: String,
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

module.exports = mongoose.model("users", usersSchema);