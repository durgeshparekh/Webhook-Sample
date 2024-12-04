const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

// Create an Express app
const app = express();
const port = 3000;

// Secret for verifying GitHub webhook payloads
const SECRET = 'webhook-secret';  // Change this to your GitHub webhook secret

// Middleware to parse JSON payloads
app.use(bodyParser.json());

// Webhook endpoint to listen for GitHub events
app.post('/github-webhook', (req, res) => {
   // Get the signature from the request headers
   const signature = req.headers['x-hub-signature'];

   // Get the raw payload body
   const payload = JSON.stringify(req.body);

   // Calculate the HMAC of the payload using the secret
   const hash = 'sha1=' + crypto.createHmac('sha1', SECRET).update(payload).digest('hex');

   // Compare the computed hash with the signature from GitHub
   if (signature !== hash) {
      return res.status(400).send('Webhook signature mismatch');
   }

   // Handle the payload (e.g., log it)
   console.log('Received payload:', req.body);

   // Respond with a 200 OK to GitHub
   res.status(200).send('Webhook received');
});

// Start the server
app.listen(port, () => {
   console.log(`Webhook listener running on http://localhost:${port}`);
});
