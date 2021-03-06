const swaggerUI = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
      // Like the one described here: https://swagger.io/specification/#infoObject
      info: {
        title: 'Administrativni modul',
        //version: '1.0.0',
        //description: 'Test Express API with autogenerated swagger doc',
      },
    },
    // List of files to be processes. You can also set globs './routes/*.js'
    apis: ['swaggerAPI.yml'/*, 'swaggerMikroservisi.yml'*/]
  };
   
  const specs = swaggerJsdoc(options);
  const swaggerUi = require('swagger-ui-express');
module.exports = (app) => {
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
