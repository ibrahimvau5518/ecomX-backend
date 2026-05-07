import mongoose, { Document, Schema } from 'mongoose';

export interface IItem extends Document {
    title: string;
    description: string;
    image?: string;
    price: number;
    rating?: number;
    location?: string;
    category: string;
    createdBy: mongoose.Schema.Types.ObjectId;
}

const itemSchema = new Schema<IItem>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        rating: { type: Number, default: 0 },
        location: { type: String },
        category: { type: String, required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
    },
    { timestamps: true }
);

const Item = mongoose.model<IItem>('Item', itemSchema);
export default Item;