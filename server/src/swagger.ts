// import { checkAuthHeader } from '../middlewares/AuthMiddleware';

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      description: 'CloneBox API',
      version: '1.0.0',
      contact: {
        name: 'CloneBox Team',
        email: 'info@clonebox.com',
      },
      license: {
        name: 'CloneBox-License',
        url: 'https://clone-box.com/',
      },
    },
    components: {
      securitySchemes: {
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'authorization',
        },
      },
    },
  },
  apis: ['src/routes/*.ts', 'src/entities/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = app => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, { explorer: false }),
  );
};
