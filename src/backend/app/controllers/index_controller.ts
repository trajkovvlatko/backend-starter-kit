import {Request, Response} from 'express';
import sequelize from '../config/database';

async function connect() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export default class IndexController {
  public async index(_: Request, res: Response) {
    try {
      await connect();
      res.send({success: true});
    } catch (_) {
      res.status(500).send({error: 'Cannot select from database.'});
    }
  }
}
