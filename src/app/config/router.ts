import {Application} from 'express';
import passport from 'passport';
import createError from 'http-errors';
require('./passport');

import AuthController from '../controllers/auth_controller';
import IndexController from '../controllers/index_controller';
import PerformersController from '../controllers/performers_controller';
import UserPerformersController from '../controllers/user/performers_controller';
import UsersController from '../controllers/users_controller';

export class Router {
  public authController: AuthController = new AuthController();
  public indexController: IndexController = new IndexController();
  public performersController: PerformersController = new PerformersController();
  public usersController: UsersController = new UsersController();
  public userPerformersController: UserPerformersController = new UserPerformersController();

  public router(app: Application): void {
    app.get('/', this.indexController.index);

    app.post('/auth/login', this.authController.login);
    app.post('/auth/register', this.authController.register);

    app.get('/performers', this.performersController.index);
    app.get('/performers/:id', this.performersController.show);

    app.get('/user/profile', this.authenticate(), this.usersController.profile);

    app.get(
      '/user/performers',
      this.authenticate(),
      this.userPerformersController.index,
    );
    app.post(
      '/user/performers',
      this.authenticate(),
      this.userPerformersController.create,
    );

    app.get(
      '/user/performers/active',
      this.authenticate(),
      this.userPerformersController.active,
    );

    app.get(
      '/user/performers/:id',
      this.authenticate(),
      this.userPerformersController.show,
    );
    app.patch(
      '/user/performers/:id',
      this.authenticate(),
      this.userPerformersController.update,
    );
    app.delete(
      '/user/performers/:id',
      this.authenticate(),
      this.userPerformersController.delete,
    );

    // catch 404 and forward to error handler
    app.use(function (_req, _res, next) {
      next(createError(404));
    });
  }

  private authenticate() {
    return passport.authenticate('jwt', {session: false});
  }
}
