import http from 'http';

const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/api/v1/users/login',
  method: 'OPTIONS',
  headers: {
    'Origin': 'http://localhost:5173',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'x-deployment-password, content-type'
  }
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
});
req.end();
