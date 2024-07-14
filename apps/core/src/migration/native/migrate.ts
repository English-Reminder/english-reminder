import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const client = new Client({
  user: 'root',
  host: 'your_host',
  database: 'your_database',
  password: 'your_password',
  port: 5432, // default port for PostgreSQL
});

const migrationTableName = 'migrations';

async function runMigrations() {
  try {
    await client.connect();

    // Ensure the migrations table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS ${migrationTableName} (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        run_on TIMESTAMP NOT NULL
      );
    `);

    // Get the list of already run migrations
    const res = await client.query(`SELECT name FROM ${migrationTableName};`);
    const runMigrations = new Set(res.rows.map(row => row.name));

    // Get the list of migration files
    const migrationFiles = fs.readdirSync(path.join(__dirname, 'migrations'));

    for (const file of migrationFiles) {
      if (runMigrations.has(file)) {
        console.log(`Skipping already run migration: ${file}`);
        continue;
      }

      console.log(`Running migration: ${file}`);
      const sql = fs.readFileSync(path.join(__dirname, 'migrations', file)).toString();
      await client.query(sql);
      await client.query(`INSERT INTO ${migrationTableName} (name, run_on) VALUES ($1, NOW())`, [file]);
    }

    console.log('Migrations completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

runMigrations();
