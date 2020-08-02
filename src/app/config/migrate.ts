import {host, port, user, password, database} from './get';
import {exec} from 'child_process';
const direction = process.argv[2];
const env = process.env.NODE_ENV || 'dev';

if (['up', 'down'].indexOf(direction) === -1) {
  console.log("Invalid command, must be npm run migrate 'up/down'");
} else {
  let tsNode = '';
  let tsConf = '';
  let dir = './dist/migrations';
  if (env === 'dev') {
    tsNode = 'ts-node';
    tsConf = '-j ts';
    dir = './src/migrations';
  }
  const dbUrl = `postgres://${user}:${password}@${host}:${port}/${database}`;
  const migratePath = `${tsNode} ./node_modules/node-pg-migrate/bin/node-pg-migrate`;
  const config = `${tsConf} --migrations-dir ${dir}`;
  const command = `DATABASE_URL=${dbUrl} ${migratePath} ${config} ${direction}`;
  exec(command, (err, stdout) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  });
}
