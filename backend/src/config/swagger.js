const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bharat AI Olympiad API',
      version: '1.0.0',
      description: 'Enterprise-grade REST API for Bharat AI Olympiad platform',
      contact: {
        name: 'BAIO Tech Team',
        email: 'tech@baio.in',
        url: 'https://baio.in',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api/v1`,
        description: 'Development Server',
      },
      {
        url: 'https://api.baio.in/api/v1',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
        },
      },
    },
    security: [{ bearerAuth: [] }, { cookieAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Students', description: 'Student management' },
      { name: 'Schools', description: 'School management' },
      { name: 'Olympiads', description: 'Olympiad management' },
      { name: 'Results', description: 'Result management' },
      { name: 'Announcements', description: 'Announcements' },
      { name: 'CMS', description: 'Content management' },
      { name: 'Admin', description: 'Admin management' },
    ],
  },
  apis: ['./src/routes/*.js', './src/models/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
