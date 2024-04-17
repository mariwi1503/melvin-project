"use strict";

const jwt = require("jsonwebtoken");
const { jwtSecret, jwtRefresh } = require("../../config");

module.exports = {
  generate: (data) => {
    return jwt.sign(data, jwtSecret, { expiresIn: 600 });
  },
  verify: (token) => {
    return jwt.verify(token, jwtSecret);
  },
  generateRefresh: (data) => {
    return jwt.sign(data, jwtRefresh);
  },
  verifyRefresh: (token) => {
    return jwt.verify(token, jwtRefresh);
  },
};
