const { shopifyApi, LATEST_API_VERSION } = require('@shopify/shopify-api');
const { restResources } = require('@shopify/shopify-api/rest/admin/2024-04');
require('@shopify/shopify-api/adapters/node');

const shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: ['read_products', 'read_orders', 'read_customers'],
    hostName: process.env.HOST.replace(/https?:\/\//, ""),
    apiVersion: LATEST_API_VERSION,
    restResources,
});

module.exports = shopify;