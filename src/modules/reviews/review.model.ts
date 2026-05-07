import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
    rating: number;
    comment: string;
    userId: mongoose.Schema.Types.ObjectId;
    itemId: mongoose.Schema.Types.ObjectId;
}

const reviewSchema = new Schema<IReview>(
    {
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true }
    },
    { timestamps: true }
);

const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;