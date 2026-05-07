import mongoose, { Document, Schema } from 'mongoose';

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED'
}

export interface IBooking extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    itemId: mongoose.Schema.Types.ObjectId;
    quantity: number;
    price: number;
    status: BookingStatus;
}

const bookingSchema = new Schema<IBooking>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true },
        status: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.PENDING }
    },
    { timestamps: true }
);

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;