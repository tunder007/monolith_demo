import assert from "node:assert/strict";
import { test } from "node:test";

import { createDb, DataTypes, Sequelize } from "../dist/index.js";

test("createDb builds a MySQL Sequelize without connecting", () => {
  const db = createDb({ host: "127.0.0.1", database: "app_dev", username: "root", password: "" });
  assert.ok(db instanceof Sequelize);
  assert.equal(db.getDialect(), "mysql");
  assert.equal(db.config.database, "app_dev");
  assert.equal(db.config.port, 3306);
});

test("re-exports the Sequelize toolkit", () => {
  assert.equal(typeof DataTypes.STRING, "function");
});
