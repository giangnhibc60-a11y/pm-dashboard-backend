import 'dotenv/config';

export default {
  schema: './schema/tasks.js', // Chỉ định trực tiếp file schema thay vì wildcard
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};