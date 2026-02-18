import { db } from '../config/db.js';

// customerService.ts
export const createTestUser = async (name: string) => {
    let connection;
    try {
        connection = await db.getConnection();
        const result = await connection.execute(
            `INSERT INTO TEST_USERS (name) VALUES (:name)`,
            { name },
            { autoCommit: true }
        );
        return result;
    } catch (err) {
        throw err;
    } finally {
        if (connection) await connection.close();
    }
};