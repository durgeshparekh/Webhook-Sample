const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

// Create an Express app
const app = express();
const port = 3000;

// Secret for verifying GitHub webhook payloads
const SECRET = crypto.randomBytes(32).toString('hex');  // Change this to your GitHub webhook secret
console.log(SECRET);

// Middleware to parse JSON payloads
app.use(bodyParser.json());

// Webhook endpoint to listen for GitHub events
app.post('/github-webhook', (req, res) => {
   console.log('Request Headers:', req.headers);  // Log the headers
   console.log('Request Body:', req.body);  // Log the request body

   // Signature validation and processing
   const signature = req.headers['x-hub-signature'];
   const payload = JSON.stringify(req.body);
   const hash = 'sha1=' + crypto.createHmac('sha1', SECRET).update(payload).digest('hex');

   if (signature !== hash) {
      return res.status(400).send('Webhook signature mismatch');
   }

   res.status(200).send('Webhook received');
});

// Start the server
app.listen(port, () => {
   console.log(`Webhook listener running on http://localhost:${port}`);
});
