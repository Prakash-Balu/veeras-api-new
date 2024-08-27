"use strict";

module.exports = function (mongoose, utils, constants) {

    const locationPriceCtrl = {};
    const locationPriceService = require('../../service/admin/location-price')(mongoose, utils);

    locationPriceCtrl.addLocation = async (req, res) => {
        try {
            const locationDetails = req.body;

            const A = await locationPriceService.addLocation(req, res, locationDetails);

            const B = await locationPriceService.addPrice(req, res, A._id, locationDetails)

            return utils.sendResponseNew(req, res, 'OK', 'SUCCESS', B);
        } catch (err) {
            // Abort the transaction in case of error
            // await session.abortTransaction();
            // session.endSession();
            console.log(err);
            return utils.sendErrorNew(req, res, 'BAD_REQUEST', err.message);
        }
    }

    return locationPriceCtrl;
}
