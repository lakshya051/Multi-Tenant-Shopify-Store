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
        
        console.log(`Successfully onboarded and saved tenant: ${tenant.storeUrl}`);
        
        res.redirect(`${process.env.HOST_URL}/shopify/return?newTenantId=${tenant.id}&shop=${tenant.storeUrl}`);

    } catch (error) {
        console.error('Failed during OAuth callback:', error);
        res.status(500).send('Authentication failed.');
    }
};


const handleWebhook = async (req, res) => {
    try {
        
        const { topic, shop, webhookId } = await shopify.webhooks.validate({
            rawBody: req.body.toString(),
            rawRequest: req,
            rawResponse: res,
        });

        if (!shop) {
            return res.status(401).send('Webhook validation failed: Could not determine shop.');
        }

        
        const tenant = await prisma.tenant.findUnique({ where: { storeUrl: shop } });
        if (!tenant) {
            console.warn(`Webhook received for an unknown tenant: ${shop}`);
            
            return res.status(200).send('Webhook received for unknown tenant.');
        }

        
        switch (topic) {
            case 'ORDERS_CREATE':
                console.log(`Webhook received: New order created for ${shop}.`);
                const orderData = JSON.parse(req.body.toString());
                
                await shopifyService.syncOrders(tenant.id, tenant.storeUrl, tenant.accessToken);
                break;
            
            default:
                console.log(`Webhook received for unhandled topic: ${topic}`);
                break;
        }

        res.status(200).send('Webhook processed successfully.');
        
    } catch (error) {
        console.error('Webhook processing error:', error);
        
        res.status(500).send('An error occurred while processing the webhook.');
    }
};

module.exports = { install, callback, handleWebhook };

