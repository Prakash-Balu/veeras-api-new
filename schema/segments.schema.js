const mongoose = require("mongoose");
const { Schema } = mongoose;
// const uuid = require("node-uuid");

const segmentsSchema = new Schema({
    _id: String,
    segment_name: String,
    segment_description: String,
    video_url: String,
    createdAt: Date,
    updatedAt: Date,
},
{
    timestamps: true,
});

module.exports = mongoose.model("segments", segmentsSchema);