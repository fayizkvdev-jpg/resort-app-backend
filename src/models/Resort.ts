import mongoose, { Schema, Document } from 'mongoose';

export interface IResort extends Document {
    name: string;
    description: string;
    price: number;
    image: string;
    images: string[];
    pool: boolean;
    turf: boolean;
    facilities: Record<string, boolean>;
}

const ResortSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }, // Main image
    images: { type: [String], default: [] }, // Gallery images
    pool: { type: Boolean, default: false },
    turf: { type: Boolean, default: false },
    facilities: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export default mongoose.model<IResort>('Resort', ResortSchema);
