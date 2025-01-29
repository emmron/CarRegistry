const https = require('https');
const http = require('http');

exports.handler = async function(event, context) {
  // Get the path from the event
  const path = event.path.replace('/.netlify/functions/api-proxy', '');
  
  // Configure the request options
  const options = {
    hostname: process.env.API_HOST || 'localhost',
    port: process.env.API_PORT || 5074,
    path: `/api${path}`,
    method: event.httpMethod,
    headers: {
      ...event.headers,
      host: process.env.API_HOST || 'localhost'
    }
  };

  try {
    // Make the request to the API
    const response = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, body, headers: res.headers }));
      });
      
      req.on('error', reject);
      
      if (event.body) {
        req.write(event.body);
      }
      req.end();
    });

    // Return the response
    return {
      statusCode: response.statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
      },
      body: response.body
    };
  } catch (error) {
    console.error('API Proxy Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to proxy request' })
    };
  }
}; 