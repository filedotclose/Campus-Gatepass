const http = require('http');

async function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => resolve({
                statusCode: res.statusCode,
                headers: res.headers,
                body: responseData
            }));
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function runTest() {
    console.log("--- Starting Full Pass Flow Test ---");

    // 1. Login
    const loginData = JSON.stringify({ email: 'student@test.com', password: 'password123' });
    const loginRes = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': loginData.length }
    }, loginData);

    console.log("Login Status:", loginRes.statusCode);
    if (loginRes.statusCode !== 200) {
        console.error("Login failed!");
        process.exit(1);
    }

    // Extract cookies
    const cookies = loginRes.headers['set-cookie'];
    console.log("Cookies received:", cookies ? "Yes" : "No");

    const accessToken = cookies.find(c => c.startsWith('accessToken=')).split(';')[0];

    // 2. Request Pass
    const passData = JSON.stringify({
        from: 'Hostel',
        to: 'Library',
        reason: 'Studying for finals'
    });

    const passRes = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/pass/request',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': passData.length,
            'Cookie': accessToken
        }
    }, passData);

    console.log("Pass Request Status:", passRes.statusCode);
    console.log("Pass Request Body:", passRes.body);

    if (passRes.statusCode === 201 || (passRes.statusCode === 200 && passRes.body.includes('success'))) {
        console.log("✅ Pass flow verified via API!");
    } else {
        console.log("❌ Pass flow verification failed.");
    }

    process.exit(0);
}

runTest().catch(console.error);
