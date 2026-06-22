# @softeneers/db

A configured **Sequelize (MySQL)** factory plus connection helpers, so apps get
a consistent database setup. Pairs with the Docker MySQL recipe shipped in the
`next-fullstack` template (`docker-compose.yml`).

## Usage

```ts
import { createDb, assertConnection, DataTypes, Model } from "@softeneers/db";

const db = createDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

await assertConnection(db); // throws a legible error if the connection fails

class Car extends Model {}
Car.init({ brand: DataTypes.STRING }, { sequelize: db, modelName: "Car" });
```

## API

- `createDb(config)` — returns a configured `Sequelize` (does not connect).
- `assertConnection(db)` — authenticates; throws with host/db context on failure.
- Re-exports `Sequelize`, `Model`, `DataTypes` (and types) so consumers don't add
  a second dependency.

Migrations and seeds are driven by `sequelize-cli` in the consuming app (see the
template's `apps/server`). Pair with [`@softeneers/env`](../env/README.md) to
validate the DB config at startup.
