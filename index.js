import express from "express";
import bodyparser from "body-parser";
import * as dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import Sentry from "@sentry/node";
import cors from "cors";
import routes from "./src/routes/index.js";
import db from "./src/config/database.js";

dotenv.config();

//OAS 3
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Users API",
      description: "API for getting, creating and updating users and their todo tasks",
      servers: ["http://localhost:3000"],
      version: "1.0.0"
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          "type": "http",
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "name": "Authorization"
        }
      }
    }
  },
  apis: [
    "./src/routes/*.js"
  ]
}

const swaggerDocs = swaggerJSDoc(swaggerOptions);


const app = express();

app.use(Sentry.Handlers.requestHandler());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyparser.json());

Sentry.init({
  dsn: process.env.SENTRY_DSN
});

app.use("/api", routes);

app.use(Sentry.Handlers.errorHandler());

db.authenticate()
    .then(() => {console.log('Connection has been established successfully.')})
    .catch((error) => {console.error('Unable to connect to the database:', error)});

app.listen(process.env.PORT, () => { console.log(`Now server is listening on http://localhost:${process.env.PORT}`) });