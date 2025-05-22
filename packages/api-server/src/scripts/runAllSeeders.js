import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import seedStore from '../seeders/StoreSeeder.js';
import seedHeaderConfig from '../seeders/HeaderConfigSeeder.js';
import seedFooterConfig from '../seeders/FooterConfigSeeder.js';
import seedProductGridConfig from '../seeders/ProductGridConfigSeeder.js';
import seedCategoryListConfig from '../seeders/CategoryListConfigSeeder.js';
import seedHeroSectionConfig from '../seeders/HeroSectionConfigSeeder.js';
import seedProductCardConfig from '../seeders/ProductCardConfigSeeder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/picasso-storefront';

async function runAllSeeders() {
  try {
    console.log('Starting seeding process...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // First create the store
    console.log('Creating default store...');
    const store = await seedStore();
    console.log('Store seeded successfully');
    
    // Run component seeders
    console.log('Running component seeders...');
    
    await seedHeaderConfig(store._id);
    console.log('Header config seeded');
    
    await seedFooterConfig(store._id);
    console.log('Footer config seeded');
    
    await seedProductGridConfig(store._id);
    console.log('Product grid config seeded');
    
    await seedCategoryListConfig(store._id);
    console.log('Category list config seeded');
    
    await seedHeroSectionConfig(store._id);
    console.log('Hero section config seeded');

    await seedProductCardConfig(store._id);
    console.log('Product card config seeded');
    
    console.log('All seeders completed successfully');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error running seeders:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

runAllSeeders();

