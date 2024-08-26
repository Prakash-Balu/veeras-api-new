module.exports = (mongoose, utils, constants) => {
    const express = require('express');
    const router = express.Router();
    const controller = require('../controller/auth')(mongoose, utils, constants);
    router.post("/adminLogin", controller.validateBeforeLogin, controller.login);

    return router;
}