const mongoose = require("mongoose");
const { Schema } = mongoose;
// const uuid = require("node-uuid");

const planDetailsSchema = new Schema({
    // _id: String,
    code: String,
    name: String,
    description: String,
    duration: String,
    offer_duration: String,
    monthoryear: {
        type: String,
        enum: ['Month(s)', 'Year(s)']
    },
    monthsno: Number,
    createdAt: Date,
    updatedAt: Date,
},
{
    timestamps: true,
});

module.exports = mongoose.model("plan_details", planDetailsSchema);