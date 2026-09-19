import { Router } from 'express';
import * as profileController from '../controllers/profile.controller.js';
import { authenticate } from '../middlewares/auth/authentication.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
    createProfileSchema,
    updateProfileSchema,
    userIdParamSchema,
    profileIdParamSchema,
} from '../validations/profile.validations.js';

const router = Router();

router.use(authenticate);

router.get('/me', profileController.getCurrentProfile);
router.get('/:userId', validateRequest({ params: userIdParamSchema }), profileController.getProfileByUserId);
router.get('/id/:id', validateRequest({ params: profileIdParamSchema }), profileController.getProfileById);
router.post('/', validateRequest({ body: createProfileSchema }), profileController.createProfile);
router.put('/:userId', validateRequest({ params: userIdParamSchema, body: updateProfileSchema }), profileController.updateProfile);
router.delete('/:userId', validateRequest({ params: userIdParamSchema }), profileController.deleteProfile);

export default router;
