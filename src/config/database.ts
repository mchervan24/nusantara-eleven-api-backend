// src/config/database.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI; // Untuk pengembangan/produksi
    const mongoTestUri = process.env.MONGODB_TEST_URI; // Untuk pengujian

    // Gunakan URI tes jika NODE_ENV adalah 'test', jika tidak gunakan URI biasa
    const currentUri = process.env.NODE_ENV === 'test' ? mongoTestUri : mongoUri;

    if (!currentUri) {
      throw new Error(`MongoDB URI untuk lingkungan ${process.env.NODE_ENV} tidak didefinisikan di file .env`);
    }

    // Periksa apakah koneksi Mongoose sudah terjalin
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB sudah terhubung.');
      return; // Sudah terhubung, tidak perlu melakukan apa-apa
    }

    const conn = await mongoose.connect(currentUri);
    console.log(`MongoDB Terhubung: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error saat menghubungkan ke MongoDB: ${error.message}`);
    // Hanya keluar dari proses jika bukan di lingkungan pengujian
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    } else {
      // Di lingkungan pengujian, lempar ulang error agar Jest bisa menangkapnya
      throw error;
    }
  }
};

export default connectDB;