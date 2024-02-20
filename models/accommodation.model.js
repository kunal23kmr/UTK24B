import { Schema, model } from 'mongoose';

const accommodationSchema = new Schema({
    // teamName: {
    //     required: [true, 'Please enter team name'],
    //     type: String,
    // },
    accommodationType: {
        type: String,
        enum: ['1', '2', '3'],
        required: true
    },
    registrantId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    college:String,
    // fromDate: {
    //     type: Date,
    //     required: true,
    // },
    // toDate: {
    //     type: Date,
    //     required: true,
    // },
    numberOfDays: {
        type: Number,
        min: 1,
        required: [true, 'Please select number of day'],
    },
    numberOfPersons: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    persons: [
        {
            participantName: {
                type: String,
                required: true,
            },
            participantEmail: {
                type: String,
                required: true,
            },
            participantPhone: {
                type: String,
                required: true,
            },
        }
    ],
    paymentReferenceNumber: {
        type: String,
        required: true,
    },
    paymentVerified: {
        type: Boolean,
        default: false,
    },
    totalNumberOfDiet: {
        type: Number,
        default: 0
    }
});

const Accommodation = model('Accommodation', accommodationSchema);
export default Accommodation;
