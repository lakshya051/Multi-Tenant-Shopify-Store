const prisma = require("../config/prisma.config");
const shopify = require("../config/shopify.config");

const handleShopifyWebhook = async (req, res) => {
  const topic = req.get("x-shopify-topic");
  const tenantId = req.params.tenantId;
  const shopDomain = req.get("x-shopify-shop-domain");
  const body = req.body; 

  console.log(`🚀 Webhook received for topic: ${topic} from ${shopDomain}`);

 
  res.status(200).send();

  try {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) {
      console.error(`Webhook for an unknown tenant received: ${tenantId}`);
      return;
    }

    switch (topic) {
      /**
       * -------------------------
       * PRODUCTS
       * -------------------------
       */
      case "products/create":
      case "products/update":
        await prisma.product.upsert({
          where: { id_tenantId: { id: body.id, tenantId } },
          update: {
            title: body.title,
            vendor: body.vendor,
            productType: body.product_type,
            imageUrl: body.image?.src || null,
          },
          create: {
            id: body.id,
            tenantId,
            title: body.title,
            vendor: body.vendor,
            productType: body.product_type,
            createdAt: new Date(body.created_at || Date.now()),
            imageUrl: body.image?.src || null,
          },
        });
        break;

      case "products/delete":
        await prisma.product
          .delete({ where: { id_tenantId: { id: body.id, tenantId } } })
          .catch(() =>
            console.warn(`⚠️ Product ${body.id} might have already been deleted.`)
          );
        break;

      /**
       * -------------------------
       * CUSTOMERS
       * -------------------------
       */
      case "customers/create":
      case "customers/update":
        await prisma.customer.upsert({
          where: { id_tenantId: { id: body.id, tenantId } },
          update: {
            firstName: body.first_name,
            lastName: body.last_name,
            email: body.email,
            phone: body.phone,
            orderCount: body.orders_count,
          },
          create: {
            id: body.id,
            tenantId,
            firstName: body.first_name,
            lastName: body.last_name,
            email: body.email,
            phone: body.phone,
            createdAt: new Date(body.created_at || Date.now()),
            orderCount: body.orders_count,
          },
        });
        break;

      /**
       * -------------------------
       * ORDERS
       * -------------------------
       */
      case "orders/create":
        await prisma.$transaction(async (tx) => {
          if (body.customer) {
            await tx.customer.upsert({
              where: { id_tenantId: { id: body.customer.id, tenantId } },
              update: {
                firstName: body.customer.first_name,
                lastName: body.customer.last_name,
                email: body.customer.email,
                phone: body.customer.phone,
              },
              create: {
                id: body.customer.id,
                tenantId,
                firstName: body.customer.first_name,
                lastName: body.customer.last_name,
                email: body.customer.email,
                phone: body.customer.phone,
                createdAt: new Date(
                  body.customer.created_at || Date.now()
                ),
              },
            });
          }

          await tx.order.create({
            data: {
              id: body.id,
              tenantId,
              totalPrice: parseFloat(body.total_price) || 0,
              currency: body.currency,
              financialStatus: body.financial_status,
              createdAt: new Date(body.created_at || Date.now()),
              customerId: body.customer ? body.customer.id : null,
              checkoutId: body.checkout_id || null,
              lineItems: {
                create: body.line_items.map((item) => ({
                  id: item.id,
                  productId: item.product_id,
                  name: item.name,
                  title: item.title,
                  vendor: item.vendor,
                  quantity: item.quantity,
                  price: parseFloat(item.price) || 0,
                })),
              },
            },
          });
        });
        break;

      /**
       * -------------------------
       * CHECKOUTS
       * -------------------------
       */
      case "checkouts/create":
      case "checkouts/update":
        const checkout = body;

        await prisma.checkout.upsert({
          where: {
            id_tenantId: {
              id: checkout.id,
              tenantId,
            },
          },
          update: {
            totalPrice: parseFloat(checkout.total_price) || 0,
            customerEmail: checkout.email,
            webUrl:
              checkout.web_url ||
              checkout.abandoned_checkout_url ||
              null,
          },
          create: {
            id: checkout.id,
            tenantId,
            totalPrice: parseFloat(checkout.total_price) || 0,
            currency: checkout.currency || "INR",
            customerEmail: checkout.email,
            webUrl:
              checkout.web_url ||
              checkout.abandoned_checkout_url ||
              null,
            createdAt: new Date(checkout.created_at || Date.now()),
          },
        });
        break;

      /**
       * -------------------------
       * APP UNINSTALL
       * -------------------------
       */
      case "app/uninstalled":
        console.log(
          `⚠️ App uninstalled for tenant ${tenantId}. Deleting all data.`
        );
        await prisma.tenant.delete({ where: { id: tenantId } });
        break;

      default:
        console.log(`⚠️ Unhandled webhook topic: ${topic}`);
    }
  } catch (error) {
    console.error(`❌ Webhook processing failed for topic ${topic}:`, error);
  }
};

module.exports = { handleShopifyWebhook };
