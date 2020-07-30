import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as JWTStrategy, ExtractJwt} from 'passport-jwt';
import models from '../models';
const {User} = models;
const secret = process.env.JWT_SECRET;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async function (email, password, cb) {
      try {
        const resp = await User.findByCredentials(email, password);
        if (resp instanceof User) {
          return cb(null, resp, {message: 'Logged In Successfully'});
        } else {
          return cb(null, false, {message: 'Incorrect email or password.'});
        }
      } catch (err) {
        return cb(err);
      }
    },
  ),
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    },
    async function (jwtPayload, cb) {
      try {
        const resp = await User.findByPk(jwtPayload.id, {
          attributes: ['id', 'name', 'email'],
        });
        return await cb(null, resp);
      } catch (err) {
        return cb(err);
      }
    },
  ),
);
