import { DataTypes, Model, Sequelize } from "sequelize";

// Re-export the Sequelize toolkit so consumers don't add a second dependency.
export { DataTypes, Model, Sequelize };
export type { ModelStatic, Options as SequelizeOptions } from "sequelize";

export interface DbConfig {
  host: string;
  port?: number;
  database: string;
  username: string;
  password: string;
  /** Log SQL to the console. Default false. */
  logging?: boolean;
}

/**
 * Create a configured Sequelize instance for MySQL. Does not connect — call
 * {@link assertConnection} (or any query) to actually open the connection.
 *
 * @example
 * const db = createDb({ host: "127.0.0.1", database: "app", username: "root", password: "" });
 * await assertConnection(db);
 */
export function createDb(config: DbConfig): Sequelize {
  return new Sequelize({
    dialect: "mysql",
    host: config.host,
    port: config.port ?? 3306,
    database: config.database,
    username: config.username,
    password: config.password,
    logging: config.logging ? console.log : false,
  });
}

/**
 * Authenticate the connection. Throws a wrapped error with the target host/db so
 * a misconfigured `.env` fails fast and legibly.
 */
export async function assertConnection(db: Sequelize): Promise<void> {
  try {
    await db.authenticate();
  } catch (cause) {
    const { host, database } = db.config;
    throw new Error(`Database connection failed (host=${host}, database=${database}).`, { cause });
  }
}
