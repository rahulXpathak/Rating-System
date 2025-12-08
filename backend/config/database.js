require('dotenv').config();
const mysql = require('mysql2/promise');

// Database Connection Pool
const db = mysql.createPool({
    host: 'switchyard.proxy.rlwy.net',
    user: 'root',
    password: 'ieHHocQibHctXCsFdRJwWWHFfCAyGaub',
    database: 'railway',
    port: 52671,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = db;
