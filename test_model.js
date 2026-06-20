import dotenv from 'dotenv';
dotenv.config();
import connectDB from './src/db/index.js';
import { User } from './src/models/user.model.js';

async function test() {
  await connectDB();
  
  // Create a dummy user directly in DB
  const testEmail = 'test_new_user123@example.com';
  await User.deleteOne({ email: testEmail });
  
  const user = new User({
    fullName: 'Test User',
    email: testEmail,
    username: 'testuser123',
    password: 'password123',
    avatar: 'http://example.com/avatar.jpg'
  });
  await user.save();
  console.log('User created. Hash is:', user.password);
  
  // Test password check
  const isMatch = await user.isPasswordCorrect('password123');
  console.log('Password match:', isMatch);
  
  process.exit(0);
}
test();
