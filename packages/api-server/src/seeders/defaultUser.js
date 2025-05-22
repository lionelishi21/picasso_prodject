import bcrypt from 'bcryptjs';
import User from '../models/userSchema.js';

export const seedDefaultUser = async () => {
  try {
    // Check if default user exists
    const existingUser = await User.findOne({ email: 'admin@example.com' });
    if (existingUser) {
      console.log('Default user already exists');
      return;
    }
    // Create default user
    const defaultUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });

    await defaultUser.save();
    console.log('Default user created successfully');
    return defaultUser;
  } catch (error) {
    console.error('Error seeding default user:', error);
    throw error;
  }
}; 