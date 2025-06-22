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
// src/config/database.ts
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoUri = process.env.MONGODB_URI; // Untuk pengembangan/produksi
        const mongoTestUri = process.env.MONGODB_TEST_URI; // Untuk pengujian
        // Gunakan URI tes jika NODE_ENV adalah 'test', jika tidak gunakan URI biasa
        const currentUri = process.env.NODE_ENV === 'test' ? mongoTestUri : mongoUri;
        if (!currentUri) {
            throw new Error(`MongoDB URI untuk lingkungan ${process.env.NODE_ENV} tidak didefinisikan di file .env`);
        }
        // Periksa apakah koneksi Mongoose sudah terjalin
        if (mongoose_1.default.connection.readyState === 1) {
            console.log('MongoDB sudah terhubung.');
            return; // Sudah terhubung, tidak perlu melakukan apa-apa
        }
        const conn = yield mongoose_1.default.connect(currentUri);
        console.log(`MongoDB Terhubung: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error saat menghubungkan ke MongoDB: ${error.message}`);
        // Hanya keluar dari proses jika bukan di lingkungan pengujian
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1);
        }
        else {
            // Di lingkungan pengujian, lempar ulang error agar Jest bisa menangkapnya
            throw error;
        }
    }
});
exports.default = connectDB;
