const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Chat Application API',
    version: '1.0.0',
    description: 'API documentation for the Chat Application',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js', './models/*.js'], // Paths to files where Swagger should extract documentation from
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
