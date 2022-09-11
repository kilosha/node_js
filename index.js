import express from 'express';
import bodyparser from 'body-parser';
import * as dotenv from 'dotenv';
import routes from './src/routes/index.js';

dotenv.config();

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyparser.json());
app.use('/api', routes);
app.listen(process.env.PORT, () => { console.log(`Now server is listening on http://localhost:${process.env.PORT}`)});