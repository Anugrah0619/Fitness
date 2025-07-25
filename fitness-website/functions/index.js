// const functions = require("firebase-functions");
// const { onRequest } = require("firebase-functions/v2/https");
// const next = require("next");

// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev, conf: { distDir: '.next' } });
// const handle = app.getRequestHandler();

// exports.nextApp = onRequest({ region: "asia-south1" }, (req, res) => {
//   return app.prepare().then(() => handle(req, res));
// });


const functions = require("firebase-functions");
const next = require("next");

const dev = false; // for production deploy
const app = next({ dev, conf: { distDir: ".next" } });
const handle = app.getRequestHandler();

exports.nextApp = functions.https.onRequest((req, res) => {
  return app.prepare().then(() => handle(req, res));
});
