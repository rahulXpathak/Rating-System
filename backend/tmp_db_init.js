const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const sqlFile = path.join(__dirname, '../setup_database_clean.sql');

async function initDB() {
    console.log('Read SQL file...');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');

    // Split by semicolon
    const queries = sqlContent
        .split(';')
        .map(q => q.trim())
        .filter(q => q.length > 0);

    console.log('Connecting to database...');
    const connection = await mysql.createConnection({
        host: 'switchyard.proxy.rlwy.net',
        user: 'root',
        password: 'ieHHocQibHctXCsFdRJwWWHFfCAyGaub',
        port: 52671,
        database: 'railway', // Use the provided DB name!
        ssl: { rejectUnauthorized: false }, // Add SSL for safety
        multipleStatements: true
    });

    console.log('Connected! Executing queries...');

    for (const query of queries) {
        // SKIP Database creation/selection commands because we must use 'railway'
        if (query.toUpperCase().startsWith('CREATE DATABASE') ||
            query.toUpperCase().startsWith('DROP DATABASE') ||
            query.toUpperCase().startsWith('USE ')) {
            console.log('Skipping DB command:', query.substring(0, 50) + '...');
            continue;
        }

        try {
            await connection.query(query);
            console.log('Executed:', query.substring(0, 50).replace(/\n/g, ' ') + '...');
        } catch (err) {
            // Ignore "Table already exists" errors to be safe, but log others
            if (err.code === 'ER_TABLE_EXISTS_ERROR') {
                console.log('Table exists, skipping.');
            } else {
                console.error('Error executing query:', err.message);
            }
        }
    }

    console.log('Database initialization complete!');
    await connection.end();
}

initDB().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
