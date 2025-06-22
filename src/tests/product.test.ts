// src/tests/product.test.ts
import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product, { IProduct } from '../models/Product';

dotenv.config();

const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI;

beforeAll(async () => {
  if (!MONGODB_TEST_URI) {
    throw new Error('MONGODB_TEST_URI is not defined in .env file.');
  }
  await mongoose.connect(MONGODB_TEST_URI);
  console.log('Connected to Test MongoDB');
});

beforeEach(async () => {
  await Product.deleteMany({});
  const dummyProducts: IProduct[] = [
    {
      name: "Dummy Club Home Jersey",
      description: "High quality dummy jersey for testing.",
      price: 500000,
      category: "Club European",
      stock: 50,
      team: "Dummy FC",
      country: "Dummy Land"
    } as IProduct,
    {
      name: "Dummy National Away Jersey",
      description: "Another dummy jersey for testing purposes.",
      price: 450000,
      category: "National Team",
      stock: 30,
      team: "Dummy Nation",
      country: "Dummy Country"
    } as IProduct,
  ];
  await Product.insertMany(dummyProducts);
});

afterAll(async () => {
  await mongoose.connection.close();
  console.log('Test MongoDB connection closed');
});

describe('Product API', () => {
  it('should get all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(res.body[0]).toHaveProperty('name');
  });

  it('should get a product by ID', async () => {
    const product = await Product.findOne({ name: "Dummy Club Home Jersey" });
    // Memastikan product tidak null sebelum menggunakan _id-nya
    if (!product) throw new Error('Dummy product not found for test: should get a product by ID');
    const res = await request(app).get(`/api/products/${product._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Dummy Club Home Jersey');
  });

  it('should return 404 if product not found', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toHexString();
    const res = await request(app).get(`/api/products/${nonExistentId}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Product not found');
  });

  // PERBAIKAN DI SINI: SESUAIKAN PESAN DAN STATUS CODE
  it('should return 400 for invalid ID format (GET)', async () => {
    const invalidId = 'invalid-id-format';
    const res = await request(app).get(`/api/products/${invalidId}`);
    expect(res.statusCode).toEqual(400); // Sekarang seharusnya 400 karena error handler sudah disempurnakan
    expect(res.body).toHaveProperty('message', `Invalid _id format: ${invalidId}`); // Sesuaikan pesan
  });

  it('should create a new product', async () => {
    const newProduct = {
      name: "New Test Jersey",
      description: "A brand new jersey for testing create.",
      price: 600000,
      category: "Training Gear",
      stock: 10,
      team: "Test Team",
      country: "Test Land"
    };
    const res = await request(app).post('/api/products').send(newProduct);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name', newProduct.name);
    const productInDb = await Product.findById(res.body._id);
    expect(productInDb).not.toBeNull();
  });

  it('should return 409 if product name already exists on creation', async () => {
    const existingProduct = {
      name: "Dummy Club Home Jersey",
      description: "Duplicate product test.",
      price: 100000,
      category: "Club",
      stock: 1
    };
    const res = await request(app).post('/api/products').send(existingProduct);
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('message', 'Product with this name already exists');
  });

  it('should update an existing product', async () => {
    const product = await Product.findOne({ name: "Dummy Club Home Jersey" });
    // Memastikan product tidak null sebelum menggunakan _id-nya
    if (!product) throw new Error('Dummy product not found for test: should update an existing product');
    const updatedData = { price: 550000, stock: 45 };
    const res = await request(app).put(`/api/products/${product._id}`).send(updatedData);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('price', updatedData.price);
    expect(res.body).toHaveProperty('stock', updatedData.stock);
  });

  it('should return 409 if updating product name to an existing name', async () => {
    const product1 = await Product.findOne({ name: "Dummy Club Home Jersey" });
    const product2 = await Product.findOne({ name: "Dummy National Away Jersey" });
    if (!product1 || !product2) throw new Error('Could not find both dummy products for test: updating product name to an existing name');
    
    const updatedData = { name: product2.name };
    const res = await request(app).put(`/api/products/${product1._id}`).send(updatedData);
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('message', 'Another product with this name already exists.');
  });

  it('should delete a product', async () => {
    const product = await Product.findOne({ name: "Dummy Club Home Jersey" });
    // Memastikan product tidak null sebelum menggunakan _id-nya
    if (!product) throw new Error('Dummy product not found for test: should delete a product');
    const res = await request(app).delete(`/api/products/${product._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Product removed successfully');
    const deletedProduct = await Product.findById(product._id);
    expect(deletedProduct).toBeNull();
  });

  // Tambahan test case: menguji update dengan ID yang tidak valid
  // PERBAIKAN DI SINI: SESUAIKAN PESAN DAN STATUS CODE
  it('should return 400 for invalid ID on update', async () => {
    const invalidId = 'invalid-id';
    const updatedData = { name: 'Test' };
    const res = await request(app).put(`/api/products/${invalidId}`).send(updatedData);
    expect(res.statusCode).toEqual(400); // Sekarang seharusnya 400 karena error handler sudah menangani CastError
    expect(res.body).toHaveProperty('message', `Invalid _id format: ${invalidId}`); // Sesuaikan pesan
  });

  // Tambahan test case: menguji delete dengan ID yang tidak valid
  // PERBAIKAN DI SINI: SESUAIKAN PESAN DAN STATUS CODE
  it('should return 400 for invalid ID on delete', async () => {
    const invalidId = 'invalid-id';
    const res = await request(app).delete(`/api/products/${invalidId}`);
    expect(res.statusCode).toEqual(400); // Sekarang seharusnya 400 karena error handler sudah menangani CastError
    expect(res.body).toHaveProperty('message', `Invalid _id format: ${invalidId}`); // Sesuaikan pesan
  });
});