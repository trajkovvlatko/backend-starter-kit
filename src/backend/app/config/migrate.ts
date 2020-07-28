import {host, port, user, password, database} from './get';
import {exec} from 'child_process';

const direction = process.argv[2];

if (['up', 'down'].indexOf(direction) === -1) {
  console.log("Invalid command, must be npm run migrate 'up/down'");
} else {
  const dbUrl = `postgres://${user}:${password}@${host}:${port}/${database}`;
  const migratePath = `ts-node ./node_modules/node-pg-migrate/bin/node-pg-migrate`;
  const config = '-j ts --migrations-dir ./src/backend/migrations';
  const command = `DATABASE_URL=${dbUrl} ${migratePath} ${config} ${direction}`;
  exec(command, (err, stdout) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  });
}
