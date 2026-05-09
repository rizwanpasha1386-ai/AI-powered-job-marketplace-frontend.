import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    workSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkSession',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model('Message', messageSchema);
