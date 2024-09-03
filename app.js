"use strict"
const express = require('express');
require('dotenv').config()
const cors = require("cors");
const useragent = require('express-useragent');
const path = require("path")
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./configs/swaggerConfig');
const constants = require('./configs/constants');

const mongooseConn = require('./configs/mongodb');
const utils = require('./utils');

module.exports = (async () => {

    const mongoose = await mongooseConn(constants);
    const app = express();
    app.use(express.json());
    app.use(useragent.express());
    app.use(
        cors({
            origin: "*",
            credentials: true,
        })
    );
    app.use("/", express.static(path.join(__dirname, "public")));

    const auth = require('./routes/auth')(mongoose, utils, constants);
    const user = require('./routes/user')(mongoose, utils, constants);
    const location = require('./routes/location-price')(mongoose, utils, constants);
    const plan = require('./routes/plan')(mongoose, utils, constants);
    const segments = require('./routes/segments')(mongoose, utils, constants);
    const comments = require('./routes/comments')(mongoose, utils, constants);
    const adminLocation = require('./routes/admin/location-price')(mongoose, utils, constants);
    const adminPlan = require('./routes/admin/plan')(mongoose, utils, constants);
    const adminSegments = require('./routes/admin/segments')(mongoose, utils, constants);

    app.get('/', (req, res) => {
        res.status(200).json({ message: "Health is Ok" })
    })
    app.use('/auth', auth);
    app.use('/user', user);
    app.use('/location', location, adminLocation);
    app.use('/plan', plan, adminPlan)
    app.use('/segments', segments, adminSegments);
    app.use('/comments', comments);

    // Serve Swagger documentation
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    const port = process.env.PORT || 4000;

    app.listen(port, () => {
        console.log(`Server Listen Port ${port}`)
    })

})();