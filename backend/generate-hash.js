const bcrypt = require('bcrypt');

// Generate hashed passwords for dummy data
// Password: Admin@123 (meets requirements: 8-16 chars, uppercase, special char)

async function generateHashes() {
    const password = 'Admin@123';
    const hash = await bcrypt.hash(password, 10);

    console.log('Password for all dummy users: Admin@123');
    console.log('Bcrypt hash:', hash);
    console.log('\nUse this hash in your SQL file for all users');
}

generateHashes();
