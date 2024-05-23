const mongoose = require("mongoose");
const { Schema } = mongoose;
// const uuid = require("node-uuid");

const repliesSchema = new Schema({
    _id: String,
    user_id: {type: String, ref: "users"},
    comments_id: {type: String, ref: "comments"},
    reply_id: {type: String, ref: "replies"},
    seq_no: String,
    reply_text: String,
    audio_path: String,
    createdAt: Date,
    updatedAt: Date,
},
{
    timestamps: true,
});

module.exports = mongoose.model("replies", repliesSchema);