import {Request, Response} from 'express';
import sequelize from '../config/database';
import IError from '../interfaces/IError';

async function connect(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export default class IndexController {
  public async index(
    _: Request,
    res: Response<IError | {success: true}>,
  ): Promise<Response> {
    try {
      await connect();
      return res.send({success: true});
    } catch (_) {
      return res.status(500).send({error: 'Cannot select from database.'});
    }
  }
}
