const axios = require('axios');

const BACKEND_URL = 'https://rating-system-backend-79z8f1xg9-rahulxpathaks-projects.vercel.app/api';

async function testLogin() {
    try {
        console.log(`Attempting login to: ${BACKEND_URL}/auth/login`);
        const response = await axios.post(`${BACKEND_URL}/auth/login`, {
            email: 'john.anderson@email.com',
            password: 'Admin@123'
        });
        console.log('Login Success!');
        console.log('Status:', response.status);
        console.log('Token:', response.data.token ? 'Received' : 'Missing');
    } catch (error) {
        console.error('Login Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testLogin();
