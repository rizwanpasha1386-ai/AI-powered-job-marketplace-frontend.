import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkSession',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate ratings: a user can only rate another user once per work session
ratingSchema.index({ fromUser: 1, toUser: 1, workSession: 1 }, { unique: true });

// Utility to calculate average ratings natively in the database
ratingSchema.statics.getAverageRating = async function (userId) {
  const obj = await this.aggregate([
    { $match: { toUser: new mongoose.Types.ObjectId(userId) } },
    { 
      $group: { 
        _id: '$toUser', 
        averageRating: { $avg: '$rating' }, 
        numReviews: { $sum: 1 } 
      } 
    },
  ]);
  
  if (obj.length > 0) {
    return {
      averageRating: Math.round(obj[0].averageRating * 10) / 10, // Round to 1 decimal
      numReviews: obj[0].numReviews
    };
  }
  
  return { averageRating: 0, numReviews: 0 };
};

export const Rating = mongoose.model('Rating', ratingSchema);
