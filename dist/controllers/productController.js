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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product_1.default.find({});
    res.json(products);
}));
// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_1.default.findById(req.params.id);
    if (product) {
        res.json(product);
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
}));
// @desc    Create a product
// @route   POST /api/products
// @access  Private
exports.createProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, category, stock, imageUrl, team, country } = req.body;
    if (!name || !description || !price || !category || stock === undefined || stock < 0 || price < 0) {
        res.status(400);
        throw new Error('Please provide all required product details: name, description, price, category, and stock (must be non-negative).');
    }
    const productExists = yield Product_1.default.findOne({ name });
    if (productExists) {
        res.status(409); // Conflict
        throw new Error('Product with this name already exists');
    }
    const product = new Product_1.default({
        name,
        description,
        price,
        category,
        stock,
        imageUrl,
        team,
        country,
    });
    const createdProduct = yield product.save();
    res.status(201).json(createdProduct);
}));
// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { name, description, price, category, stock, imageUrl, team, country } = req.body;
    const product = yield Product_1.default.findById(req.params.id);
    if (product) {
        // Check if new name conflicts with an existing product (excluding itself)
        if (name && name !== product.name) {
            const productWithNewNameExists = yield Product_1.default.findOne({ name });
            // The fix for _id comparison: ensure _id exists before toString()
            if (productWithNewNameExists && ((_a = productWithNewNameExists._id) === null || _a === void 0 ? void 0 : _a.toString()) !== ((_b = product._id) === null || _b === void 0 ? void 0 : _b.toString())) {
                res.status(409);
                throw new Error('Another product with this name already exists.');
            }
        }
        product.name = name !== null && name !== void 0 ? name : product.name;
        product.description = description !== null && description !== void 0 ? description : product.description;
        product.price = price !== null && price !== void 0 ? price : product.price;
        product.category = category !== null && category !== void 0 ? category : product.category;
        product.stock = stock !== undefined ? stock : product.stock;
        product.imageUrl = imageUrl !== null && imageUrl !== void 0 ? imageUrl : product.imageUrl;
        product.team = team !== null && team !== void 0 ? team : product.team;
        product.country = country !== null && country !== void 0 ? country : product.country;
        if (product.stock < 0 || product.price < 0) {
            res.status(400);
            throw new Error('Stock and Price cannot be negative.');
        }
        const updatedProduct = yield product.save();
        res.json(updatedProduct);
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
}));
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_1.default.findByIdAndDelete(req.params.id);
    if (product) {
        res.json({ message: 'Product removed successfully' });
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
}));
