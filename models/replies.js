"use strict";

module.exports = function (mongoose) {
    const Schema = mongoose.Schema;

    const repliesSchema = new Schema({
        // _id: String,
        // _id: {type: Schema.Types.ObjectId},
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

    return mongoose.model("replies", repliesSchema);
}