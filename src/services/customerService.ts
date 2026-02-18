import { db } from '../config/db.js';

export const createCustomer = async (data: any) => {
    let connection;
    try {
        connection = await db.getConnection();
        const sql = `
            INSERT INTO CUSTOMERS (first_name, last_name, email, phone, gender, password, age, role, policy_id) 
            VALUES (:first_name, :last_name, :email, :phone, :gender, :password, :age, :role, :policy_id)
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