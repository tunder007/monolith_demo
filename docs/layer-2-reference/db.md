# `@softeneers/db`

A configured **Sequelize (MySQL)** factory plus a connection helper. It does the
boilerplate — dialect, pool, credentials — and re-exports the Sequelize toolkit
so a consumer adds one dependency instead of three.

## Install

```bash
npm i @softeneers/db mysql2
```

`mysql2` is the dialect driver Sequelize needs at runtime; install it alongside.

## API

### `createDb(config)`

```ts
function createDb(config: {
  host: string;
  port?: number;        // default 3306
  database: string;
  username: string;
  password: string;
  logging?: boolean;    // default false
}): Sequelize;
```

Returns a configured `Sequelize` instance. **Does not connect** — the connection
opens lazily on the first query (or when you call `assertConnection`).

### `assertConnection(db)`

```ts
function assertConnection(db: Sequelize): Promise<void>;
```

Authenticates the connection, throwing a wrapped error that names the target
`host`/`database` so a misconfigured `.env` fails fast and legibly.

### Re-exports

`Sequelize`, `Model`, `DataTypes`, and the `ModelStatic` / `SequelizeOptions`
types — define models without importing `sequelize` directly.

## Usage

```ts
import { assertConnection, createDb, DataTypes, Model } from "@softeneers/db";

export const sequelize = createDb({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
});

class Car extends Model {
  declare id: number;
  declare brand: string;
}
Car.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    brand: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "Car", tableName: "cars" },
);

await assertConnection(sequelize);
await sequelize.sync(); // create tables in dev
```

## How the templates use it

In the API/fullstack templates, the `--db` toggle wires this in behind a
`CarStore` interface. On first use the store calls `assertConnection` +
`sync()`, auto-seeds demo data, and — crucially — **falls back to an in-memory
store if the database is unreachable**, so `npm run dev` always works. Start
MySQL (the `--docker` toggle ships a `docker-compose.yml`) to get real
persistence.

## Notes & roadmap

- Pairs with `sequelize-cli` for explicit migrations/seeds in the consuming app.
- MySQL today; Drizzle/Prisma and Postgres variants are possible future additions.
