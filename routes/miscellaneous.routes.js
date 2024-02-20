import { Router } from 'express';
import {
  contactUs,
  getContactUs,
  rejectionMail,
  replyQuery,
  userStats,
} from '../controllers/miscellaneous.controller.js';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';

const router = Router();

// {{URL}}/api/v1/
router.route('/contact').post(contactUs);
router
  .route('/admin/stats/users')
  .get(isLoggedIn, authorizeRoles('ADMIN'), userStats);

router.post('/contact/getContactUs', getContactUs);
router.post('/contact/replyQuery', replyQuery);
router.post('/rejectionMail', rejectionMail);
export default router;
