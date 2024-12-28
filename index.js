require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT
const morgan = require('morgan');
const helmet = require("helmet");
const cors = require("cors");
const users = require('./src/router/users-router')
const categories = require('./src/router/categories-router')
const products = require('./src/router/products-router')

//for parser body from request user
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//log request
app.use(morgan("combined"));

//secure header safety HTTP
app.use(helmet());

//cors for traffic domain
app.use(cors());

// Set header for grant access spesific domain
app.use(function (req, res, next) {
  // res.header('Access-Control-Allow-Origin', 'http://example.com');
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Set header to protect XSS Filter in browser
app.use(function (req, res, next) {
  res.header("X-XSS-Protection", "1; mode=block");
  next();
});

// Set header to force user use HTTPS
app.use(function (req, res, next) {
  res.header(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  next();
});

// Set header to protect clickjacking attack
app.use(function (req, res, next) {
  res.header("X-Frame-Options", "SAMEORIGIN");
  next();
});

// Set header to avoid sniffing type content
app.use(function (req, res, next) {
  res.header("X-Content-Type-Options", "nosniff");
  next();
});

// Set header to control content terms
app.use(function (req, res, next) {
  res.header("Content-Security-Policy", "default-src 'self'");
  next();
});

// Set endpoint to main request
app.get("/", (req, res) => {
  res.json({
    info: "Verata Server V1",
    author: "Mahardhika Putra Pratama",
  });
});

// Set use route
app.use(users)
app.use(categories)
app.use(products)

// Start application in spesific port
app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
