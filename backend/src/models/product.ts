import mongoose, { Schema } from 'mongoose';

export interface IProduct extends mongoose.Document {
  title: string;
  image: {
    fileName: string;
    originalName: string;
  };
  category: string;
  description?: string;
  price?: number | null;
}

const ImageSchema = new Schema({
  fileName: {
    type: String,
    required: [true, 'Имя файла обязательно'],
  },
  originalName: {
    type: String,
    required: [true, 'Оригинальное имя файла обязательно'],
  },
}, { _id: false });

const ProductSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Название товара обязательно'],
    unique: true,
    minlength: [2, 'Название должно содержать минимум 2 символа'],
    maxlength: [30, 'Название не должно превышать 30 символов'],
    trim: true,
  },
  image: {
    type: ImageSchema,
    required: [true, 'Изображение обязательно'],
  },
  category: {
    type: String,
    required: [true, 'Категория обязательна'],
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    default: null,
    min: [0, 'Цена не может быть отрицательной'],
    validate: {
      validator: function validatePrice(value: number | null) {
        return value === null || (typeof value === 'number' && value >= 0);
      },
      message: 'Цена должна быть null или положительным числом',
    },
  },
}, {
  versionKey: false,
  collection: 'product',
  timestamps: true,
});

export default mongoose.model<IProduct>('product', ProductSchema);
