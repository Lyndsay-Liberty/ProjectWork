

require('dotenv').config();

const apiKeyFromArg = process.argv.find(arg => arg.startsWith('--api-key='));
const API_KEY = apiKeyFromArg
  ? apiKeyFromArg.split('=')[1]
  : process.env.API_KEY;

  if (!API_KEY) {
  console.error("API Key is not set. Please provide it via --api-key or in the .env file.");
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
};