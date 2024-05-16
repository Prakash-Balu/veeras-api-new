const mongoose = require("mongoose");
const { Schema } = mongoose;
const uuid = require("node-uuid");

const userSchema = new Schema({
    _id: String,
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
}, );

module.exports = mongoose.model("users", userSchema);


// {
//   "_id": "1",
// 	"password": "$2a$10$6l/OIZRC9sUjltEjhHnzUeS6tJIrSewTAUhpx4cx0blhKMJg40HZW",
//   "phone_no": "7845227090",
//   "whatsapp_no": "7845227090",
//   "mailId": "veeraeducation@gmail.com",
//   "fullName": "Veera",
//   "userName": "VeeraEducation",
//   "isPaid": true,
//   "role": "ADMIN",
//   "countryCode": "+91",
//   "city": "Chidambaram",
//   "state": "Tamilnadu",
//   "country": "India",
//   "address": "Chidambaram",
//   "pincode": "608001",
//   "createdAt": new Date(),
//   "updatedAt": new Date(),
// }