"use strict";

const bcrypt = require("bcryptjs");
const saltRounds = 15;

module.exports = {
  hasher: (password) => {
    return bcrypt.hashSync(password, saltRounds);
  },
  checker: (password, hash) => {
    return bcrypt.compareSync(password, hash);
  },
};
