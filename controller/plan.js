"use strict";

module.exports = function (mongoose, utils, constants) {

    const planCtrl = {};
    const planService = require('../service/plan')(mongoose, utils);

    planCtrl.getPlanDetails = async (req, res) => {
        try {
            const result = await planService.getPlanDetails(req, res);

            return utils.sendResponseNew(req, res, 'OK', 'SUCCESS', result);
        } catch (err) {
            console.log(err);
            return utils.sendErrorNew(req, res, 'BAD_REQUEST', err.message);
        }
    };

    return planCtrl;
}
