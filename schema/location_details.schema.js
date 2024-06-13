const mongoose = require("mongoose");
const { Schema } = mongoose;
// const uuid = require("node-uuid");

const locationDetailsSchema = new Schema({
    // _id: String,
    country_name: String,
    country_code: String,
    phone_code: String,
    currency_code: String,
    country_flag: String,
    currency_symbol: String,
    currency_name: String,
    currency_symbol_position: String,
    localityLanguage: String,
    createdAt: Date,
    updatedAt: Date,
},
{
    timestamps: true,
});

module.exports = mongoose.model("location_details", locationDetailsSchema);