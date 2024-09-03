"use strict";

module.exports = function(mongoose, utils) {
    const planService = {};    
    const Plan = mongoose.model("plan_details");

    planService.addPlan = async(req, res) => {
        try {
            
            return await Plan.find();
        } catch (err) {
            console.log(err);
            return utils.sendErrorNew(req, res, 'BAD_REQUEST', err.message);
        }
    };

    return planService;
}