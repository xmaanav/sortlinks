import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUrl extends Document {
    originalUrl: string;
    shortCode: string;
    alias?: string;
    clicks: number;
    userId?: mongoose.Types.ObjectId;
    createdAt: Date;
}

const UrlSchema: Schema = new Schema(
    {
        originalUrl: {
            type: String,
            required: true,
        },
        shortCode: {
            type: String,
            required: true,
            unique: true,
        },
        alias: {
            type: String,
            unique: true,
            sparse: true,
        },
        clicks: {
            type: Number,
            default: 0,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
            default: null,
        },
    },
    { timestamps: true }
);

const Url: Model<IUrl> =
    mongoose.models.Url || mongoose.model<IUrl>("Url", UrlSchema);

export default Url;
