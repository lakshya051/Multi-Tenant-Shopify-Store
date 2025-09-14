const shopify = require('../config/shopify.config');
const prisma = require('../config/prisma.config');
const shopifyService = require('../services/shopify.service');


const install = async (req, res) => {
    const shop = req.query.shop;
    if (!shop) {
        return res.status(400).send("Missing 'shop' query parameter.");
    }
    
    
    await shopify.auth.begin({
        shop: shop,
        callbackPath: '/api/shopify/callback',
        isOnline: false, 
        rawRequest: req,
        rawResponse: res,
    });
};


const callback = async (req, res) => {
    try {
        const callbackData = await shopify.auth.callback({ rawRequest: req, rawResponse: res });
        const { session } = callbackData;

        const tenant = await prisma.tenant.upsert({
            where: { storeUrl: session.shop },
            update: { accessToken: session.accessToken },
            create: { storeUrl: session.shop, accessToken: session.accessToken },
            select: { id: true, storeUrl: true }
        });
        
        
        console.log("Registering webhooks for", session.shop);
        const webhookEndpoint = `${process.env.HOST}/api/webhooks/shopify/${tenant.id}`;
        const webhookTopics = [
            "products/create", 
            "products/update", 
            "products/delete", 
            "orders/create", 
            "customers/create", 
            "customers/update", 
            "app/uninstalled",
            "checkouts/create",
            "checkouts/update",
        ];
        const client = new shopify.clients.Rest({ session });

        
        const existingWebhooks = await client.get({ path: "webhooks" });
        for (const webhook of existingWebhooks.body.webhooks) {
            await client.delete({ path: `webhooks/${webhook.id}` });
        }

        
        for (const topic of webhookTopics) {
            try {
                await client.post({
                    path: "webhooks",
                    data: { webhook: { topic, address: webhookEndpoint, format: "json" } },
                });
                console.log(`✅ Successfully registered webhook: ${topic}`);
            } catch (error) {
                console.error(`❌ Failed to register webhook: ${topic}`, error.message);
            }
        }
        
        
        res.redirect(`${process.env.HOST_URL}/shopify/return?newTenantId=${tenant.id}&shop=${tenant.storeUrl}`);

    } catch (error) {
        console.error('Failed during OAuth callback:', error);
        res.status(500).send('Authentication failed.');
    }
};


const handleWebhook = async (req, res) => {
    console.log("old webhook");
};

module.exports = { install, callback, handleWebhook };

