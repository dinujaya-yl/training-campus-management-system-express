import {  Schema, model, Document  } from "mongoose";
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new Schema({

    name:{

        type     : String,
        required : true,

    },

    email:{

        type     : String,
        required : true,
        unique   : true,
        match    : [/.+\@.+\..+/, 'Please fill a valid email address']

    },

    password:{

        type     : String,
        required : [true , 'Please provide a password!'],
        

    },
    confirmPassword: {
        type: String,
        require: {
            validator: function (el:string) {
                return el === this.password;
            }
        },
        message: 'Passwords are not the same!'
    },

    role:{

        type     :String,
        default  :'student'
    }

},{timestamps:true});

userSchema.pre('save', async function (next) {

    this.password = await bcrypt.hash(this.password, 12);
})

export interface User extends Document {
    id         : string;
    email      : string;
    name       : string;
    password   : string | undefined;
    role       : string;
    createdAt  : Date;
}

export default model<User>('users', userSchema)