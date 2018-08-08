import * as functions from 'firebase-functions';
import * as express from 'express';
import logger = require('morgan');
import * as bodyParser from 'body-parser';

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./routes')(app);

exports.api = functions.https.onRequest(app);
