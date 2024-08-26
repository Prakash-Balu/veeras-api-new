const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Veeras Education',
        version: '1.0.0',
        description: 'API documentation for your Express application',
      },
      servers: [
        {
          url: 'http://localhost:4000', // Change this to your server URL
          description: 'Local server',
        },
        {
          url: 'https://veeras-api-new.onrender.com/', // Change this to your server URL
          description: 'Render server',
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
    },
    apis: ['./routes/*.js'], // Path to your API routes
  };
  
  const swaggerSpec = swaggerJSDoc(options);
  
  module.exports = swaggerSpec;