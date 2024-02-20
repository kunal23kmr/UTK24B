import { Schema, model } from 'mongoose';

const merchandiseSchema = new Schema({
    nameOnCloth: {
        type: String,
        required: [true, 'Please enter the name you want printed on your T-shirt.'],
        maxlength: [20, 'Name should be smaller than 20 characters'],
        trim: true,
    },
    applicantName: {
        type: String,
        required: true,
        trim: true,
    },
    registrantId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    clothId: {
        type: String,
        required: true,
        enum: ['1', '2', '3'],
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    sizeOfCloth: {
        type: String,
        enum: ['S', 'M', 'L', 'XL', 'XXL'],
        required: true,
    },
    hostelName: {
        type: String,
        // enum: ['A','MBH-A', 'MBH-B', 'MBH-F', 'BH-6', 'NEW MGH'],
        required: true,
    },
    paymentReferenceNumber: {
        type: String,
        required: true,
    },
    email:String,
    rollNumber: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    wtpNumber: {
        type: String,
    },
    paymentVerified: {
        type: Boolean,
        default: false,
    }
});

const Merchandise = model('Merchandise', merchandiseSchema);
export default Merchandise;
