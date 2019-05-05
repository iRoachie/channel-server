require(`newrelic`);

const express = require(`express`);
const logger = require(`morgan`);
const bodyParser = require(`body-parser`);
const boom = require(`express-boom`);
const basicAuth = require(`express-basic-auth`);

require(`dotenv`).load();

const admin = require(`firebase-admin`);
const app = express();

app.use(logger(`dev`));

app.use(boom());
app.use(
  basicAuth({
    users: { admin: process.env.ADMIN_AUTH },
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, `\n`),
  }),
});

require(`./server/routes`)(app);
app.get(`*`, (_, res) =>
  res.status(404).send({
    message: `Welcome to the beginning of nothingness.`,
  })
);

module.exports = app;
