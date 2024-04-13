const { dbConfig } = require('../config')
    , mysql = require('mysql2')

const poolOne = mysql.createPool({
    port: dbConfig.port,
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.databaseOne,
    connectionLimit: 3
}).promise()

const poolTwo = mysql.createPool({
  port: dbConfig.port,
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.databaseTwo,
  connectionLimit: 3
}).promise()

module.exports = {poolOne, poolTwo}