const mongoose = require("mongoose");
const { Schema } = mongoose;
// const uuid = require("node-uuid");

const commentsSchema = new Schema({
    _id: String,
    user_id: {type: String, ref: "users"},
    segment_id: String,
    seq_no: String,
    comments_text: String,
    audio_path: String,
    createdAt: Date,
    updatedAt: Date,
},
{
    timestamps: true,
});

module.exports = mongoose.model("comments", commentsSchema);