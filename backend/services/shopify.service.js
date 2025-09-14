const prisma = require('../config/prisma.config');

async function syncProducts(tenantId, storeUrl, accessToken) {
  const shopifyApiUrl = `https://${storeUrl}/admin/api/2024-07/products.json`;
  const response = await fetch(shopifyApiUrl, { headers: { 'X-Shopify-Access-Token': accessToken } });
  if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);
  const { products } = await response.json();

  for (const product of products) {
  
    const imageUrl = product.image ? product.image.src : null;
    
    await prisma.product.upsert({
      where: { id_tenantId: { id: product.id, tenantId } },
      update: { 
        title: product.title, 
        vendor: product.vendor,
        imageUrl: imageUrl, 
      },
      create: { 
        id: product.id, 
        tenantId, 
        title: product.title, 
        vendor: product.vendor, 
        productType: product.product_type, 
        createdAt: new Date(product.created_at),
        imageUrl: imageUrl, 
      },
    });
  }
  console.log(`Synced ${products.length} products for ${storeUrl}`);
}

async function syncCustomers(tenantId, storeUrl, accessToken) {
  
  const shopifyApiUrl = `https://${storeUrl}/admin/api/2024-07/customers.json`;
  const response = await fetch(shopifyApiUrl, { headers: { 'X-Shopify-Access-Token': accessToken } });
  if (!response.ok) throw new Error(`Failed to fetch customers: ${response.statusText}`);
  const { customers } = await response.json();

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { id_tenantId: { id: customer.id, tenantId } },
      update: { firstName: customer.first_name, lastName: customer.last_name, email: customer.email, phone: customer.phone },
      create: { id: customer.id, tenantId, firstName: customer.first_name, lastName: customer.last_name, email: customer.email, phone: customer.phone, createdAt: new Date(customer.created_at) },
    });
  }
  console.log(`Synced ${customers.length} customers for ${storeUrl}`);
}



async function syncOrders(tenantId, storeUrl, accessToken) {
  const shopifyApiUrl = `https://${storeUrl}/admin/api/2024-07/orders.json?status=any`;
  const response = await fetch(shopifyApiUrl, { headers: { 'X-Shopify-Access-Token': accessToken } });
  if (!response.ok) throw new Error(`Failed to fetch orders: ${response.statusText}`);
  const { orders } = await response.json();
  
  for (const order of orders) {
    
    await prisma.order.upsert({
      where: { id_tenantId: { id: order.id, tenantId } },
      update: {
        totalPrice: parseFloat(order.total_price),
        financialStatus: order.financial_status,
        customerId: order.customer ? order.customer.id : null,
        checkoutId: order.checkout_id,
      },
      create: {
        id: order.id,
        tenantId,
        totalPrice: parseFloat(order.total_price),
        currency: order.currency,
        financialStatus: order.financial_status,
        createdAt: new Date(order.created_at),
        customerId: order.customer ? order.customer.id : null,
        checkoutId: order.checkout_id,
      },
    });

    
    if (order.line_items) {
      for (const item of order.line_items) {
        
        if (item.product_id) {
          await prisma.lineItem.upsert({
            where: { id_tenantId: { id: item.id, tenantId } },
            update: {
              quantity: item.quantity,
              price: parseFloat(item.price),
            },
            create: {
              id: item.id,
              tenantId,
              orderId: order.id,
              productId: item.product_id,
              quantity: item.quantity,
              price: parseFloat(item.price),
              title: item.title,
            },
          });
        }
      }
    }
  }
  console.log(`Synced ${orders.length} orders for ${storeUrl}`);
}

async function syncCheckouts(tenantId, storeUrl, accessToken) {
  const shopifyApiUrl = `https://${storeUrl}/admin/api/2024-07/checkouts.json`;
  const response = await fetch(shopifyApiUrl, { headers: { 'X-Shopify-Access-Token': accessToken } });
  if (!response.ok) throw new Error(`Failed to fetch checkouts: ${response.statusText}`);
  const { checkouts } = await response.json();
  
  for (const checkout of checkouts) {
    await prisma.checkout.upsert({
      where: { id_tenantId: { id: checkout.id, tenantId } },
      update: {
        totalPrice: parseFloat(checkout.total_price) || 0,
        customerEmail: checkout.email,
        webUrl: checkout.web_url || checkout.abandoned_checkout_url || null,
      },
      create: {
        id: checkout.id,
        tenantId,
        totalPrice: parseFloat(checkout.total_price) || 0,
        currency: checkout.currency || "INR",
        customerEmail: checkout.email,
        webUrl: checkout.web_url || checkout.abandoned_checkout_url || null,
        createdAt: new Date(checkout.created_at || Date.now()),
      },
    });
  }
  console.log(`Synced ${checkouts.length} checkouts for ${storeUrl}`);
}

module.exports = { syncProducts, syncCustomers, syncOrders, syncCheckouts };