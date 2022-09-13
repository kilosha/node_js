import express from 'express';
import bodyparser from 'body-parser';
import * as dotenv from 'dotenv';
import routes from './src/routes/index.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Users API",
            description: "API for getting, creating and updating users",
            servers: ["http://localhost:3000"],
            version: "1.0.0",
          },
    },
    apis: ["./src/routes/*.js"],
};
  
const swaggerDocs = swaggerJSDoc(swaggerOptions);

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyparser.json());
app.use('/api', routes);
app.listen(process.env.PORT, () => { console.log(`Now server is listening on http://localhost:${process.env.PORT}`)});