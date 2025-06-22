"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./config/database"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
dotenv_1.default.config();
// --- Koneksi Database ---
(0, database_1.default)();
const app = (0, express_1.default)();
// --- Middleware ---
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// --- Routes ---
app.use('/api/products', productRoutes_1.default);
// --- Handle Root URL ---
app.get('/', (req, res) => {
    res.send('Nusantara Eleven API is Running...');
});
// --- Handle 404 Not Found (Middleware after routes) ---
app.use((req, res, next) => {
    res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});
// Global Error Handler
app.use((err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
    // Cek jika error adalah CastError dari Mongoose
    // Menggunakan 'as any' untuk mengakses properti CastError yang spesifik
    if (err.name === 'CastError' && err.kind === 'ObjectId') { // Lebih spesifik untuk ObjectId
        statusCode = 400;
        // Mengakses properti path dan value dari error sebagai 'any'
        message = `Invalid ${err.path || 'ID'} format: ${err.value}`;
    }
    else if (process.env.NODE_ENV === 'production') {
        message = 'Server Error'; // Jangan tampilkan pesan error detail di produksi
    }
    res.status(statusCode);
    res.json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});
const PORT = process.env.PORT || 5000;
// MODIFIKASI PENTING DI SINI: Hanya listen jika tidak dalam mode 'test'
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}
exports.default = app;
