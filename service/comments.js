"use strict";

module.exports = function(mongoose, utils) {
    const commentsService = {};    
    const Comments = mongoose.model("comments");
    const Replies = mongoose.model("replies");

    commentsService.addComment = async(req, res) => {
        try {
            var commentsObject = new Comments({
                user_id: req.body.user_id,
                segment_id: req.body.segment_id,
                seq_no: req.body.seq_no,
                comments_text: req.body.comments_text,
                audio_path: req.body.audio_path,
            });
            return await commentsObject.save();
        } catch (err) {
            console.log(err);
            return utils.sendErrorNew(req, res, 'BAD_REQUEST', err.message);
        }
    };

    commentsService.addReplies = async (req, res) => {
        try {

            console.log(req.body);
            var replyObject = new Replies({
                user_id: req.body.user_id,
                comment_id: req.body.comment_id,
                seq_no: req.body.seq_no,
                reply_text: req.body.reply_text,
                audio_path: req.body.audio_path,
            });
            return await replyObject.save();
        } catch (err) {
            console.log(err);
            return utils.sendErrorNew(req, res, 'BAD_REQUEST', err.message);
        }
    };

    commentsService.viewComment = async (req, res) => {
        try {

            const segmentId = req.query.segmentId;
        // console.log(segmentId)
        const commentData = await Comments.find({});
        var threadObject = await Comments.aggregate([
            { $match: { segment_id: segmentId } },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project:
                {
                    _id: 1,
                    user_id: 1,
                    segment_id: 1,
                    seq_no: 1,
                    comments_text: 1,
                    audio_path: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    userName: "$user.userName",
                    role: "$user.role",
                }
            }
        ]);

        console.log('====>', threadObject);
        const finalObject = [];
        const ObjectId = mongoose.Types.ObjectId;
        for (const val of threadObject) {
            let id = val._id.toString();
            const query = [
                {
                    $match: {
                        comment_id: val._id
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $unwind: "$user" },

                {
                    $project:
                    {
                        _id: 1,
                        user_id: 1,
                        comment_id: 1,
                        seq_no: 1,
                        reply_text: 1,
                        audio_path: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        userName: "$user.userName",
                        role: "$user.role",
                    }
                }
            ];

            var replyObject = await Replies.aggregate(query);
            val.reply = replyObject;
            finalObject.push(val);
        }
        return finalObject;
        } catch (err) {
            console.log(err);
            return utils.sendErrorNew(req, res, 'BAD_REQUEST', err.message);
        }
    };

    return commentsService;
}