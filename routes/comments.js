module.exports = (mongoose, utils, constants) => {
    const express = require('express');
    const router = express.Router();
    const controller = require('../controller/comments')(mongoose, utils, constants);
    router.post("/addComment", controller.addComment);
    router.post("/addReplies", controller.addReplies);
    router.get('/viewComment', controller.viewComment);

    return router;
}