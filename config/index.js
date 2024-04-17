require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  dbConfig: {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    databaseOne: process.env.DB_ONE_NAME,
    databaseTwo: process.env.DB_TWO_NAME,
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtRefresh: process.env.JWT_REFRESH,
};
