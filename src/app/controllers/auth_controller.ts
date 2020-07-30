import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import models from '../models';
import IUser from '../models/user_model';
import {IUnauthenticatedRequestWithCustomBody} from '../interfaces/requests';
import IError from '../interfaces/IError';
const {User} = models;
const secret = process.env.JWT_SECRET;

interface IErrorWithUser {
  error: string;
  user: IUser;
}

interface ISuccessfulLogin {
  token: string;
  name: string;
  email: string;
}

interface ISuccessfulRegistration {
  name: string;
  email: string;
}

export default class AuthController {
  public login(
    req: Request,
    res: Response<IErrorWithUser | IError | ISuccessfulLogin>,
  ): Response | void {
    passport.authenticate('local', {session: false}, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          error: info && info.message,
          user: user,
        });
      }

      req.login(user.dataValues, {session: false}, (err) => {
        if (!secret) {
          return res.send({error: 'Missing JWT secret.'});
        }
        if (err) {
          return res.send({error: err});
        }
        const token = jwt.sign(user.dataValues, secret);
        return res.json({token, name: user.name, email: user.email});
      });
    })(req, res);
  }

  public async register(
    req: IUnauthenticatedRequestWithCustomBody<IUser>,
    res: Response<IError | ISuccessfulRegistration>,
  ): Promise<Response> {
    try {
      const {name, email, password} = {...req.body};
      if (!name || !email || !password) {
        return res.status(422).send({error: 'Unprocessable entry.'});
      }
      const user = await User.register(name, email, password);
      return res.send({
        name: user.get('name'),
        email: user.get('email'),
      });
    } catch (e) {
      const errors = e.errors
        .map((obj: {message: string}) => obj.message)
        .join('\n');
      return res.status(500).send({error: errors});
    }
  }
}
