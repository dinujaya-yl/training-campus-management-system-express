import mongoose, {  Schema, model, Document  } from "mongoose";

interface IPendingReservation {
    reservationId: string,
    studentId: string,
    createdAt: Date
}

const courseSchema = new Schema({

    name:{

        type     : String,
        required : true,
        unique   : true

    },

    lecturer:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'users',
            required: true
    },
    max_students:{

        type     :Number,
        default  :'student'
    },

    enrolledCount: {
        type : Number,
        default: 0
    },

    pendingReservations: [
        {
            reservationId: String,
            studentId: String,
            createdAt: { type: Date, default: Date.now}
        }
    ]

},{timestamps:true})

export interface Course extends Document {
    id         : string;
    name      : string;
    lecturer : string;
    max_students   : number;
    enrolledCount : number;
    createdAt  : Date;
    pendingReservations: IPendingReservation[];
}

export default model<Course>('courses', courseSchema)