module.exports = (mongoose, utils, constants) => {
    const express = require('express');
    const router = express.Router();
    const controller = require('../../controller/admin/location-price')(mongoose, utils, constants);
    router.post("/addLocation", controller.addLocation);

    return router;
}