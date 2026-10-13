import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config();

async function updateAdmin() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is missing');
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  if (!db) throw new Error('Database connection failed');
  const users = db.collection('Ls_users');

  // Xóa tài khoản cũ phedecor
  await users.deleteMany({ email: 'admin@phedecor.com' });
  await users.deleteMany({ s_user: 'admin' });

  // Tạo tài khoản admin mới luxdecor
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('Admin@123456', salt);

  await users.insertOne({
    s_ID: 'usr-admin-luxdecor',
    s_user: 'admin',
    email: 'admin@luxdecor.com',
    s_PWD: hash,
    phone: '0988888888',
    role: 'admin',
    avatar_url: '',
    status: true,
    dt_create: new Date(),
    dt_update: new Date(),
  });

  console.log('SUCCESS: Admin updated to admin@luxdecor.com / Admin@123456');
  await mongoose.disconnect();
}

updateAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
