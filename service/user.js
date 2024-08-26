"use strict";

module.exports = function(mongoose, utils) {
    const userService = {};    
    const Authentications = mongoose.model("authentications");

    userService.updateUserData = async(req, res, _id, userUpdate) => {
        try {
            return await Authentications.findByIdAndUpdate({ _id }, {
                ...userUpdate,
            });
        } catch (err) {
            console.log(err);
            return utils.sendErrorNew(req, res, 'BAD_REQUEST', err.message);
        }
    }

    return userService;
}