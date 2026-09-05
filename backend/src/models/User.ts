import mongoose, { Schema } from "mongoose";


export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role:"admin" | "user";
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, "Name must be at least 3 characters long"],
        maxlength: [50, "Name must be at most 50 characters long"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        
        select: false,
    }
    ,
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
        required: true,
    },

    
    
    
}, { timestamps: true });

export default mongoose.model<IUser>("User", userSchema);

