import { Pool } from 'pg';

const pool = new Pool({
  user: 'yourUsername',
  host: 'localhost',
  database: 'yourDatabaseName',
  password: 'yourPassword',
  port: 5432, // default port for PostgreSQL
});

const query = (text: string, params?: any[]) => pool.query(text, params);


export {
    pool,
    query
}