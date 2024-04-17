"use strict";

const { poolOne } = require("../db/connection");

module.exports = {
  getUserByUsername: async (username) => {
    try {
      const query = `SELECT * FROM app_login WHERE username = ?`;
      const [[rows], fields] = await poolOne.query(query, username);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  getUserById: async (id) => {
    try {
      const query = `SELECT * FROM app_login WHERE id = ?`;
      const [[rows], fields] = await poolOne.query(query, id);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  updateUserRefreshToken: async (userId, refresh_token) => {
    try {
      const query = `UPDATE app_login SET refresh_token = ? WHERE id = ?`;
      const result = await poolOne.query(query, [refresh_token, userId]);
      return;
    } catch (error) {
      throw error;
    }
  },
};
