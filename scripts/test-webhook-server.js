import http from 'http';

const server = http.createServer((req, res) => {
  // Set CORS headers so the browser allows the request
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Handle POST requests (the webhook)
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      console.log('\n✅ INCOMING WEBHOOK RECEIVED!');
      console.log('------------------------------------------------');
      try {
        const payload = JSON.parse(body);
        console.log('📦 Payload Content:', JSON.stringify(payload, null, 2));
      } catch (e) {
        console.log('📦 Payload (Raw):', body);
      }
      console.log('------------------------------------------------\n');
      
      // Respond with success to keep Kanflow happy
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'received' }));
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3001, () => {
  console.log('\n🚀 TEST SERVER RUNNING');
  console.log('Use this URL in Kanflow Discord settings:');
  console.log('\x1b[36m%s\x1b[0m', 'http://localhost:3001/webhook');
  console.log('Waiting for messages...\n');
});
