import crypto from 'crypto';
import fs from 'fs/promises';

import cloudinary from 'cloudinary';

import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import AppError from '../utils/AppError.js';
import User from '../models/user.model.js';
import sendEmail from '../utils/sendEmail.js';
import Merchandise from '../models/merchandise.model.js';
import Accommodation from '../models/accommodation.model.js';

const cookieOptions = {
  secure: true,
  // secure: process.env.NODE_ENV === 'production' ? true : false,
  maxAge: 5 * 24 * 60 * 60 * 1000,
  httpOnly: true,
};


export const registerUser = asyncHandler(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return next(new AppError('All fields are required', 408));
  }
  const userExists = await User.findOne({ email });

  if (userExists) {

    if (userExists.signupverified) {
      return next(new AppError('Email already exists', 409));
    } else {
      userExists.fullName = fullName;
      userExists.email = email;
      userExists.password = password;
      userExists.signupTokenExpiry = undefined;
      userExists.signupToken = undefined;
      await userExists.save();

    }

  } else {
    const userExists = await User.create({
      fullName,
      email,
      password,

    });
    if (!userExists) {
      return next(
        new AppError('User registration failed, please try again later', 400)
      );
    }

  }


  const signupToken = await userExists.generateSignupToken();
  console.log("signupToken",signupToken);
  await userExists.save();

  const verificationUrl = `${process.env.FRONTEND_URL}/verify/${signupToken}`;

  const subject = 'Account Verification';
  const message = `You can now verify your account by clicking <a href=${verificationUrl} target="_blank">Verify your account</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${verificationUrl}.\n If you have not requested this, kindly ignore.`;

  try {
    await sendEmail(email, subject, message);

    // If email sent successfully send the success response
    res.status(200).json({
      success: true,
      message: `Verification Link has been sent to ${email} successfully`,
    });
  } catch (error) {
    // If some error happened we need to clear the forgotPassword* fields in our DB
    userExists.signupToken = undefined;
    userExists.signupTokenExpiry = undefined;

    await userExists.save();

    return next(
      new AppError(
        error.message || 'Something went wrong, please try again.',
        500
      )
    );
  }

  await userExists.save();

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    userExists,
  });
});


export const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Email and Password are required', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user.signupverified) {
      return next(
        new AppError('Account Not Verified Please Verify', 401)
      );
    }

    if (!(user && (await user.comparePassword(password)))) {
      return next(
        new AppError('Email or Password do not match or user does not exist', 401)
      );
    }

    const token = await user.generateJWTToken();

    user.password = undefined;
    // console.log(token);

    await res.cookie('token', token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      user,
    });
  } catch (err) {
    console.log(err);
    return next(new AppError('Error:' + err, 404));
  }

});


export const logoutUser = asyncHandler(async (_req, res, _next) => {
  // Setting the cookie value to null
  res.cookie('token', null, {
    secure: process.env.NODE_ENV === 'production' ? true : false,
    maxAge: 1,
    httpOnly: true,
  });

  // Sending the response
  return res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
});

/**
 * @LOGGED_IN_USER_DETAILS
 * @ROUTE @GET {{URL}}/api/v1/user/me
 * @ACCESS Private(Logged in users only)
 */
export const getLoggedInUserDetails = asyncHandler(async (req, res, _next) => {
  // Finding the user using the id from modified req object
  console.log(req.user);
  const user = await User.findById(req.user.id);
  // console.log("hi");
  res.status(200).json({
    success: true,
    message: 'User details',
    user,
  });
});

/**
 * @FORGOT_PASSWORD
 * @ROUTE @POST {{URL}}/api/v1/user/reset
 * @ACCESS Public
 */
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Email is required', 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('Email not registered', 400));
  }
  const resetToken = await user.generatePasswordResetToken();

  await user.save();

  // constructing a url to send the correct data
  /**HERE
   * req.protocol will send if http or https
   * req.get('host') will get the hostname
   * the rest is the route that we will create to verify if token is correct or not
   */
  // const resetPasswordUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/user/reset/${resetToken}`;
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // We here need to send an email to the user with the token
  const subject = 'Reset Password';
  const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;
  // console.log(resetPasswordUrl);
  // res.status(200).json({
  //       success: true,
  //       message: `Reset password token has been sent to ${email} successfully`,
  //     });
  try {
    await sendEmail(email, subject, message);

    // If email sent successfully send the success response
    res.status(200).json({
      success: true,
      message: `Reset password token has been sent to ${email} successfully`,
    });
  } catch (error) {
    // If some error happened we need to clear the forgotPassword* fields in our DB
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    return next(
      new AppError(
        error.message || 'Something went wrong, please try again.',
        500
      )
    );
  }


});

