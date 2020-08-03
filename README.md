### Run locally

Create databases for dev and test

Rename `env.dev` to `.env.dev`, `env.test` to `.env.test` and fix the values.

Install dependencies

```
npm i
```

Run development server (with nodemon):

```
npm run watch
```

Run migrations:

```
npm run migrate-dev up/down
```

Export database schema:

```
pg_dump --schema-only backend_development > src/spec/database.sql
```

Run specs:

```
npm run spec
```

Run seeds:

```
npm run seed
```

Build (will generate js code in ./dist)

```
npm run build
```
