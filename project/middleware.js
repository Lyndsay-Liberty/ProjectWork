require('dotenv').config();
const crypto = require('crypto');

// In-memory map to store { email: apiKey }
const apiKeys = new Map();

// Helper to generate a random API key
function generateApiKey(length = 32) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

// Get API key from env or cmd line, add as "default"
const apiKeyFromArg = process.argv.find(arg => arg.startsWith('--api-key='));
const defaultApiKey = apiKeyFromArg
  ? apiKeyFromArg.split('=')[1]
  : process.env.API_KEY;

if (defaultApiKey) {
  apiKeys.set('default', defaultApiKey);
}

// Log the map at startup
console.log('API Keys at startup:', Object.fromEntries(apiKeys));

// Middleware to require a valid API key for the given email
function requireApiKey(req, res, next) {
  const apiKey = req.header('x-api-key');
  const email = req.header('x-email') || req.query.email || 'default';
  if (!apiKey) {
    res.status(401).send("API Key is missing");
    return;
  }
  if (!apiKeys.has(email) || apiKeys.get(email) !== apiKey) {
    res.status(403).send("API Key is invalid for this user");
    return;
  }
  next();
}

// Express route handler for GET /apikey?email=...
function apikeyRoute(req, res) {
  const email = req.query.email;
  if (!email) {
    res.status(400).send("Email query parameter is required");
    return;
  }
  const newKey = generateApiKey(32);
  apiKeys.set(email, newKey);
  // Log the map whenever a new key is added
  console.log('API Keys updated:', Object.fromEntries(apiKeys));
  res.json({ email, apiKey: newKey });
}

module.exports = {
  requireApiKey,
  apikeyRoute,
  apiKeys, // Exported for possible use elsewhere
};

/*const apiKeyFromArg = process.argv.find(arg => arg.startsWith('--api-key='));
const API_KEY = apiKeyFromArg
  ? apiKeyFromArg.split('=')[1]
  : process.env.API_KEY;

  if (!API_KEY) {
  console.error("apiKey has no value. Please provide a value through the API_KEY env var or --api-key cmd line parameter.");
  process.exit(1);
}

function requireApiKey(req, res, next) {
    const apiKey = req.header('x-api-key');
    if (!apiKey) {
        res.status(401).send("API Key is missing");
        return;
    }
    if (apiKey !== API_KEY) {
        res.status(403).send("API Key is invalid");
        return;
    }
    
    next();
}

module.exports = {
  requireApiKey,
}*/