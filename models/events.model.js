import { model, Schema } from 'mongoose';

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [3, 'Title must be atleast 8 characters'],
      maxlength: [50, 'Title cannot be more than 50 characters'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [, 'Description must be atleast 20 characters long'],
    },
    club: {
      type: String,
    },
    venue: {
      type: String,
    },
    time: {
      type: String,
    },
    date: {
      type: String,
    },
    day: {
      type: String,
    },
    minparticipant: {
      type: Number,
      default: 1

    },
    maxparticipant: {
      type: Number,

    },





    participant: [
      {
        enrolledby: {
          type: String,
          default: "65ae708da82f774c8765"

        },
        teamName: {
          type: String,
          default: "participantstcaabhi"

        },
        collegeName: {
          type: String,
          default: "participantstcaabhi"

        },
        amount: {
          type: Number,
          default: 0,
          
        },
        participants: [{
          participantPhone: {
            type: String,
          },
          participantEmail: {
            type: String,
          },
          participantName: {
            type: String,
          }

        }
        ],
        isverified: {
          type: Boolean,

          default: false,

        },
        paymentReferenceNumber: {
          type: String,
          required: [true, "Please Enter Payment Reference No.."]

        }


      },
    ],

    tcacoordinator: [
      {
        userid: {
          type: String,
          default: "tcaabhi"
        },
      }
    ],


    clubcoordinator: [
      {
        userid: {
          type: String,
          default: "Dummy User"

        },
        emailid: {
          type: String,
          default: "dummy@gmail.com"

        },
        phoneno: {
          type: String,
          default: "1234567890"

        },
      }
    ],


    facultycoordinator: [
      {
        userid: {
          type: String,
          default: "abhi"
        },
        name: String,
        department: String,

      },
    ],

    numberOfParticipants: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      required: [true, 'Course instructor name is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Event = model('event', courseSchema);

export default Event;