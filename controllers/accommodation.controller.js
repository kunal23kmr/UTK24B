import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import AppError from '../utils/AppError.js';
import User from '../models/user.model.js';
import Accommodation from '../models/accommodation.model.js';


export const registerAccommodation = asyncHandler(async (req, res, next) => {
    // console.log(req.body);
    const {
        // teamName,
        // registrantId,
        // fromDate,
        // toDate,
        persons,
        numberOfDays,
        numberOfPersons,
        paymentReferenceNumber,
        totalNumberOfDiet,
        accommodationType
    } = req.body;
    console.log(req.user.id);
    const registrantId = req.user.id;
    const user = await User.findById(registrantId);
    if (!user) {
        return next(new AppError('User not exist', 404));
    }
    const accommodation = await Accommodation.create({
        // teamName,
        registrantId,
        // fromDate,
        // toDate,
        numberOfDays,
        numberOfPersons,
        persons,
        paymentReferenceNumber,
        totalNumberOfDiet,
        accommodationType
    })
    if (!accommodation) {
        return next(new AppError('Error in registering', 501));
    }
    user.registeredAccommodations.push(accommodation.id);
    await user.save();
    res.status(200).json({ success: true, message: 'You are done.' });
});



export const getMyBookingList = asyncHandler(async (req, res, next) => {
    const id = req.user.id;
    const user = await User.findById(id)
        .populate('registeredAccommodations',
            'accommodationType numberOfPersons numberOfDays paymentVerified paymentReferenceNumber totalNumberOfDiet');

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        success: true,
        data: user.registeredAccommodations
    });
});


export const getUnverifiedAccommodationList = asyncHandler(async (req, res, next) => {
    const { type } = req.params;

    if (type) {
        const data = await Accommodation.find({ accommodationType: type, paymentVerified: false }).populate('registrantId', 'email');
        return res.status(200).json({
            success: true,
            data
        })
    }
    const data = await Accommodation.find({ paymentVerified: false }).populate('registrantId', 'email');
    return res.status(200).json({
        success: true,
        data
    })
});


export const getVerifiedAccommodationList = asyncHandler(async (req, res, next) => {
    const { type } = req.params;

    if (type) {
        const data = await Accommodation.find({ accommodationType: type, paymentVerified: true }).populate('registrantId', 'email');
        return res.status(200).json({
            success: true,
            data
        })
    }
    const data = await Accommodation.find({ paymentVerified: true }).populate('registrantId', 'email');
    return res.status(200).json({
        success: true,
        data
    })

});

export const deleteRequest = asyncHandler(async (req, res, next) => {
    try {
        const { accommodationId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new AppError('User not found', 404));
        }
        const index = user.registeredAccommodations.indexOf(accommodationId);
        if (index !== -1) {
            user.registeredAccommodations.splice(index, 1);
        } else {
            return next(new AppError('Already removed.', 404));
        }
        await Accommodation.findByIdAndDelete(accommodationId);
        user.save();
        res.status(200).json({
            success: true,
            message: 'Deleted successfully',
        })
    } catch (err) {
        console.log(err);
        return next(new AppError('Server error', 501));
    }
    
})


export const changeAccommodationVerificationStatus = asyncHandler(async (req, res, next) => {
    const { accommodationId, status } = req.body;
    const updatedAccommodation = await Accommodation.findByIdAndUpdate(accommodationId, { paymentVerified: status }, { new: true });

    if (!updatedAccommodation) {
        return next(new AppError('Item not found.', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Accommodation Status successfully updated.',
    });
});

export const getAllRoomList = asyncHandler(async (req, res, next) => {
    const rooms = await Accommodation.find({}).populate('registrantId', 'email');
    return res.status(200).json({ success: true, data: rooms });
})


// //get list of your bookings;
// export const getMyBookingList = asyncHandler(async (req, res, next) => {
//     // console.log(req.user.id)
//     const user = await User.findById(req.user.id).populate('registeredOrders', 'nameOnCloth clothId quantity sizeOfCloth hostelName rollNumber phoneNumber paymentVerified paymentReferenceNumber')
//     if (!user) {
//         return next(new AppError('User not found', 404));
//     }
//     res.status(200).json({
//         success: true,
//         data: user.registeredOrders,
//     })
// });

