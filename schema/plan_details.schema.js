const mongoose = require("mongoose");
const { Schema } = mongoose;
// const uuid = require("node-uuid");

const planDetailsSchema = new Schema({
    _id: String,
    plan_name: String,
    plan_description: String,
    duration: String,
    offer_duration: String,
    createdAt: Date,
    updatedAt: Date,
},
{
    timestamps: true,
});

module.exports = mongoose.model("plan_details", planDetailsSchema);