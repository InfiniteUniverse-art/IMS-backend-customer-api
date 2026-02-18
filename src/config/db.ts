import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

// Set global output format to Objects instead of Arrays
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

export async function initialize() {
  try {
    // Check if pool already exists (useful during hot-reloads)
    try {
        const existingPool = oracledb.getPool();
        if (existingPool) return; 
    } catch (e) {
        // Pool doesn't exist, proceed to create
    }

    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECTION_STRING,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1
    });
    console.log('✅ Oracle Connection Pool started (Thin Mode)');
  } catch (err) {
    console.error('❌ Failed to initialize Oracle Pool:', err);
    throw err;
  }
}
export async function close() {
  await oracledb.getPool().close(0);
}

export const db = oracledb;