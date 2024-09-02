module.exports = (mongoose, utils, constants) => {
    const express = require('express');
    const router = express.Router();
    const controller = require('../controller/segments')(mongoose, utils, constants);
    router.get("/getSegments", controller.getSegments);

    return router;
}