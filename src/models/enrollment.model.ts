import mongoose, { Document, Schema, model } from "mongoose";


const productSchema = new Schema({
    student:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users',
        required: true
    },

    course:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'courses',
        required: true
    },

    reservationId: {
        type: String,
        required : true,
        unique : true
    }

},{timestamps:true})

export interface Enrollment extends Document {
    id  : string;
    student : string;
    course  : string;
    reservationId : string;
    createdAt            : Date;
}

export default model<Enrollment>('enrollments', productSchema)