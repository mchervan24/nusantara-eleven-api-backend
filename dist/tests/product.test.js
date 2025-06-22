"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/tests/product.test.ts
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Product_1 = __importDefault(require("../models/Product"));
dotenv_1.default.config();
const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    if (!MONGODB_TEST_URI) {
        throw new Error('MONGODB_TEST_URI is not defined in .env file.');
    }
    yield mongoose_1.default.connect(MONGODB_TEST_URI);
    console.log('Connected to Test MongoDB');
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield Product_1.default.deleteMany({});
    const dummyProducts = [
        {
            name: "Dummy Club Home Jersey",
            description: "High quality dummy jersey for testing.",
            price: 500000,
            category: "Club European",
            stock: 50,
            team: "Dummy FC",
            country: "Dummy Land"
        },
        {
            name: "Dummy National Away Jersey",
            description: "Another dummy jersey for testing purposes.",
            price: 450000,
            category: "National Team",
            stock: 30,
            team: "Dummy Nation",
            country: "Dummy Country"
        },
    ];
    yield Product_1.default.insertMany(dummyProducts);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
    console.log('Test MongoDB connection closed');
}));
describe('Product API', () => {
    it('should get all products', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/products');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThanOrEqual(2);
        expect(res.body[0]).toHaveProperty('name');
    }));
    it('should get a product by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield Product_1.default.findOne({ name: "Dummy Club Home Jersey" });
        // Memastikan product tidak null sebelum menggunakan _id-nya
        if (!product)
            throw new Error('Dummy product not found for test: should get a product by ID');
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/products/${product._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', 'Dummy Club Home Jersey');
    }));
    it('should return 404 if product not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistentId = new mongoose_1.default.Types.ObjectId().toHexString();
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/products/${nonExistentId}`);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Product not found');
    }));
    // PERBAIKAN DI SINI: SESUAIKAN PESAN DAN STATUS CODE
    it('should return 400 for invalid ID format (GET)', () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidId = 'invalid-id-format';
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/products/${invalidId}`);
        expect(res.statusCode).toEqual(400); // Sekarang seharusnya 400 karena error handler sudah disempurnakan
        expect(res.body).toHaveProperty('message', `Invalid _id format: ${invalidId}`); // Sesuaikan pesan
    }));
    it('should create a new product', () => __awaiter(void 0, void 0, void 0, function* () {
        const newProduct = {
            name: "New Test Jersey",
            description: "A brand new jersey for testing create.",
            price: 600000,
            category: "Training Gear",
            stock: 10,
            team: "Test Team",
            country: "Test Land"
        };
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/products').send(newProduct);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('name', newProduct.name);
        const productInDb = yield Product_1.default.findById(res.body._id);
        expect(productInDb).not.toBeNull();
    }));
    it('should return 409 if product name already exists on creation', () => __awaiter(void 0, void 0, void 0, function* () {
        const existingProduct = {
            name: "Dummy Club Home Jersey",
            description: "Duplicate product test.",
            price: 100000,
            category: "Club",
            stock: 1
        };
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/products').send(existingProduct);
        expect(res.statusCode).toEqual(409);
        expect(res.body).toHaveProperty('message', 'Product with this name already exists');
    }));
    it('should update an existing product', () => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield Product_1.default.findOne({ name: "Dummy Club Home Jersey" });
        // Memastikan product tidak null sebelum menggunakan _id-nya
        if (!product)
            throw new Error('Dummy product not found for test: should update an existing product');
        const updatedData = { price: 550000, stock: 45 };
        const res = yield (0, supertest_1.default)(app_1.default).put(`/api/products/${product._id}`).send(updatedData);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('price', updatedData.price);
        expect(res.body).toHaveProperty('stock', updatedData.stock);
    }));
    it('should return 409 if updating product name to an existing name', () => __awaiter(void 0, void 0, void 0, function* () {
        const product1 = yield Product_1.default.findOne({ name: "Dummy Club Home Jersey" });
        const product2 = yield Product_1.default.findOne({ name: "Dummy National Away Jersey" });
        if (!product1 || !product2)
            throw new Error('Could not find both dummy products for test: updating product name to an existing name');
        const updatedData = { name: product2.name };
        const res = yield (0, supertest_1.default)(app_1.default).put(`/api/products/${product1._id}`).send(updatedData);
        expect(res.statusCode).toEqual(409);
        expect(res.body).toHaveProperty('message', 'Another product with this name already exists.');
    }));
    it('should delete a product', () => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield Product_1.default.findOne({ name: "Dummy Club Home Jersey" });
        // Memastikan product tidak null sebelum menggunakan _id-nya
        if (!product)
            throw new Error('Dummy product not found for test: should delete a product');
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/api/products/${product._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Product removed successfully');
        const deletedProduct = yield Product_1.default.findById(product._id);
        expect(deletedProduct).toBeNull();
    }));
    // Tambahan test case: menguji update dengan ID yang tidak valid
    // PERBAIKAN DI SINI: SESUAIKAN PESAN DAN STATUS CODE
    it('should return 400 for invalid ID on update', () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidId = 'invalid-id';
        const updatedData = { name: 'Test' };
        const res = yield (0, supertest_1.default)(app_1.default).put(`/api/products/${invalidId}`).send(updatedData);
        expect(res.statusCode).toEqual(400); // Sekarang seharusnya 400 karena error handler sudah menangani CastError
        expect(res.body).toHaveProperty('message', `Invalid _id format: ${invalidId}`); // Sesuaikan pesan
    }));
    // Tambahan test case: menguji delete dengan ID yang tidak valid
    // PERBAIKAN DI SINI: SESUAIKAN PESAN DAN STATUS CODE
    it('should return 400 for invalid ID on delete', () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidId = 'invalid-id';
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/api/products/${invalidId}`);
        expect(res.statusCode).toEqual(400); // Sekarang seharusnya 400 karena error handler sudah menangani CastError
        expect(res.body).toHaveProperty('message', `Invalid _id format: ${invalidId}`); // Sesuaikan pesan
    }));
});
