import mongoose from 'mongoose';

const employeeProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // An employee can only have one profile
    },
    skills: {
      type: [String],
      default: [],
    },
    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],
    experience: [
      {
        jobTitle: String,
        company: String,
        duration: String,
        description: String,
      },
    ],
    preferredSalary: {
      type: Number,
    },
    preferredJobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Freelance'],
    },
    bio: {
      type: String,
      trim: true,
    },
    availabilityStatus: {
      type: String,
      enum: ['Available', 'Not Available', 'Actively Looking'],
      default: 'Available',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },
    aiTrustSummary: {
      type: Object,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create a 2dsphere index for geospatial queries (finding nearby employees)
employeeProfileSchema.index({ location: '2dsphere' });

export const EmployeeProfile = mongoose.model('EmployeeProfile', employeeProfileSchema);
