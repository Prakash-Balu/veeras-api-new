"use strict";

module.exports = function (mongoose, utils, constants) {
    const userCtrl = {};
    const Users = mongoose.model("users");

    userCtrl.getUserDetails = async(req, res) => {
        try {
            const { userId } = req.body;
            const userData = await Users.findById(userId);

            return utils.sendResponseNew(req, res, 'OK', 'SUCCESS', userData);
        } catch (err) {
            console.log(err);
            return utils.sendErrorNew(req, res, 'BAD_REQUEST', err.message);
        }
    };


    return userCtrl;
}