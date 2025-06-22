// src/controllers/productController.ts
import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Product';
import asyncHandler from 'express-async-handler';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const products: IProduct[] = await Product.find({});
  res.json(products);
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product: IProduct | null = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, price, category, stock, imageUrl, team, country } = req.body;

  if (!name || !description || !price || !category || stock === undefined || stock < 0 || price < 0) {
    res.status(400);
    throw new Error('Please provide all required product details: name, description, price, category, and stock (must be non-negative).');
  }

  const productExists = await Product.findOne({ name });
  if (productExists) {
    res.status(409); // Conflict
    throw new Error('Product with this name already exists');
  }

  const product: IProduct = new Product({
    name,
    description,
    price,
    category,
    stock,
    imageUrl,
    team,
    country,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, price, category, stock, imageUrl, team, country } = req.body;

  const product: IProduct | null = await Product.findById(req.params.id);

  if (product) {
    // Check if new name conflicts with an existing product (excluding itself)
    if (name && name !== product.name) {
      const productWithNewNameExists = await Product.findOne({ name });
      // The fix for _id comparison: ensure _id exists before toString()
      if (productWithNewNameExists && productWithNewNameExists._id?.toString() !== product._id?.toString()) {
        res.status(409);
        throw new Error('Another product with this name already exists.');
      }
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    product.imageUrl = imageUrl ?? product.imageUrl;
    product.team = team ?? product.team;
    product.country = country ?? product.country;

    if (product.stock < 0 || product.price < 0) {
      res.status(400);
      throw new Error('Stock and Price cannot be negative.');
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product: IProduct | null = await Product.findByIdAndDelete(req.params.id);
  if (product) {
    res.json({ message: 'Product removed successfully' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});