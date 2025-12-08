const axios = require('axios');

const BACKEND_URL = 'https://rating-system-backend-8uvrb24gc-rahulxpathaks-projects.vercel.app/api';

async function testAdmin() {
    try {
        console.log('1. Logging in as Admin...');
        const loginRes = await axios.post(`${BACKEND_URL}/auth/login`, {
            email: 'admin@system.com',
            password: 'Admin@123'
        });
        const token = loginRes.data.token;
        console.log('   Login Success. Token received.');

        console.log('\n2. Fetching Dashboard Stats (/api/admin/dashboard)...');
        try {
            const dashRes = await axios.get(`${BACKEND_URL}/admin/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('   Stats:', dashRes.data);
        } catch (err) {
            console.error('   Failed:', err.response ? err.response.status : err.message);
            if (err.response) console.error('   Data:', err.response.data);
        }

        console.log('\n3. Fetching Users (/api/admin/users)...');
        try {
            const usersRes = await axios.get(`${BACKEND_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`   Success. Retrieved ${usersRes.data.length} users.`);
        } catch (err) {
            console.error('   Failed:', err.response ? err.response.status : err.message);
            if (err.response) console.error('   Data:', err.response.data);
        }

    } catch (error) {
        console.error('Login Failed:', error.response ? error.response.data : error.message);
    }
}

testAdmin();
