import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index.js';

const app = express();
const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use('/api', router);
app.listen(port, () => { console.log(`Now server is listening on port http://localhost:${port}`)})