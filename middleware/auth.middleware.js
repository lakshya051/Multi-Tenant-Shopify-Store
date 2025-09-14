const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (token == null) {
        return res.sendStatus(401); 
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); 
        }
        req.user = user;
        next();
    });
}

const verifyShopifyWebhook = (req, res, next) => {
    try {
      const hmacHeader = req.get("X-Shopify-Hmac-Sha256");
      const body = req.body;
      const shopifySecret = process.env.SHOPIFY_API_SECRET;
  
      if (!hmacHeader || !body || !shopifySecret) {
        return res.status(401).send("Unauthorized");
      }
  
      const hash = crypto
        .createHmac("sha256", shopifySecret)
        .update(body, "utf8", "hex")
        .digest("base64");
  
      if (hash === hmacHeader) {
        req.body = JSON.parse(body.toString());
        next();
      } else {
        res.status(403).send("Forbidden: HMAC validation failed.");
      }
    } catch (error) {
      console.error("Webhook verification error:", error);
      res.status(500).send("Internal Server Error");
    }
  };

module.exports = { authenticateToken, verifyShopifyWebhook };