import fs from 'fs/promises';
import path from 'path';
import cloudinary from 'cloudinary';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import Course from '../models/events.model.js';
import AppError from '../utils/AppError.js';


export const getAllEvents = asyncHandler(async (req, res, next) => {
  const userid = req.user;
  if (userid.role == 'USER') {
    try {
      const events = await Course.find({
        'participants': {
          $elemMatch: { enrolledby: userid.id }
        }
      });

      res.status(200).json({
        success: true,
        message: 'All Events',
        events,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
  
  if (userid.role == 'ADMIN') {
    try {
      const events = await Course.find({});

      res.status(200).json({
        success: true,
        message: 'All Events',
        events,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }

});


export const createEvent = asyncHandler(async (req, res, next) => {
  const { title, description, club, createdBy,venue,time,date,minparticipant,maxparticipant,day } = req.body;
  console.log("req-body data",req.body);

  if (!title || !description || !club || !createdBy||!venue||!time||!date||!minparticipant||!maxparticipant||!day) {
    return next(new AppError('All fields are required', 400));
  }

  const event = await Course.create({
    title,
    description,
    club,
    createdBy,venue,time,date,minparticipant,maxparticipant,day
  });

  if (!event) {
    return next(
      new AppError('Event could not be created, please try again', 400)
    );
  }


  await event.save();

  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    event,
  });
});


export const getParticipantsByEventId = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { verified } = req.query;
  const userid = req.user;
  console.log("userid");
  console.log(userid);

  try {
    const event = await Course.findById(id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    let participating;

    if (verified === 'true') {
      participating = event.participant.filter(participan=> participan.isverified === true);
    } else if (verified === 'false') {
      participating = event.participant.filter(participan => participan.isverified === false);
    } else {
      participating = event.participant;
    }
    console.log(participating);
    res.status(200).json({
      success: true,
      message: 'Events participants fetched successfully',
      participants: participating,
    });
  } catch (error) {
    next(new AppError('Internal Server Error', 500));
  }
});

export const gettcacordinatorByEventId = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const event = await Course.findById(id);

  if (!event) {
    return next(new AppError('Invalid Event id or Event not found.', 408));
  }

  res.status(200).json({
    success: true,
    message: 'Event participants fetched successfully',
    tcacoordinator: event.tcacoordinator,
  });
});

// export const addParticipantToEventById = asyncHandler(async (req, res, next) => {
//   const { title, description } = req.body;
//   const { id } = req.params;

//   let lectureData = {};

//   if (!title || !description) {
//     return next(new AppError('Title and Description are required', 400));
//   }

//   const event = await Course.findById(id);

//   if (!event) {
//     return next(new AppError('Invalid Course id or Course not found.', 400));
//   }

//   console.log(event);

//   event.participant.push({
//     title,
//     description,

//   });

//   event.numberOfParticipants = event.participant.length;


//   await event.save();

//   res.status(200).json({
//     success: true,
//     message: 'Course lecture added successfully',
//     event,
//   });
// });

export const addParticipantToEventById = asyncHandler(async (req, res, next) => {
  const { college, teamName, participants} = req.body;
  const userid = req.user;
  const enrolledby=userid.id;
  console.log(" const userid = req.user;",userid);
  const { id } = req.params;
  console.log("req.body",req.body);
  console.log("college",college);console.log("teamName",teamName);console.log("participants",participants);
  let lectureData = {};

  if (!college || !teamName ||!participants) {
    return next(new AppError('college,teamName and participants are required', 400));
  }

  const event = await Course.findById(id);

  if (!event) {
    return next(new AppError('Invalid event id or event not found.', 400));
  }

  console.log(event);

  event.participant.push({
    enrolledby,
    college,
    teamName,
    participants
  });

  event.numberOfParticipants = event.participant.length;


  await event.save();

  res.status(200).json({
    success: true,
    message: 'Participant added successfully',
    event,
  });
});

export const addtcacoordinatorById = asyncHandler(async (req, res, next) => {
  const { userid } = req.body;
  console.log("yes");


  const { id } = req.params;

  let tcacoordinator = {};

  if (!userid) {
    return next(new AppError('userid is required', 400));
  }

  const event = await Course.findById(id);

  if (!event) {
    return next(new AppError('Invalid Event id or Event not found.', 400));
  }



  event.tcacoordinator.push({
    userid,
  });



  await event.save();

  res.status(200).json({
    success: true,
    message: 'Event Participant added successfully',
    event,
  });
});


export const addclubcoordinatorById = asyncHandler(async (req, res, next) => {
  const { userid } = req.body;


  const { id } = req.params;

  let clubcoordinator = {};

  if (!userid) {
    return next(new AppError('userid is required', 400));
  }

  const event = await Course.findById(id);

  if (!event) {
    return next(new AppError('Invalid Event id or Event not found.', 400));
  }


  event.clubcoordinator.push({
    userid,
  });

  await event.save();

  res.status(200).json({
    success: true,
    message: 'Club coordinator added Sucessfully',
    event,
  });
});

export const addtcacordinatorToEventById = asyncHandler(async (req, res, next) => {
  const { userid } = req.body;


  const { id } = req.params;

  let tcacoordinator = {};

  if (!userid) {
    return next(new AppError('userid is required', 400));
  }

  const event = await Course.findById(id);

  if (!event) {
    return next(new AppError('Invalid Event id or Event not found.', 400));
  }


  event.tcacoordinator.push({
    userid,
  });

  await event.save();

  res.status(200).json({
    success: true,
    message: 'Tca  cordinator added sucessfully',
    event,
  });
});

export const addfacultycoordinatorById = asyncHandler(async (req, res, next) => {
  const { userid, name, department } = req.body;



  const { id } = req.params;

  let facultycoordinator = {};

  if (!userid) {
    return next(new AppError('userid is required', 400));
  }

  const event = await Course.findById(id);

  if (!event) {
    return next(new AppError('Invalid Event id or Event not found.', 400));
  }


  event.facultycoordinator.push({
    userid,
  });



  await event.save();

  res.status(200).json({
    success: true,
    message: 'Event Participant added successfully',
    event,
  });
});



export const removeParticipantsFromEvent = asyncHandler(async (req, res, next) => {

  const { courseId, lectureId } = req.query;

  console.log(courseId);

  if (!courseId) {
    return next(new AppError('Event ID is required', 400));
  }

  if (!lectureId) {
    return next(new AppError('Participant ID is required', 400));
  }

  const event = await Course.findById(courseId);

  if (!event) {
    return next(new AppError('Event ID or Event does not exist.', 404));
  }

  const lectureIndex = event.participant.findIndex(
    (lecture) => lecture._id.toString() === lectureId.toString()
  );

  const clubcoordinatorj = event.clubcoordinator.findIndex(
    (lecture) => lecture._id.toString() === lectureId.toString()
  );

  const tcacoordinatorj = event.tcacoordinator.findIndex(
    (lecture) => lecture._id.toString() === lectureId.toString()
  );

  if (lectureIndex !== -1) {



    
    event.participant.splice(lectureIndex, 1);

    
    event.numberOfLectures = event.participant.length;

    
    await event.save();

    
    res.status(200).json({
      success: true,
      message: 'Participant removed successfully',
    });
  }

  if (clubcoordinatorj !== -1) {





    event.clubcoordinator.splice(clubcoordinatorj, 1);


    // Save the Course object
    await event.save();

    // Return response
    res.status(200).json({
      success: true,
      message: 'Clubcoordinator removed successfully',
    });
  }
  if (tcacoordinatorj !== -1) {

    event.tcacoordinator.splice(tcacoordinatorj, 1);
    await event.save();
    res.status(200).json({
      success: true,
      message: 'Tcacoordinator removed successfully',
    });
  }


});

export const updateParticipantVerification = asyncHandler(async (req, res, next) => {
  const { courseId, lectureId } = req.query;

  if (!courseId) {
    return next(new AppError('Event Id is required', 400));
  }

  if (!lectureId) {
    return next(new AppError('Participant Id is required', 400));
  }

  const event = await Course.findById(courseId);

  if (!event) {
    return next(new AppError('Invalid Event Id or Event does not exist.', 404));
  }

  // Find the participant by lectureId
  const participant = event.participant.find(participan => participan._id.toString() === lectureId.toString());

  if (!participant) {
    return next(new AppError('Participant not found.', 404));
  }

  // Update isverified field to true
  participant.isverified = true;

  // Save the changes to the Course object
  await event.save();

  res.status(200).json({
    success: true,
    message: 'Participant verified Sucessfully',
  });
});

export const removeEvent = asyncHandler(async (req, res, next) => {

  const { id } = req.params;
  // const { id } = req.params;


  if (!id) {
    return next(new AppError('Event ID is required', 400));
  }

  const event = await Course.findById(id);

  if (!event) {
    return next(new AppError('Invalid Event ID or Event does not exist.', 404));
  }


  const result = await event.findOneAndDelete(id);


  await event.save();

  res.status(200).json({
    success: true,
    message: 'Event removed successfully',
  });


});


/**
 * @UPDATE_Course_BY_ID
 * @ROUTE @PUT {{URL}}/api/v1/Courses/:id
 * @ACCESS Private (Admin only)
 */
export const updateEventById = asyncHandler(async (req, res, next) => {
  // Extracting the Course id from the request params
  const { id } = req.params;

  // Finding the Course using the Course id
  const event = await Course.findByIdAndUpdate(
    id,
    {
      $set: req.body, // This will only update the fields which are present
    },
    {
      runValidators: true, // This will run the validation checks on the new data
    }
  );

  // If no Course found then send the response for the same
  if (!event) {
    return next(new AppError('Invalid Event id or Event not found.', 400));
  }

  // Sending the response after success
  res.status(200).json({
    success: true,
    message: 'Event updated successfully',
  });
});

/**
 * @DELETE_Course_BY_ID
 * @ROUTE @DELETE {{URL}}/api/v1/Courses/:id
 * @ACCESS Private (Admin only)
 */
export const deleteEventById = asyncHandler(async (req, res, next) => {

  const { id } = req.params;


  const event = await Course.findById(id);


  if (!event) {
    return next(new AppError('Event with given id does not exist.', 404));
  }


  await event.remove();

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully',
  });
});
