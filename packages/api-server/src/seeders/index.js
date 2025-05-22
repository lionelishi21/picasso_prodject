import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedDefaultUser } from './defaultUser.js';
import { seedDefaultThemes } from './defaultThemes.js';
import { seedDefaultSite } from './defaultSite.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-builder';

const runSeeders = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Run seeders in sequence
    const defaultUser = await seedDefaultUser();
    await seedDefaultThemes();
    await seedDefaultSite();

    console.log('All seeders completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeders:', error);
    process.exit(1);
  }
};

// Run seeders
runSeeders(); 