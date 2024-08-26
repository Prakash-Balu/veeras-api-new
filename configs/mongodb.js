/**
 * Project          : Veeras Api
 * Module           : Mongodb config
 * Source filename  : mongodb.js
 * Description      : Mongodb related configuration
 * Author           : Prakash
 * Copyright        : Copyright © 2024
 */
"use strict";

const mongoose = require("mongoose");

module.exports = (constants) => {
  return new Promise((resolve) => {
    //added to avoid mongoose Promise warning
    mongoose.Promise = global.Promise;

    // Connect to MongoDB
    mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection;
    db.on("connected", console.info.bind(console, "MongoDB connected:"));
    db.on("error", console.error.bind(console, "MongoDB error:"));
    db.on("reconnected", console.warn.bind(console, "MongoDB reconnected:"));
    db.once("open", function callback() {
      console.log("Database connection to MongoDB opened.");
      require('../models/users')(mongoose)
      require('../models/authentications')(mongoose, constants)
      require('../models/comments')(mongoose, constants)
      require('../models/location_details')(mongoose, constants)
      require('../models/location_price')(mongoose, constants)
      require('../models/plan_details')(mongoose, constants)
      require('../models/replies')(mongoose, constants)
      require('../models/segments')(mongoose, constants)
      require('../models/user_plans')(mongoose, constants)
      resolve(mongoose);
    });

    console.log("Loading MongoDB Settings ...");
  });
};
