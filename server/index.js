const express = require('express');
const app = express();
const loggerMiddleware = require('./loggerMiddleware');

app.use(express.json());
app.use(loggerMiddleware);

let urlMap = new Map();
const BASE_URL = 'http://localhost:3001';

app.post('/shorturls', (req, res) => {
  const { url, validity = 30, shortcode } = req.body;
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }
  if (isNaN(validity) || validity <= 0) {
    return res.status(400).json({ error: 'Validity must be a positive integer' });
  }

  let code = shortcode || generateShortCode();
  while (urlMap.has(code)) {
    code = generateShortCode();
  }

  const expiry = new Date(Date.now() + validity * 60000).toISOString();
  urlMap.set(code, { url, expiry, clicks: [] });

  res.status(201).json({ shortLink: `${BASE_URL}/${code}`, expiry });
});

app.get('/shorturls/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  const entry = urlMap.get(shortcode);
  if (!entry) {
    return res.status(404).json({ error: 'Shortcode not found' });
  }
  if (new Date() > new Date(entry.expiry)) {
    return res.status(410).json({ error: 'Link expired' });
  }

  entry.clicks.push({ timestamp: new Date().toISOString(), source: req.get('referer') || 'unknown', location: 'unknown' });
  res.redirect(301, entry.url);
});

app.get('/shorturls/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  const entry = urlMap.get(shortcode);
  if (!entry) {
    return res.status(404).json({ error: 'Shortcode not found' });
  }
  res.json({
    totalClicks: entry.clicks.length,
    originalUrl: entry.url,
    creationDate: new Date(Date.now() - (new Date() - new Date(entry.expiry) + 30 * 60000)).toISOString(),
    expiryDate: entry.expiry,
    clickData: entry.clicks
  });
});

function isValidUrl(string) {
  try { new URL(string); return true; } catch (_) { return false; }
}

function generateShortCode() {
  return Math.random().toString(36).substr(2, 6);
}

app.listen(3001, () => console.log('Server running on port 3001'));