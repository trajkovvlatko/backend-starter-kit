import {Sequelize} from 'sequelize';
import {host, port, user, password, database} from './get';

if (!host || !port || !user || !password || !database) {
  throw 'Invalid db setup.';
}

const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: 'postgres',
  logging: false, //console.log,
});

export default sequelize;
