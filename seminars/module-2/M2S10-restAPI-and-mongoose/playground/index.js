import express from 'express';
import bodyParser from 'body-parser';
import { router } from './routers/book.js';

const app = express();
app.use(bodyParser.json())
app.use(router);
app.listen(3001, () => console.log('start'));