// src/models/Product.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  team?: string;
  country?: string;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0, min: 0 },
  imageUrl: { type: String },
  team: { type: String },
  country: { type: String },
}, {
  timestamps: true,
});

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;