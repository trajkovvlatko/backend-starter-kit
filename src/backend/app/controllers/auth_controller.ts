import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import models from '../models';
import IUser from '../interfaces/IUser';
import IRequestWithCustomBody from '../interfaces/IRequestWithCustomBody';
const {User} = models;
const secret = process.env.JWT_SECRET;

export default class AuthController {
  public login(req: Request, res: Response): Response | void {
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
          return res.send(err);
        }
        const token = jwt.sign(user.dataValues, secret);
        return res.json({token, name: user.name, email: user.email});
      });
    })(req, res);
  }

  public async register(
    req: IRequestWithCustomBody<IUser>,
    res: Response,
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
      const errors = e.errors.map((obj: {message: string}) => obj.message);
      return res.status(500).send({error: errors});
    }
  }
}
