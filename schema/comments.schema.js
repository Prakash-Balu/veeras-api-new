const mongoose = require("mongoose");
// var autoIncrement = require('mongodb-autoincrement');
const { Schema } = mongoose;
// const uuid = require("node-uuid");

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

// autoIncrement.initialize(mongoose.connection);
// autoIncrement.setDefaults({
//     collection: 'comments',     // collection name for counters, default: counters
//     field: '_id',               // auto increment field name, default: _id
//     step: 1             // auto increment step
// });

// commentsSchema.plugin(autoIncrement.mongoosePlugin, 'comments');
module.exports = mongoose.model("comments", commentsSchema);