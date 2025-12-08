const bcrypt = require('bcrypt');

async function createAdminHash() {
    const password = 'Admin@12345';
    const hash = await bcrypt.hash(password, 10);

    console.log('='.repeat(60));
    console.log('ADMIN ACCOUNT DETAILS');
    console.log('='.repeat(60));
    console.log('Email: admin@ratingplatform.com');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('='.repeat(60));
    console.log('\nNow run this SQL in MySQL Workbench:\n');
    console.log(`INSERT INTO users (name, email, password_hash, role) VALUES ('System Administrator', 'admin@ratingplatform.com', '${hash}', 'admin');`);
    console.log('\n' + '='.repeat(60));
}

createAdminHash();
