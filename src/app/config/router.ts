import {Application} from 'express';
import passport from 'passport';
require('./passport');

import AuthController from '../controllers/AuthController';
import IndexController from '../controllers/IndexController';
import PerformersController from '../controllers/PerformersController';
import UserPerformersController from '../controllers/user/UserPerformersController';
import UsersController from '../controllers/UsersController';

export class Router {
  public authController: AuthController = new AuthController();
  public indexController: IndexController = new IndexController();
  public performersController: PerformersController = new PerformersController();
  public usersController: UsersController = new UsersController();
  public userPerformersController: UserPerformersController = new UserPerformersController();

  public router(app: Application): void {
    app.get('/', this.indexController.index);

    // Authentication
    app.post('/auth/login', this.authController.login);
    app.post('/auth/register', this.authController.register);

    // Performers
    app.get('/performers', this.performersController.index);
    app.get('/performers/:id', this.performersController.show);

    // Profile
    app.get('/user/profile', this.authenticate(), this.usersController.profile);

    // User's performers
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

    app.use(function (_req, res) {
      return res.send({error: 'Endpoint not found.'});
    });
  }

  // Trigger before endpoints that require an authenticated user
  private authenticate() {
    return passport.authenticate('jwt', {session: false});
  }
}
