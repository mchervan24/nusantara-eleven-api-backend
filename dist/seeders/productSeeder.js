"use strict";
// src/seeders/productSeeder.ts
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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Product_1 = __importDefault(require("../models/Product")); // Pastikan path ini benar sesuai struktur Anda
dotenv_1.default.config(); // Memuat variabel dari .env
const products = [
    {
        name: "Real Madrid Home Jersey 2025",
        description: "Jersey kandang resmi Real Madrid untuk musim Liga Champions 2024/2025. Didesain dengan teknologi AEROREADY untuk kenyamanan maksimal dan badge klub yang disulam.",
        price: 1350000,
        stock: 50,
        image: "/madrid_home.jpg", // <--- UBAH URL INI SESUAI NAMA FILE ANDA
        category: "Jersey"
    },
    {
        name: "FC Barcelona Away Jersey 2025",
        description: "Jersey tandang resmi FC Barcelona untuk musim Liga Champions 2024/2025. Menggunakan material daur ulang dan desain inovatif yang mencerminkan semangat tim.",
        price: 1300000,
        stock: 45,
        image: "/barcelona_away.jpg", // <--- UBAH URL INI
        category: "Jersey"
    },
    {
        name: "Manchester City Third Jersey 2025", // Asumsi ini City Home dari gambar
        description: "Jersey ketiga resmi Manchester City untuk musim Liga Champions 2024/2025. Warna cerah dengan detail grafis modern, dirancang untuk performa puncak.",
        price: 1400000,
        stock: 60,
        image: "/city_home.jpg", // <--- UBAH URL INI
        category: "Jersey"
    },
    {
        name: "Bayern Munich Home Jersey 2025",
        description: "Jersey kandang klasik Bayern Munich untuk UCL 2025. Menampilkan garis-garis vertikal ikonik dan lambang klub yang khas.",
        price: 1325000,
        stock: 55,
        image: "/bayern_home.jpg", // <--- UBAH URL INI
        category: "Jersey"
    },
    {
        name: "Liverpool Home Jersey 2025",
        description: "Jersey kandang Liverpool untuk musim Liga Champions 2024/2025. Desain sederhana namun elegan, dengan detail 'You'll Never Walk Alone'.",
        price: 1280000,
        stock: 48,
        image: "/liverpool_home.jpg", // <--- UBAH URL INI
        category: "Jersey"
    },
    {
        name: "Paris Saint-Germain Away Jersey 2025", // Asumsi ini PSG Home dari gambar
        description: "Jersey tandang PSG untuk UCL 2025. Menggabungkan gaya jalanan Paris dengan inovasi sportswear.",
        price: 1370000,
        stock: 52,
        image: "/psg_home.jpg", // <--- UBAH URL INI
        category: "Jersey"
    },
    {
        name: "Borussia Dortmund Home Jersey 2025",
        description: "Jersey kandang Borussia Dortmund yang terkenal dengan warna kuning cerah dan detail hitam. Untuk para Supporter Die Schwarzgelben di UCL 2025.",
        price: 1290000,
        stock: 47,
        image: "/dortmund_home.jpg", // <--- UBAH URL INI
        category: "Jersey"
    },
    {
        name: "Inter Milan Home Jersey 2025", // Asumsi ini Inter Milan Home dari gambar
        description: "Jersey kandang Inter Milan untuk UCL 2025. Desain modern dengan garis-garis biru dan hitam klasik.",
        price: 1270000,
        stock: 49,
        image: "/milan_home.jpg", // <--- UBAH URL INI
        category: "Jersey"
    }
];
const seedProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            console.error('Error: MONGODB_URI tidak didefinisikan di file .env');
            process.exit(1);
        }
        yield mongoose_1.default.connect(mongoURI);
        console.log('MongoDB Connected for Seeding');
        // Hapus semua produk yang sudah ada sebelum menambahkan yang baru
        yield Product_1.default.deleteMany({});
        console.log('Existing products cleared.');
        // Tambahkan produk baru
        yield Product_1.default.insertMany(products);
        console.log('Products seeded successfully!');
        mongoose_1.default.connection.close();
        console.log('MongoDB connection closed.');
    }
    catch (error) {
        console.error('Error seeding products:', error.message);
        process.exit(1);
    }
});
seedProducts();
