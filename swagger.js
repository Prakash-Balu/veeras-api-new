const swaggerAutogen = require("swagger-autogen")();
const doc = {
  openapi: '3.0.0',
  info: {
    title: "Veeras-Education-App",
    description: "Version 2.0"
  },
  host: "veeras-api-new.onrender.com",
  // basePath:"/dev",
  servers: [
    {
      url: "http://localhost:4000/",
      description: "Local Server"
    },
    {
      url: "https://veeras-api-new.onrender.com",
      description: "Production Server"
    }
  ],
};

const outputFile = "./swagger-output.json";
const routes = ["./index.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);


