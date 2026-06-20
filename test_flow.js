import http from 'http';

function request(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: 8000,
      path,
      method: 'POST',
      headers: {
        'x-deployment-password': 'securepassword123',
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function test() {
  console.log("Attempting login directly...");
  const res = await request('/api/v1/users/login', {
    email: 'man@gmail.com',
    password: 'securepassword123' // Or whatever it is, it will probably fail
  });
  console.log(res.status, res.body);
}

test();