/**
 * @RESET_PASSWORD
 * @ROUTE @POST {{URL}}/api/v1/user/reset/:resetToken
 * @ACCESS Public
 */
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { resetToken } = req.params;

  const { password } = req.body;

  const forgotPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  if (!password) {
    return next(new AppError('Password is required', 400));
  }

  console.log(forgotPasswordToken);

  const user = await User.findOne({
    forgotPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new AppError('Token is invalid or expired, please try again', 400)
    );
  }

  user.password = password;

  user.forgotPasswordExpiry = undefined;
  user.forgotPasswordToken = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

export const verifyAccount = asyncHandler(async (req, res, next) => {
  const { verificationToken } = req.params;


  const signupToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');


  console.log(signupToken);

  const user = await User.findOne({
    signupToken,
    signupTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new AppError('Link is invalid or expired, please try again', 400)
    );
  }

  user.signupverified = true;

  user.signupToken = undefined;
  user.signupTokenExpiry = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'User Verified successfully',
  });
});


/**
 * @CHANGE_PASSWORD
 * @ROUTE @POST {{URL}}/api/v1/user/change-password
 * @ACCESS Private (Logged in users only)
 */
export const changePassword = asyncHandler(async (req, res, next) => {
  // Destructuring the necessary data from the req object
  const { oldPassword, newPassword } = req.body;
  const { id } = req.user; // because of the middleware isLoggedIn

  // Check if the values are there or not
  if (!oldPassword || !newPassword) {
    return next(
      new AppError('Old password and new password are required', 400)
    );
  }

  // Finding the user by ID and selecting the password
  const user = await User.findById(id).select('+password');

  // If no user then throw an error message
  if (!user) {
    return next(new AppError('Invalid user id or user does not exist', 400));
  }

  // Check if the old password is correct
  const isPasswordValid = await user.comparePassword(oldPassword);

  // If the old password is not valid then throw an error message
  if (!isPasswordValid) {
    return next(new AppError('Invalid old password', 400));
  }

  // Setting the new password
  user.password = newPassword;

  // Save the data in DB
  await user.save();

  // Setting the password undefined so that it won't get sent in the response
  user.password = undefined;

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

/**
 * @UPDATE_USER
 * @ROUTE @POST {{URL}}/api/v1/user/update/:id
 * @ACCESS Private (Logged in user only)
 */
export const updateUser = asyncHandler(async (req, res, next) => {
  // Destructuring the necessary data from the req object
  const { fullName } = req.body;
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError('Invalid user id or user does not exist'));
  }

  if (fullName) {
    user.fullName = fullName;
  }

  // Run only if user sends a file
  if (req.file) {
    // Deletes the old image uploaded by the user
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'lms', // Save files in a folder named lms
        width: 250,
        height: 250,
        gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
        crop: 'fill',
      });

      // If success
      if (result) {
        // Set the public_id and secure_url in DB
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // After successful upload remove the file from local storage
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(
        new AppError(error || 'File not uploaded, please try again', 400)
      );
    }
  }

  // Save the user object
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User details updated successfully',
  });
});

export const getUserInfo = asyncHandler(async (req, res, next) => {
  const { userIds } = req.body;

  const users = await User.find({ _id: { $in: userIds } });

  res.status(200).json({ success: true, userDetails: users });
});

export const myEvents = asyncHandler(async (req, res, next) => {
  const _id = req.user._id;

  const user = await User.findById(_id).populate('registeredEvents', 'title description club participants')

  res.status(200).json({ success: true, data: user.registeredEvents });
})

export const myOrders = asyncHandler(async (req, res, next) => {
  const _id = req.user._id;

  const user = await Merchandise.findById(_id).populate('registeredOrders', 'nameOnCloth applicantName clothId quantity sizeOfCloth hostelName paymentReferenceNumber paymentVerified')

  res.status(200).json({ success: true, data: user.registeredOrders });
})
export const myBookings = asyncHandler(async (req, res, next) => {
  const _id = req.user._id;

  const user = await Accommodation.findById(_id).populate('registeredAccommodations', 'teamName accommodationType registrantId fromDate toDate numberOfPersons paymentReferenceNumber paymentVerified')

  res.status(200).json({ success: true, data: user.registeredAccommodations });
})
