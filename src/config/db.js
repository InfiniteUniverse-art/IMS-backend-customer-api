const oracledb = require('oracledb');
require('dotenv').config();

// Enable Thin mode (default in v6+)
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function initialize() {
  await oracledb.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECTION_STRING,
    poolMin: 2,
    poolMax: 10,
    poolIncrement: 1
  });
  console.log('Oracle Connection Pool started');
}

async function close() {
  await oracledb.getPool().close(0);
}

module.exports = { initialize, close, oracledb };