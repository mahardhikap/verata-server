const jwt = require('jsonwebtoken');
require('dotenv').config();
const {responseMessage} = require('../utils/response-message')

const generateToken = (data) => {
  const expiresIn = '1h';
  const token = jwt.sign(data, process.env.SECRET, { expiresIn });
  return token;
};

const protect = (req, res, next) => {
  try {
    let { authorization } = req.headers;
    let bearer = authorization.split(' ');
    let decoded = jwt.verify(bearer[1], process.env.SECRET);
    req.payload = decoded;
    next();
  } catch (error) {
    return res.json(responseMessage("needToken", error.message));
  }
};

module.exports = {
  generateToken,
  protect,
};
