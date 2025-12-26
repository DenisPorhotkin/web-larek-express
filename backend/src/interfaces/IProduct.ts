import { Document } from 'mongoose';

export interface IImage {
    fileName: string;
    originalName: string;
}

export interface IProduct extends Document {
    title: string;
    image: IImage;
    category: string;
    description?: string;
    price?: number | null;
}
