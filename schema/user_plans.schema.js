const mongoose = require("mongoose");
const { Schema } = mongoose;
// const uuid = require("node-uuid");

const userPlansSchema = new Schema({
    _id: String,
    user_id: { type: String, ref: "users" },
    plan_id: String,
    location_id: String,
    plan_start_date: String,
    plan_end_date: String,
    durations: String,
    createdAt: Date,
    updatedAt: Date,
},
{
    timestamps: true,
});

module.exports = mongoose.model("user_plans", userPlansSchema);