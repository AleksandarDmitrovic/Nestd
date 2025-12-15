import mongoose, { Schema, Document } from "mongoose";

export interface ISnapTradeCredentials extends Document {
  snapTradeUserSecret: string; // Encrypted secret from SnapTrade
  isActive: boolean;
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SnapTradeCredentialsSchema: Schema = new Schema(
  {
    _id: {
      type: String, // UUID string Reference to User also the userId used in SnapTrade API
      ref: "User",
      required: true,
    },
    snapTradeUserSecret: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastSyncedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    _id: false, // Disable auto ObjectId generation
  }
);

export default mongoose.model<ISnapTradeCredentials>(
  "SnapTradeCredentials",
  SnapTradeCredentialsSchema
);
