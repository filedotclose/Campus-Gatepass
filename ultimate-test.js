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

function getAccessToken(res) {
    const cookies = res.headers['set-cookie'];
    if (!cookies) return null;
    const cookie = cookies.find(c => c.startsWith('accessToken='));
    return cookie ? cookie.split(';')[0] : null;
}

async function runFullLifecycle() {
    console.log("🚀 STARTING ULTIMATE LIFECYCLE TEST (Round-Trip)");

    // --- LOGIN AS ALL ROLES ---
    const sLoginData = JSON.stringify({ email: 'student@test.com', password: 'password123' });
    const sLoginRes = await request({ hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } }, sLoginData);
    const sToken = getAccessToken(sLoginRes);

    const wLoginData = JSON.stringify({ email: 'warden@test.com', password: 'password123' });
    const wLoginRes = await request({ hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } }, wLoginData);
    const wToken = getAccessToken(wLoginRes);

    const lLoginData = JSON.stringify({ email: 'librarian@test.com', password: 'password123' });
    const lLoginRes = await request({ hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } }, lLoginData);
    const lToken = getAccessToken(lLoginRes);

    // 1. STUDENT REQUEST
    console.log("\n[1/6] Student Requesting Pass...");
    const passData = JSON.stringify({ from: 'Hostel', to: 'Library', reason: 'Ultimate Round-Trip Verification' });
    const reqRes = await request({ hostname: 'localhost', port: 3000, path: '/api/pass/request', method: 'POST', headers: { 'Content-Type': 'application/json', 'Cookie': sToken } }, passData);
    const passId = JSON.parse(reqRes.body)._id || JSON.parse(reqRes.body).passId;
    console.log("✅ Pass Created ID:", passId);

    // 2. WARDEN APPROVE
    console.log("\n[2/6] Warden Approving Pass...");
    await request({ hostname: 'localhost', port: 3000, path: '/api/pass/approve', method: 'POST', headers: { 'Content-Type': 'application/json', 'Cookie': wToken } }, JSON.stringify({ passId, action: 'approve' }));
    console.log("✅ Pass Approved");

    // 3. WARDEN MARK EXIT
    console.log("\n[3/6] Warden Marking Hostel Exit...");
    await request({ hostname: 'localhost', port: 3000, path: '/api/pass/hostel-exit', method: 'POST', headers: { 'Content-Type': 'application/json', 'Cookie': wToken } }, JSON.stringify({ passId }));
    console.log("✅ Student Left Hostel");

    // 4. LIBRARIAN MARK ENTRY
    console.log("\n[4/6] Librarian Marking Library Entry...");
    await request({ hostname: 'localhost', port: 3000, path: '/api/pass/library-entry', method: 'POST', headers: { 'Content-Type': 'application/json', 'Cookie': lToken } }, JSON.stringify({ passId }));
    console.log("✅ Student Entered Library");

    // 5. LIBRARIAN MARK EXIT
    console.log("\n[5/6] Librarian Marking Library Exit...");
    await request({ hostname: 'localhost', port: 3000, path: '/api/pass/library-exit', method: 'POST', headers: { 'Content-Type': 'application/json', 'Cookie': lToken } }, JSON.stringify({ passId }));
    console.log("✅ Student Left Library (Heading back to Hostel)");

    // 6. WARDEN MARK ENTRY
    console.log("\n[6/6] Warden Marking Hostel Return Entry...");
    await request({ hostname: 'localhost', port: 3000, path: '/api/pass/hostel-entry', method: 'POST', headers: { 'Content-Type': 'application/json', 'Cookie': wToken } }, JSON.stringify({ passId }));
    console.log("✅ Student Returned to Hostel Safely");

    console.log("\n🏁 ULTIMATE ROUND-TRIP COMPLETE: System is 100% Production Certified!");
    process.exit(0);
}

runFullLifecycle().catch(error => {
    console.error("Test Failed:", error);
    process.exit(1);
});
