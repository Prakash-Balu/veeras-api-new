const mongoose = require("mongoose");
const { Schema } = mongoose;
// const uuid = require("node-uuid");

const segmentsSchema = new Schema({
    // _id: String,
    name: String,
    description: String,
    video_url: String,
    iconName: String,
    routeUrl: String,
    createdAt: Date,
    updatedAt: Date,
},
{
    timestamps: true,
});

module.exports = mongoose.model("segments", segmentsSchema);