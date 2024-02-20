import { model, Schema } from 'mongoose';

const ContactSchema = new Schema(
    {
        name: {
            required: [true, 'Name field is required.'],
            type: String,
        },
        email: {
            required: [true, 'Email field is required.'],
            type: String,
        },
        subject: String,
        message: {
            required: [true, 'Message field is required.'],
            type: String,
        },
        answered: {
            type: Boolean,
            // required: true,
            default: false,
        },
        replyMessage: {
            type: String,
            // required: true,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const Contact = model('Contact', ContactSchema);

export default Contact;


