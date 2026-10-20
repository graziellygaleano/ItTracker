import 'dotenv/config';

export const configRede = {
  porta: Number(process.env.PORT) || 3000,
  host: process.env.HOST || 'localhost',

};