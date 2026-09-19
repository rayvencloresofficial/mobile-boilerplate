import { Router } from 'express';
import * as permissionController from '../controllers/permission.controller.js';
import { authenticate } from '../middlewares/auth/authentication.middleware.js';
import { requirePermission } from '../middlewares/auth/authorization.middleware.js';

const router = Router();

router.use(authenticate);

// Permissions are RBAC configuration metadata, not public account data.
router.get('/', requirePermission('roles:read'), permissionController.getPermissions);

export default router;
