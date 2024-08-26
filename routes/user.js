module.exports = (mongoose, utils, constants) => {
    const express = require('express');
    const router = express.Router();
    const controller = require('../controller/user')(mongoose, utils, constants);
    router.post('/userDetails', controller.getUserDetails);

    return router;
}