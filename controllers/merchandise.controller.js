import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import AppError from '../utils/AppError.js';
import User from '../models/user.model.js';
import Merchandise from '../models/merchandise.model.js';


export const registerTshirt = asyncHandler(async (req, res, next) => {
    // console.log(req.body);

    const {
        nameOnCloth,
        applicantName,
        clothId,
        quantity,
        sizeOfCloth,
        hostelName,
        paymentReferenceNumber,
        phoneNumber,
        rollNumber,
        wtpNumber } = req.body;
    try {
        const order = await Merchandise.create({
            nameOnCloth,
            applicantName,
            clothId,
            quantity,
            sizeOfCloth,
            hostelName,
            paymentReferenceNumber,
            phoneNumber,
            rollNumber,
            wtpNumber,
            registrantId: req.user.id,
        });



        if (!order) {
            return next(new AppError('Problem in placing order.', 404));
        }
        const user = await User.findById(req.user.id);
        user.registeredOrders.push(order._id);
        // console.log(order);
        await user.save();
        return res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order
        });

    } catch (err) {
        // console.log(err);
        res.status(500).json({ success: false, message: 'Server error.' })
    }

});


export const getUnverifiedPaymentList = asyncHandler(async (req, res, next) => {
    const { clothId } = req.params;
    if (clothId) {
        const pendingVerification = await Merchandise.find({ clothId, paymentVerified: false }).populate('registrantId', 'email');
        return res.status(200).json({
            success: true,
            data: pendingVerification,
        });
    }
    const pendingVerification = await Merchandise.find({ paymentVerified: false }).populate('registrantId', 'email');
    res.status(200).json({
        success: true,
        data: pendingVerification,
    });
});

export const getVerifiedPaymentList = asyncHandler(async (req, res, next) => {
    const { clothId } = req.params;
    if (clothId) {
        const verifiedPaymentList = await Merchandise.find({ clothId, paymentVerified: true }).populate('registrantId', 'email');
        return res.status(200).json({
            success: true,
            data: verifiedPaymentList,
        });
    }
    const verifiedPaymentList = await Merchandise.find({ paymentVerified: true }).populate('registrantId', 'email');
    res.status(200).json({
        success: true,
        data: verifiedPaymentList,
    });
});


export const changeOrderVerificationStatus = asyncHandler(async (req, res, next) => {
    const { orderId, status } = req.body;
    // console.log(req.body);

    const updatedOrder = await Merchandise.findByIdAndUpdate(orderId, { paymentVerified: status }, { new: true });

    if (!updatedOrder) {
        return next(new AppError('Order not found.', 404));
    }
    console.log(updatedOrder);
    res.status(200).json({
        success: true,
        message: 'Payment Status successfully updated.',
    });
});

export const getMyOrderList = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate('registeredOrders', 'nameOnCloth clothId quantity sizeOfCloth hostelName rollNumber phoneNumber paymentVerified paymentReferenceNumber')
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    res.status(200).json({
        success: true,
        data: user.registeredOrders,
    })
});

export const getAllOrderList = asyncHandler(async (req, res, next) => {
    const { clothId } = req.params;
    if (clothId) {
        const orderList = await Merchandise.find({ clothId });
        res.status(200).json({ success: true, orderList });
    } else {
        const orderList = await Merchandise.find({});
        res.status(200).json({ success: true, orderList });
    }
});
