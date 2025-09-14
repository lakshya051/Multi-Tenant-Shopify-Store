const prisma = require('../config/prisma.config');
const shopifyService = require('../services/shopify.service');

const linkUserToTenant = async (req, res) => {
    const { userId } = req.user; 
    const { tenantId } = req.body;
    if (!tenantId) return res.status(400).json({ error: 'tenantId is required.' });

    try {
        await prisma.user.update({ where: { id: userId }, data: { tenants: { connect: { id: tenantId } } } });
        res.status(200).json({ message: 'User successfully linked to tenant.' });
    } catch (error) {
        console.error('Link user to tenant error:', error);
        res.status(500).json({ error: 'Could not link user to tenant.' });
    }
};

const getDataForUser = async (req, res) => {
    const { userId } = req.user; 
    try {
        const userWithData = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                tenants: {
                    include: {
                        products: true,
                        customers: { include: { _count: { select: { orders: true } } } },
                        orders: { include: { customer: true, lineItems: true } },
                        checkouts: true,
                    },
                },
            },
        });

        if (!userWithData) return res.status(404).json({ error: 'User not found.' });

        const processedTenants = userWithData.tenants.map(tenant => ({
            ...tenant,
            customers: tenant.customers.map(customer => ({
                ...customer,
                status: customer._count.orders > 1 ? 'Returning' : 'New',
            })),
        }));

        res.status(200).json(processedTenants);
    } catch (error) {
        console.error('Get data for user error:', error);
        res.status(500).json({ error: 'Could not fetch data.' });
    }
};


const syncTenantData = async (req, res) => {
    const { tenantId } = req.params;
    const { userId } = req.user;

    try {
        const userHasAccess = await prisma.user.findFirst({ where: { id: userId, tenants: { some: { id: tenantId } } } });
        if (!userHasAccess) return res.status(403).json({ error: "Forbidden: You don't have access to this tenant." });

        const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
        if (!tenant) return res.status(404).json({ error: 'Tenant not found.' });

        await shopifyService.syncProducts(tenant.id, tenant.storeUrl, tenant.accessToken);
        await shopifyService.syncCustomers(tenant.id, tenant.storeUrl, tenant.accessToken);
        await shopifyService.syncOrders(tenant.id, tenant.storeUrl, tenant.accessToken);
        await shopifyService.syncCheckouts(tenant.id, tenant.storeUrl, tenant.accessToken);

        res.status(200).json({ message: 'Sync completed successfully.' });
    } catch (error) {
        console.error('Sync failed:', error);
        res.status(500).json({ error: 'Sync failed.' });
    }
};

const deleteTenant = async (req, res) => {
    const { tenantId } = req.params;
    const { userId } = req.user;

    try {
        const userHasAccess = await prisma.user.findFirst({
            where: {
                id: userId,
                tenants: { some: { id: tenantId } },
            },
        });

        if (!userHasAccess) {
            return res.status(403).json({ error: "Forbidden: You don't have access to this tenant." });
        }
        await prisma.tenant.delete({
            where: { id: tenantId },
        });

        res.status(200).json({ message: 'Store and all its data have been successfully deleted.' });
    } catch (error) {
        console.error('Delete tenant error:', error);
        res.status(500).json({ error: 'Failed to delete the store.' });
    }
};

module.exports = { linkUserToTenant, getDataForUser, syncTenantData, deleteTenant }; 