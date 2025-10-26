const http = require('http');

function request(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      const { statusCode } = res;
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode, body: data }));
    }).on('error', reject);
  });
}

async function run() {
  try {
    console.log('Checking gateway /health');
    const g = await request('http://localhost:3000/health');
    console.log('/health ->', g.statusCode, g.body);

    console.log('Checking auth verify via gateway (expect 401 or 403 without token)');
    const a = await request('http://localhost:3000/api/auth/verify');
    console.log('/api/auth/verify ->', a.statusCode, a.body);

    console.log('Checking members /health on service directly');
    const m = await request('http://localhost:3002/health');
    console.log('members /health ->', m.statusCode, m.body);

    console.log('Smoke test finished');
  } catch (err) {
    console.error('Smoke test error', err.message || err);
    process.exit(2);
  }
}

run();
