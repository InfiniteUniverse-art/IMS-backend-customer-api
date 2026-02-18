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

export const getAllCustomersFromDb = async () => {
    let connection;
    try {
        connection = await db.getConnection();
        
        const sql = `SELECT id, first_name, last_name, email, phone, gender, age, role, is_deleted, created_at FROM CUSTOMERS`;
        
        const result = await connection.execute(sql, [], {
            outFormat: db.OUT_FORMAT_OBJECT
        });

        return result.rows || [];
    } catch (error) {
        console.error("Database Query Error:", error);
        throw error;
    } finally {
        if (connection) {
            await connection.close(); // Important: returns connection to the pool
        }
    }
};

export const softDeleteCustomer = async (id: number) => {
    let connection;
    try {
        connection = await db.getConnection();
        const sql = `UPDATE CUSTOMERS SET is_deleted = 1 WHERE id = :id AND is_deleted = 0`;
        
        const result = await connection.execute(sql, { id }, { autoCommit: true });

        // rowsAffected will be 1 if the record existed and was active
        return result.rowsAffected === 1;
    } finally {
        if (connection) await connection.close();
    }
};