import { model, Schema } from 'mongoose';

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [8, 'Title must be atleast 8 characters'],
      maxlength: [50, 'Title cannot be more than 50 characters'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be atleast 20 characters long'],
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
    minparticipant: {
      type: Number,
      
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
        participants: [{
          participantPhone: {
            type: String,
          },
          participantEmail:{
            type: String,
          },
          participantName:{
            type: String,
          }

        }
        ],
        isverified: {
          type: Boolean,

          default: false,

        },


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
          default: "clubabhi"

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
      default: 5,
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