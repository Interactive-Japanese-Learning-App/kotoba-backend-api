import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IUser
  extends Document {

  email: string;
  password: string;

  role: "user";

  isVerified: boolean;

  otpCode?: string | null;

  otpExpiredAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;

}

const UserSchema =
  new Schema<IUser>(
    {
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      password: {
        type: String,
        required: true,
        minlength: 6,
      },

      role: {
        type: String,
        default: "user",
        enum: ["user"],
      },
      isVerified: {
        type: Boolean,
        default: false,
      },

      otpCode: {
        type: String,
        default: null,
      },

      otpExpiredAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.models.User ||
  mongoose.model<IUser>(
    "User",
    UserSchema
  );