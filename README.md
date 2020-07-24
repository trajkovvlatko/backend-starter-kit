### Run locally

Create databases for dev and test

Rename `env` to `.env`, `env.test` to `.env.test` and fix the values.

Install dependencies

```
npm i
```

Run development server (with nodemon):

```
./node_modules/nodemon/bin/nodemon.js DEBUG=backend_development:* npm start
```

Run specs:

```
npm run spec
```

Run migrations:

```
npm run migrate up/down
```

Export database schema:

```
pg_dump --schema-only backend_development > spec/database.sql
```
