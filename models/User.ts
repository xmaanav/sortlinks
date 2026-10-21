import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    apiKey: string;
    isVerified: boolean;
    verificationOtp?: string;
    verificationOtpExpiry?: Date;
    resetOtp?: string;
    resetOtpExpiry?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        apiKey: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationOtp: {
            type: String,
        },
        verificationOtpExpiry: {
            type: Date,
        },
        resetOtp: {
            type: String,
        },
        resetOtpExpiry: {
            type: Date,
        },
    },
    { timestamps: true }
);

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
