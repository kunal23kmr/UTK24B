import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';
import sendEmail from '../utils/sendEmail.js';
import Contact from '../models/contactUs.model.js';


export const contactUs = asyncHandler(async (req, res, next) => {
  const { name, email, message, subject } = req.body;
  console.log(name, email, message, subject);
  if (!name || !email || !message) {
    return next(new AppError('Name, Email, Message are required'));
  }


  try {
    const textMessage = `<h2>${name} - ${email}</h2> <br /> <p style="font-size:1.2rem">${message}</p>`;

    const contact = await Contact.create({ name, email, message, subject });
    if (!contact) {
      return next(new AppError('Server error', 505));
    }
    await sendEmail(process.env.CONTACT_US_EMAIL, 'Contact Us Form - Utkansh-24\n' + subject, textMessage);
  } catch (error) {
    console.log(error);
    return next(new AppError(error.message, 400));
  }

  res.status(200).json({
    success: true,
    message: 'Your request has been submitted successfully',
  });
});

export const getContactUs = asyncHandler(async (req, res, next) => {
  const contact = await Contact.find({ answered: req.body.answerStatus });
  res.status(200).json({ success: true, data: contact });
});

export const replyQuery = asyncHandler(async (req, res, next) => {
  // console.log(req.body);
  const { queryId, replyMessage } = req.body;

  const query = await Contact.findOne({ _id: queryId });

  if (!query) {
    console.log('No query found');
    return res.status(404).json({ success: false, message: 'Query not found' });
  }

  if (replyMessage) {
    query.replyMessage = `${replyMessage}`;

    const truncatedMessage = query.replyMessage.slice(0, Math.min(30, query.replyMessage.length));

    await sendEmail(process.env.CONTACT_US_EMAIL, query.email,
      `Answer to your query: ${truncatedMessage}...`);
  }

  query.answered = true;
  await query.save();

  res.status(200).json({ success: true, message: 'Reply Sent' });
});

export const rejectionMail = asyncHandler(async (req, res, next) => {
  const { email,subject ,message } = req.body;
  await sendEmail(email, subject, message);
  res.status(200).json({
    success: true,
    message: 'Mail sent',
  });
})

export const userStats = asyncHandler(async (req, res, next) => {
  const allUsersCount = await User.countDocuments();

  const subscribedUsersCount = await User.countDocuments({
    'subscription.status': 'active',
  });

  res.status(200).json({
    success: true,
    message: 'All registered users count',
    allUsersCount,
    subscribedUsersCount,
  });
});
