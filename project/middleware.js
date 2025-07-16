

function requireApiKey(req, res, next) {
    const apiKey = req.header('x-api-key');
    if (!apiKey) {
        res.status(401).send("API Key is missing");
        return;
    }
    if (apiKey !== process.env.API_KEY) {
        res.status(403).send("API Key is invalid");
        return;
    }
    next();
}


module.exports = {
  requireApiKey,
};