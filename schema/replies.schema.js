const mongoose = require("mongoose");
const { Schema } = mongoose;
// const uuid = require("node-uuid");

const repliesSchema = new Schema({
    // _id: String,
    user_id: {type: Schema.Types.ObjectId, ref: "users"},
    comment_id: {type: Schema.Types.ObjectId, ref: "comments"},
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