import chai from 'chai';
import chaiHttp from 'chai-http';
import sequelize from '../app/config/database';
import App from '../app';
import fs from 'fs';
import path from 'path';

chai.use(chaiHttp);
chai.should();

export const app = new App().app;

async function loadDb() {
  await sequelize.query('DROP SCHEMA IF EXISTS public CASCADE;');
  await sequelize.query('CREATE SCHEMA public;');
  const fullPath = path.join(__dirname, 'database.sql');
  const sql = await fs.promises.readFile(fullPath);
  await sequelize.query(sql.toString());
  console.log('------------ Database loaded -----------');
}

async function clearTables() {
  await sequelize.query('TRUNCATE TABLE public.users CASCADE;');
  await sequelize.query('TRUNCATE TABLE public.performers CASCADE;');
}

before(async () => {
  await loadDb();
});

beforeEach(async () => {
  await clearTables();
});

export async function authUser(user: {
  email: string;
  password: string;
}): Promise<string> {
  const url = `/auth/login?email=${user.email}&password=${user.password}`;
  const auth = await chai.request(app).post(url);
  return auth.body.token;
}

export default chai;
