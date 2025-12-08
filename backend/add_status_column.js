const mysql = require('mysql2/promise');

async function migrate() {
    console.log('Connecting to database...');
    const connection = await mysql.createConnection({
        host: 'switchyard.proxy.rlwy.net',
        user: 'root',
        password: 'ieHHocQibHctXCsFdRJwWWHFfCAyGaub',
        port: 52671,
        database: 'railway',
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Adding status column to users table...');
        // Check if column exists first (optional, but good for idempotency)
        // Simple ALTER TABLE ADD COLUMN IF NOT EXISTS (MySQL syntax varies, checking information_schema is safer but raw ADD is fine for now if we catch error).

        // MySQL 8.0+ supports IF NOT EXISTS for ADD COLUMN, but Railway might be different version. 
        // We will try raw ADD and catch duplication error.

        await connection.query(`
            ALTER TABLE users 
            ADD COLUMN status ENUM('active', 'blocked') DEFAULT 'active'
        `);
        console.log('Success: Column added.');
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('Column already exists.');
        } else {
            console.error('Migration failed:', err.message);
        }
    } finally {
        await connection.end();
    }
}

migrate();
