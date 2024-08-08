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
}

module.exports = new PlanController;