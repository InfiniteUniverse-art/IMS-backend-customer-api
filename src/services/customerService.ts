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
        const sql = `SELECT ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE, GENDER, AGE, ROLE, IS_DELETED, CREATED_AT, PROFILE_IMAGE, POLICY_ID FROM CUSTOMERS`;

        const result = await connection.execute(sql, [], {
            outFormat: db.OUT_FORMAT_OBJECT
        });

        const rows: any[] = (result.rows as any) || [];
        return rows.map((r: any) => ({
            id: r.ID,
            first_name: r.FIRST_NAME,
            last_name: r.LAST_NAME,
            email: r.EMAIL,
            phone: r.PHONE,
            gender: r.GENDER,
            age: r.AGE,
            role: r.ROLE,
            is_deleted: r.IS_DELETED,
            created_at: r.CREATED_AT,
            profile_image: r.PROFILE_IMAGE,
            policy_id: r.POLICY_ID
        }));
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
        const sql = `SELECT ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE, GENDER, AGE, ROLE, IS_DELETED, CREATED_AT, PROFILE_IMAGE, POLICY_ID FROM CUSTOMERS WHERE ID = :id`;
        const result = await connection.execute(sql, { id }, { outFormat: db.OUT_FORMAT_OBJECT });
        const row: any = (result.rows && (result.rows as any[])[0]) ? (result.rows as any[])[0] : null;
        if (!row) return null;
        return {
            id: row.ID,
            first_name: row.FIRST_NAME,
            last_name: row.LAST_NAME,
            email: row.EMAIL,
            phone: row.PHONE,
            gender: row.GENDER,
            age: row.AGE,
            role: row.ROLE,
            is_deleted: row.IS_DELETED,
            created_at: row.CREATED_AT,
            profile_image: row.PROFILE_IMAGE,
            policy_id: row.POLICY_ID
        };
    } catch (error) {
        console.error('Database Query Error (getCustomerById):', error);
        throw error;
    } finally {
        if (connection) await connection.close();
    }
};

export const getCustomerByEmail = async (email: string) => {
    let connection;
    try {
        connection = await db.getConnection();
        const sql = `SELECT ID, FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, ROLE, PROFILE_IMAGE, POLICY_ID FROM CUSTOMERS WHERE EMAIL = :email AND IS_DELETED = 0`;
        const result = await connection.execute(sql, { email }, { outFormat: db.OUT_FORMAT_OBJECT });
        const row: any = (result.rows && (result.rows as any[])[0]) ? (result.rows as any[])[0] : null;
        if (!row) return null;
        return {
            id: row.ID,
            first_name: row.FIRST_NAME,
            last_name: row.LAST_NAME,
            email: row.EMAIL,
            password: row.PASSWORD,
            role: row.ROLE,
            profile_image: row.PROFILE_IMAGE,
            policy_id: row.POLICY_ID
        };
    } finally {
        if (connection) await connection.close();
    }
};