import mongoose from 'mongoose';

const recruiterProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // A recruiter can only have one profile
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyDescription: {
      type: String,
      trim: true,
    },
    recruiterName: {
      type: String,
      required: [true, 'Recruiter name is required'],
      trim: true,
    },
    companyLocation: {
      type: String,
      trim: true,
    },
    verifiedStatus: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const RecruiterProfile = mongoose.model('RecruiterProfile', recruiterProfileSchema);
