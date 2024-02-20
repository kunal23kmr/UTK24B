import { Router } from "express";
import {
    registerAccommodation,
    // getAccommodationList,
    getUnverifiedAccommodationList,
    getVerifiedAccommodationList,
    changeAccommodationVerificationStatus,
    getMyBookingList,
    getAllRoomList,
    deleteRequest,
} from "../controllers/accommodation.controller.js"
import { isLoggedIn } from "../middlewares/auth.middleware.js";
const router = Router();

router.route('/registerAccommodation').post(isLoggedIn, registerAccommodation);
// router.route('/getAccommodationList').post(isLoggedIn, getAccommodationList);
// router.route('/getUnverifiedAccommodationList/').post(isLoggedIn, getUnverifiedAccommodationList);
router.route('/getUnverifiedAccommodationList/:type').post(isLoggedIn, getUnverifiedAccommodationList);
router.route('/getUnverifiedAccommodationList').post(isLoggedIn, getUnverifiedAccommodationList);

router.route('/getVerifiedAccommodationList/:type').post(isLoggedIn, getVerifiedAccommodationList);
router.route('/getVerifiedAccommodationList').post(isLoggedIn, getVerifiedAccommodationList);

router.route('/changeAccommodationVerificationStatus').post(isLoggedIn, changeAccommodationVerificationStatus);
router.route('/getMyBookingList').post(isLoggedIn, getMyBookingList);
router.route('/getAllRoomList').post(isLoggedIn, getAllRoomList);
router.route('/deleteAccommodation').post(isLoggedIn, deleteRequest);

export default router;
