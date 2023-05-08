const express = require("express");
const expressStaticGzip = require("express-static-gzip");
const path = require("path");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "dist/full-stack.ui")));
app.use(cookieParser());

const configuration = {
  prodDev: {
    port: 3500,
    path: '/'
  }
}

const build = configuration['prodDev'];


// logging helper
const log = msg => (req, res, next) => {
  // // console.log(`msg=(${msg}) url=(${req.url}) originalUrl=(${req.originalUrl})`);
  next();
};

// serve static files
app.use(build.path, expressStaticGzip('dist/full-stack.ui'));

// serve index.html
app.get("/*", log("serve index.html"), function (req, res) {
  res.header('Access-Control-Max-Age', 0);
  res.header('Cache-Control', 'public, max-age=0');
  res.sendFile(path.join(__dirname, "dist/full-stack.ui", "index.html"));
});

app.post('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/full-stack.ui', 'index.html'));
});

// start http server
app.listen(build.port, function (err) {
  if (err) {
    // // console.log(err);
  } else {
    // console.log(`listening on port ${build.port}`);
  }
});

