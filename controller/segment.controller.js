const {
    SegmentsSchema,
} = require("../schema");

class SegmentController {
    async getSegments(req, res, next) {
        try {
            console.log("get segment list method");

            const segementsData = await SegmentsSchema.find();

            return res.json({
                status: 200,
                message: "Segment List",
                data:segementsData,
            });
        } catch (error) {
            return res.json({
                status: error.status,
                message: error.message,
            });
        }
    }

    async addSegment(req, res, next) {
        try {
            const segementData = req.body;
            console.log("get segment list method", segementData);

            const result = await SegmentsSchema(segementData).save();

            return res.json({
                status: 200,
                message: "Segment added successfully",
                data:result,
            });
        } catch (error) {
            return res.json({
                status: error.status,
                message: error.message,
            });
        }
    }

    async deleteSegment(req, res, next) {
        try {
            const { segmentId }  = req.body;
            console.log("get segment list method", segmentId);

            const result = await SegmentsSchema.findByIdAndDelete({_id: segmentId});

            return res.json({
                status: 200,
                message: "Segment deleted successfully",
                data:result,
            });
            
        } catch (error) {
            return res.json({
                status: error.status,
                message: error.message,
            });
        }
    }
}

module.exports = new SegmentController;