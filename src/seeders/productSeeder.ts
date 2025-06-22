// src/seeders/productSeeder.ts
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import Product, { IProduct } from '../models/Product';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env file.');
  process.exit(1);
}

const seedProducts = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected for Seeding');

    await Product.deleteMany({});
    console.log('Existing products cleared.');

    const products: IProduct[] = [];
    const categories = ['Club European', 'National Team', 'Retro', 'Training Gear'];
    const teams = ['Real Madrid', 'Barcelona', 'Manchester United', 'Liverpool', 'Bayern Munich', 'Juventus', 'Timnas Indonesia', 'Argentina', 'Brazil', 'France'];
    const countries = ['Spain', 'Spain', 'England', 'England', 'Germany', 'Italy', 'Indonesia', 'Argentina', 'Brazil', 'France'];

    for (let i = 0; i < 20; i++) {
      const randomCategory = faker.helpers.arrayElement(categories);
      const randomTeamIndex = faker.number.int({ min: 0, max: teams.length - 1 });
      const randomTeam = teams[randomTeamIndex];
      const randomCountry = countries[randomTeamIndex];

      products.push({
        name: `${randomTeam} ${faker.commerce.productName()} ${faker.number.int({ min: 2000, max: 2025 })} Home Jersey`,
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 200000, max: 900000, dec: 0 })),
        category: randomCategory,
        stock: faker.number.int({ min: 10, max: 100 }),
        imageUrl: faker.image.urlLoremFlickr({ category: 'sports', width: 640, height: 480 }), // Fix: Removed randomize: true
        team: randomTeam,
        country: randomCountry,
      } as IProduct);
    }

    await Product.insertMany(products);
    console.log('Products seeded successfully!');
    mongoose.connection.close();
  } catch (error: any) {
    console.error(`Error seeding products: ${error.message}`);
    process.exit(1);
  }
};

seedProducts();