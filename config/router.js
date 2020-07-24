const createError = require('http-errors');
const passport = require('passport');
require('./passport');
const auth = require('../app/controllers/auth_controller');
const indexRouter = require('../app/controllers/index_controller');
const performers = require('../app/controllers/performers_controller');
const userPerformers = require('../app/controllers/user/performers_controller');
const users = require('../app/controllers/users_controller');

function authenticate() {
  return passport.authenticate('jwt', {session: false});
}

module.exports = function (app) {
  app.use('/', indexRouter);
  app.use('/auth', auth);
  app.use('/performers', performers);

  // with authenticated user
  app.use('/user/profile', authenticate(), users);
  app.use('/user/performers', authenticate(), userPerformers);

  // catch 404 and forward to error handler
  app.use(function (_, _, next) {
    next(createError(404));
  });
};
