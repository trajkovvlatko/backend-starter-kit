import * as dotenv from 'dotenv';
const env = process.env.NODE_ENV || 'dev';
dotenv.config({path: `.env.${env}`});

const databaseUsed = `Database used: ${process.env.POSTGRES_DB}`;
const row = Array(databaseUsed.length + 1).join('-');
console.log(row);
console.log(databaseUsed);
console.log(row);

export const {host, port, user, password, database} = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
};
