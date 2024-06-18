const mongoose = require("mongoose");
const { Schema } = mongoose;
// const uuid = require("node-uuid");

const priceDetailsSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    location_id: {type: Schema.Types.ObjectId, ref: "location_details"},
    month_fee: Number,
    extendedplan1_fee: Number,
    extendedplan2_fee: Number,
    createdAt: Date,
    updatedAt: Date,
},
{
    timestamps: true,
});

module.exports = mongoose.model("location_price", priceDetailsSchema);