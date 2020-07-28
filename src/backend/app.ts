import * as dotenv from 'dotenv';
import express from 'express';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import {Router} from './app/config/router';

const env = process.env.NODE_ENV || 'dev';
dotenv.config({path: `.env.${env}`});

export default class App {
  public app: express.Application;
  public router: Router = new Router();

  constructor() {
    this.app = express();
    this.config();
    this.router.router(this.app);
  }

  private config(): void {
    this.app.set('port', process.env.PORT || 4000);

    this.app.use(logger('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: false}));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(
      cors({
        origin: process.env.CLIENT_URL,
      }),
    );
  }
}
