const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenant.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

router.get('/me/data', tenantController.getDataForUser);
router.post('/:tenantId/sync', tenantController.syncTenantData);
router.post('/link', tenantController.linkUserToTenant);
router.delete('/:tenantId', tenantController.deleteTenant);

module.exports = router;