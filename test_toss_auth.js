// const fetch = require('node-fetch'); // Native fetch in Node 18+

const SECRET_KEY = 'test_sk_yZqmkKeP8gJXPxzkzQPxrbQRxB9l';
const basicAuth = Buffer.from(SECRET_KEY + ':').toString('base64');

async function test() {
    console.log('Testing Basic Auth with GET /v2/transactions?startDate=... (Simple endpoint)');
    // actually v2 transactions?
    // Try GET /v2/payouts/sellers/RANDOM_ID
    // expect 404
    try {
        const res = await fetch('https://api.tosspayments.com/v2/payouts/sellers/TEST_ID_12345', {
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(`GET /v2/payouts/sellers/:id -> Status: ${res.status} ${res.statusText}`);
        const text = await res.text();
        console.log('Body:', text);
    } catch (e) {
        console.error('GET Failed:', e);
    }
}

test();
