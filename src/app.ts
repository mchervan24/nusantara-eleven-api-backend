// src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database';
import productRoutes from './routes/productRoutes';

dotenv.config();

// --- Koneksi Database ---
connectDB();

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cors());

// --- Routes ---
app.use('/api/products', productRoutes);

// --- Handle Root URL ---
app.get('/', (req: Request, res: Response) => {
  res.send('Nusantara Eleven API is Running...');
});

// --- Handle 404 Not Found (Middleware after routes) ---
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Cek jika error adalah CastError dari Mongoose
  // Menggunakan 'as any' untuk mengakses properti CastError yang spesifik
  if (err.name === 'CastError' && (err as any).kind === 'ObjectId') { // Lebih spesifik untuk ObjectId
    statusCode = 400;
    // Mengakses properti path dan value dari error sebagai 'any'
    message = `Invalid ${(err as any).path || 'ID'} format: ${(err as any).value}`;
  } else if (process.env.NODE_ENV === 'production') {
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

export default app;