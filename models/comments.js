"use strict";

module.exports = function (mongoose) {
    const Schema = mongoose.Schema;

    const commentsSchema = new Schema({
        // _id:String,
        user_id: {type: Schema.Types.ObjectId, ref: "users"},
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

    return mongoose.model("comments", commentsSchema);
}