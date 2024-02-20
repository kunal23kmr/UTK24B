import { Router } from "express";
import {
    registerTshirt,
    getUnverifiedPaymentList,
    getVerifiedPaymentList,
    changeOrderVerificationStatus,
    getMyOrderList,
    getAllOrderList,
} from "../controllers/merchandise.controller.js"
import { isLoggedIn } from "../middlewares/auth.middleware.js";


const router = Router();


router.route("/registerTshirt").post(isLoggedIn,registerTshirt);
router.route("/getUnverifiedPaymentList").post(isLoggedIn, getUnverifiedPaymentList);
router.route("/getUnverifiedPaymentList/:clothId").post(isLoggedIn, getUnverifiedPaymentList);

router.route("/getVerifiedPaymentList").post(isLoggedIn, getVerifiedPaymentList);
router.route("/getVerifiedPaymentList/:clothId").post(isLoggedIn, getVerifiedPaymentList);

router.route("/changeOrderVerificationStatus").post(isLoggedIn, changeOrderVerificationStatus);
router.route("/getMyOrderList").post(isLoggedIn, getMyOrderList);
router.route("/getAllOrderList").post(isLoggedIn, getAllOrderList);
router.route("/getAllOrderList/:clothId").post(isLoggedIn, getAllOrderList);

export default router;