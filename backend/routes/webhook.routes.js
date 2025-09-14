const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/webhook.controller");
const { verifyShopifyWebhook } = require("../middleware/auth.middleware");

router.post(
  "/shopify/:tenantId",
  express.raw({ type: "application/json" }),
  verifyShopifyWebhook,
  webhookController.handleShopifyWebhook
);

module.exports = router;