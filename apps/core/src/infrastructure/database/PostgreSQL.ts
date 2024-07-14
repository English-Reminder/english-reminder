import { Pool } from 'pg';

const pgPool = new Pool({
  user: process.env['POSTGRESQL_USER'],
  host: process.env['POSTGRESQL_HOST'],
  database: process.env['POSTGRESQL_DATABASE'],
  password: process.env['POSTGRESQL_PASSWORD'],
  port: Number(process.env['POSTGRESQL_PORT']), // default port for PostgreSQL
});

const pgQuery = (text: string, params?: any[]) => pgPool.query(text, params);


export {
    pgPool,
    pgQuery
}