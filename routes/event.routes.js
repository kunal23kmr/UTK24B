import { Router } from 'express';
import {
  deleteEventById, updateEventById, removeEvent, updateParticipantVerification, removeParticipantsFromEvent, addfacultycoordinatorById, 
  addclubcoordinatorById, addtcacoordinatorById, addParticipantToEventById, gettcacordinatorByEventId, getParticipantsByEventId,
  createEvent, getAllEvents,getfacultycordinatorByEventId,getclubcordinatorByEventId
} from '../controllers/event.controller.js';

import {
  authorizeRoles,
  authorizeSubscribers,
  isLoggedIn,
} from '../middlewares/auth.middleware.js';

const router = Router();

router
  .route('/')
  .get(isLoggedIn, getAllEvents)
  .post(
    isLoggedIn,
    authorizeRoles('ADMIN'),
    // upload.single('thumbnail'),
    createEvent
  )
  .delete(isLoggedIn, authorizeRoles('ADMIN'), removeParticipantsFromEvent)
  .put(isLoggedIn, authorizeRoles('ADMIN'), updateParticipantVerification)
router
  .route('/:id')
  .post(
    isLoggedIn,
    authorizeRoles('ADMIN'),

    addParticipantToEventById
  )
  .get(isLoggedIn, authorizeSubscribers, getParticipantsByEventId) // Added authorizeSubscribers to check if user is admin or subscribed if not then forbid the access to the lectures
  .put(isLoggedIn, authorizeRoles('ADMIN'), updateEventById);


router
  .route('/tcacoordinator/:id')
  .post(
    isLoggedIn,
    authorizeRoles('ADMIN'),

    addtcacoordinatorById
  )
  .get(isLoggedIn, gettcacordinatorByEventId)

router
  .route('/lecture/:id')
  .post(
    isLoggedIn,
    authorizeRoles('USER'),

    addParticipantToEventById
  )

router
  .route('/clubcoordinator/:id')
  // Added authorizeSubscribers to check if user is admin or subscribed if not then forbid the access to the lectures
  .post(
    isLoggedIn,
    authorizeRoles('ADMIN'),
    // upload.single('lecture'),
    addclubcoordinatorById
  )
  .get(isLoggedIn, getclubcordinatorByEventId)

router
  .route('/facultycoordinator/:id')
  .post(
    isLoggedIn,
    authorizeRoles('ADMIN'),
    // upload.single('lecture'),
    addfacultycoordinatorById
  )
  .get(isLoggedIn, getfacultycordinatorByEventId)





export default router;
