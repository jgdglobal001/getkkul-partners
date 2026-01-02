const fs = require('fs');

try {
    const localEnv = fs.readFileSync('local_env_backup.txt', 'utf8');
    const lines = localEnv.split('\n');
    const dbLine = lines.find(l => l.startsWith('DATABASE_URL='));

    if (!dbLine) {
        console.error('DATABASE_URL not found');
        process.exit(1);
    }

    const newKeys = [
        dbLine.trim(),
        'TOSS_PAYMENTS_SECRET_KEY=test_sk_yZqmkKeP8gJXPxzkzQPxrbQRxB9l',
        'TOSS_PAYMENTS_SECURITY_KEY=aa7a2d2c5e549266af1614103e9b2f8c6d6ab9c5542c6f7580c4085dbd5b290a',
        'NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY=test_ck_PBal2vxj81NEAlpE66nw35RQgOAN',
        'KAKAO_CLIENT_ID=2cdbf42c98cf959c69f15dfbb0dccbd7',
        'KAKAO_CLIENT_SECRET=F0Cf6nUJBLAhr0NxXbCLrNEm9vy6OyQ1'
    ].join('\n');

    fs.writeFileSync('temp_run.env', newKeys);
    console.log('temp_run.env created successfully');
} catch (e) {
    console.error(e);
}
