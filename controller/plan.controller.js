const { PlanDetailsSchema } = require("../schema");

class PlanController {
    async getPlanDetails(req, res, next) {
        try {
            console.log("get Plan Details method");

            const planDetails = await PlanDetailsSchema.find();

            return res.json({
                status: 200,
                message: "Get Plan List",
                data: planDetails,
            });
        } catch (error) {
            return res.json({
                status: error.status,
                message: error.message,
            });
        }
    }

    async addPlan(req, res, next) {
        try {
            const planData = req.body;
            console.log("add plan method", planData);

            const result = await PlanDetailsSchema(planData).save();

            return res.json({
                status: 200,
                message: "Plan added successfully",
                data: result,
            });
        } catch (error) {
            return res.json({
                status: error.status,
                message: error.message,
            });
        }
    }

    async updatePlan(req, res, next) {
        try {
            const planDetails = req.body;
            console.log("update plan method", planDetails);

            const planUpdate = {
                code: planDetails.code,
                name: planDetails.name,
                description: planDetails.description,
                duration: planDetails.duration,
                offer_duration: planDetails.offer_duration,
                monthsno: planDetails.monthsno,
                feeFieldName: planDetails.feeFieldName,
            }

            const update = await PlanDetailsSchema.findByIdAndUpdate(
                { _id: planDetails._id },
                { ...planUpdate },
                { new: true },
            );

            return res.json({
                status: 200,
                message: "Plan updated",
                update,
            });
        } catch (error) {
            return res.json({
                status: error.status,
                message: error.message,
            });
        }
    }
}

module.exports = new PlanController;