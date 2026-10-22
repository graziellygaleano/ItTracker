import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não foi definida no .env");
}

const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000
};

export default dbConfig;