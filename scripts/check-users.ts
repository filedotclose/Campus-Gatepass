
import { connectDB } from '../lib/db';
import User from '../models/User';
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    await connectDB();
    const users = await User.find({}, 'email role');
    console.log(JSON.stringify(users, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
