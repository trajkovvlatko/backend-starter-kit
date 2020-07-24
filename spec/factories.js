const models = require('../app/models');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const sequelize = require('../config/database');

async function create(table, options = {}) {
  switch (table) {
    case 'performers':
      return await addPerformer(options);
    case 'users':
      return await addUser(options);
    default:
      throw `No factory for table '${table}'`;
  }
}

async function addUser(options) {
  const password = options.password || rand();
  const hash = await bcrypt.hash(password, saltRounds);
  const user = models.User.build({
    name: options.name || rand(),
    email: options.email || `${rand()}@${rand()}.${rand()}`,
    password: hash,
    active:
      typeof options.active !== 'undefined' && options.active !== null
        ? options.active
        : true,
    createdAt: options.createdAt || new Date(),
    updatedAt: options.updatedAt || new Date(),
  });
  await user.save();
  return {...user.dataValues, password: password};
}

async function addPerformer(options) {
  const performer = models.Performer.build({
    name: options.name || rand(),
    email: options.email || `${rand()}@${rand()}.com`,
    userId: options.userId,
    location: options.location || rand(),
    phone: options.phone || rand(),
    details: options.details || rand(),
    website: options.website || rand(),
    rating: options.rating || 2,
    active:
      typeof options.active !== 'undefined' && options.active !== null
        ? options.active
        : true,
    createdAt: options.createdAt || new Date(),
    updatedAt: options.updatedAt || new Date(),
  });
  await performer.save();
  return performer;
}

function rand() {
  return Math.random().toString(36).substring(7);
}

module.exports = create;
