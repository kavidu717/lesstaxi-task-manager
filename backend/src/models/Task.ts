import mongoose, { Document , Schema} from "mongoose";


export type TaskStatus = "To Do" | "Doing" | "Done";

export interface ITask extends Document {
    title: string;
    description: string;
    status: TaskStatus;
    creater: mongoose.Types.ObjectId;
    assignedUser: mongoose.Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, "Title must be at least 3 characters long"],
        maxlength: [50, "Title must be at most 50 characters long"],
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: [500, "Description must be at most 500 characters long"],
    },
    status: {
        type: String,
        enum: ["To Do", "Doing", "Done"],
        default: "To Do",
        index: true,
    },
    creater: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    assignedUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
        index: true,
    }

},{timestamps:true})

export default mongoose.model<ITask>("Task", taskSchema);