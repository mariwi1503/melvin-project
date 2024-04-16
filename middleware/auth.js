"use strict";

const jwtLib = require("../libraries/jwtLib");
const config = require("../config");
const authModel = require('../models/authModel')

module.exports = {
  user: async (req, res, next) => {
    try {
      let token = req.header("Authorization");
      if (!token) throw new Error("Unauthorized");

      let verified = jwtLib.verify(token, config.jwtSecret);
      if (!verified) throw new Error("Unauthorized");
      const user = await authModel.getUserById(verified.id);
      if (!user) throw new Error("User tidak dikenal");

      req.userId = user.id;
      req.user = user;

      next();
    } catch (error) {
      res.status(401).json({
        status: "failed",
        message: error.message,
      });
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      let token = req.header("Authorization");
      if (!token) throw new Error("Acces denied!");

      let verified = jwtLib.verifyRefresh(token, config.jwtRefresh);
      if (!verified) throw new Error("Acces denied!");
      const user = await authModel.getUserById(verified.id);
      if (!user) throw new Error("User tidak dikenal");
      if (user.refresh_token != token) throw new Error("Session anda telah habis");

      req.userId = user.id;
      req.user = user;

      next();
    } catch (error) {
      res.status(403).json({
        status: "failed",
        message: error.message,
      });
    }
  },
};