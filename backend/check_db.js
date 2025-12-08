const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDB() {
    console.log('Connecting to database...');
    try {
        const connection = await mysql.createConnection({
            host: 'switchyard.proxy.rlwy.net',
            user: 'root',
            password: 'ieHHocQibHctXCsFdRJwWWHFfCAyGaub',
            port: 52671,
            database: 'railway',
            ssl: { rejectUnauthorized: false }
        });

        console.log('Connected.');

        const [tables] = await connection.query('SHOW TABLES');
        console.log('Tables:', tables);

        try {
            const [users] = await connection.query('SELECT * FROM users');
            console.log(`User Count: ${users.length}`);
            if (users.length > 0) console.log('First User:', users[0]);
        } catch (e) {
            console.log('Error querying users:', e.message);
        }

        await connection.end();
    } catch (e) {
        console.error('Connection failed:', e);
    }
}

checkDB();
