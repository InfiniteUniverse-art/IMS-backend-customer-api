import { db } from '../config/db.js';

export const createCustomer = async (data: any) => {
    let connection;
    try {
        connection = await db.getConnection();
        const sql = `
            INSERT INTO CUSTOMERS (first_name, last_name, email, phone, gender, password, age, role, policy_id, profile_image) 
            VALUES (:first_name, :last_name, :email, :phone, :gender, :password, :age, :role, :policy_id, :profile_image)
        `;
        
        return await connection.execute(sql, data, { autoCommit: true });
    } finally {
        if (connection) await connection.close();
    }
};


export const updateCustomer = async (id: string, updates: any) => {
    let connection;
    try {
        connection = await db.getConnection();
        const keys = Object.keys(updates);
        if (keys.length === 0) return null;

        const setClause = keys.map(key => `${key} = :${key}`).join(', ');
        
        const sql = `UPDATE CUSTOMERS SET ${setClause} WHERE ID = :id AND IS_DELETED = 0`;
        
        const result = await connection.execute(sql, { ...updates, id }, { autoCommit: true });
        return result;
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

export const getCustomerByIdFromDb = async (id: number) => {
    let connection;
    try {
        connection = await db.getConnection();
        const sql = `SELECT id, first_name, last_name, email, phone, gender, age, role, is_deleted, created_at FROM CUSTOMERS WHERE id = :id`;
        const result = await connection.execute(sql, { id }, { outFormat: db.OUT_FORMAT_OBJECT });
        return (result.rows && result.rows[0]) ? result.rows[0] : null;
    } catch (error) {
        console.error('Database Query Error (getCustomerById):', error);
        throw error;
    } finally {
        if (connection) await connection.close();
    }
};