import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
    userId: mongoose.Types.ObjectId;
    activityType:
    | "quiz"
    | "pronunciation"
    | "writing"
    | "learning"
    | "object_detection"
    | "profile"
    | "login"
    | "logout"
    | "register"
    | "edit_profile"
    | "delete_account"
    | "reset_password";
    title: string;
    detail?: string;
    score?: number;
}

const activityLogSchema = new Schema<IActivityLog>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        activityType: {
            type: String,
            enum: [
                "quiz",
                "pronunciation",
                "kana_writing",
                "learning",
                "object_detection",
                "profile",
                "login",
                "logout",
                "register",
                "edit_profile",
                "delete_account",
                "reset_password",
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        detail: {
            type: String,
            default: "",
        },

        score: {
            type: Number,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IActivityLog>(
    "ActivityLog",
    activityLogSchema
);