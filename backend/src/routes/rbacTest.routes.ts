import { Router } from 'express';
import * as rbacTestController from '../controllers/rbacTest.controller.js';
import { authenticate } from '../middlewares/auth/authentication.middleware.js';
import { requireRole, requirePermission } from '../middlewares/auth/authorization.middleware.js';

const router = Router();

router.use(authenticate);

// Role-based test endpoints
router.get('/super-admin', requireRole('super_admin'), rbacTestController.testSuperAdminOnly);
router.get('/admin-area', requireRole('super_admin', 'admin'), rbacTestController.testAdminArea);

// Fine-grained permission test endpoints
router.get('/users-read', requirePermission('users:read'), rbacTestController.testUsersRead);
router.post('/user-create', requirePermission('users:create'), rbacTestController.testUserCreate);
router.put('/users-update', requirePermission('users:update'), rbacTestController.testUsersUpdate);
router.delete('/user-delete', requirePermission('users:delete'), rbacTestController.testUserDelete);

router.get('/roles-read', requirePermission('roles:read'), rbacTestController.testRolesRead);
router.post('/roles-manage', requirePermission('roles:update'), rbacTestController.testRolesManage);

router.get('/analytics-read', requirePermission('financial_report:read'), rbacTestController.testAnalyticsRead);

router.get('/settings-read', requirePermission('settings:read'), rbacTestController.testSettingsRead);
router.put('/settings-manage', requirePermission('settings:update'), rbacTestController.testSettingsManage);

// Residence Modules Test Endpoints
router.get('/business-read', requirePermission('business:read'), rbacTestController.testBusinessRead);
router.put('/business-manage', requirePermission('business:update'), rbacTestController.testBusinessManage);

router.get('/rooms-read', requirePermission('room:read'), rbacTestController.testRoomsRead);
router.post('/rooms-manage', requirePermission('room:update'), rbacTestController.testRoomsManage);

router.get('/amenities-read', requirePermission('amenity:read'), rbacTestController.testAmenitiesRead);
router.post('/amenities-manage', requirePermission('amenity:update'), rbacTestController.testAmenitiesManage);

router.get('/bookings-read', requirePermission('booking:read'), rbacTestController.testBookingsRead);
router.post('/bookings-create', requirePermission('booking:create'), rbacTestController.testBookingsCreate);
router.put('/bookings-edit', requirePermission('booking:update'), rbacTestController.testBookingsEdit);
router.delete('/bookings-delete', requirePermission('booking:delete'), rbacTestController.testBookingsDelete);

router.get('/transactions-read', requirePermission('transaction:read'), rbacTestController.testTransactionsRead);
router.post('/transactions-create', requirePermission('transaction:create'), rbacTestController.testTransactionsCreate);
router.put('/transactions-edit', requirePermission('transaction:update'), rbacTestController.testTransactionsEdit);
router.delete('/transactions-delete', requirePermission('transaction:delete'), rbacTestController.testTransactionsDelete);

export default router;

