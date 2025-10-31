import { Pool, QueryResult, QueryResultRow } from 'pg';

// Create a connection pool for PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Alternative: individual connection parameters if DATABASE_URL is not set
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Connection pool settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection not established
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
  process.exit(-1);
});

/**
 * Execute a SQL query against the database.
 * @param {string} text - The SQL query string.
 * @param {unknown[]} params - The query parameters (for parameterized queries).
 * @returns {Promise<QueryResult<T>>} - The query results.
 * @template T - The type of the row data returned by the query.
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }
}

/**
 * Execute a query and return the first row, or null if no rows found.
 * @param {string} text - The SQL query string.
 * @param {unknown[]} params - The query parameters.
 * @returns {Promise<T | null>} - The first row or null.
 * @template T - The type of the row data.
 */
export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  try {
    const result = await query<T>(text, params);
    return result.rows[0] || null;
  } catch (err) {
    console.error('Database queryOne error:', err);
    throw err;
  }
}

/**
 * Execute a query and return all rows.
 * @param {string} text - The SQL query string.
 * @param {unknown[]} params - The query parameters.
 * @returns {Promise<T[]>} - Array of rows.
 * @template T - The type of the row data.
 */
export async function queryMany<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  try {
    const result = await query<T>(text, params);
    return result.rows;
  } catch (err) {
    console.error('Database queryMany error:', err);
    throw err;
  }
}

/**
 * Execute a transaction with multiple queries.
 * @param {Function} callback - Async function that receives a client and executes queries.
 * @returns {Promise<T>} - The result of the transaction.
 * @template T - The return type of the callback.
 */
export async function transaction<T>(
  callback: (client: {
    query: typeof query;
    queryOne: typeof queryOne;
    queryMany: typeof queryMany;
  }) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create wrapper functions that use this specific client
    const clientQuery = <R extends QueryResultRow = QueryResultRow>(
      text: string,
      params?: unknown[]
    ): Promise<QueryResult<R>> => client.query<R>(text, params);

    const clientQueryOne = async <R extends QueryResultRow = QueryResultRow>(
      text: string,
      params?: unknown[]
    ): Promise<R | null> => {
      const result = await client.query<R>(text, params);
      return result.rows[0] || null;
    };

    const clientQueryMany = async <R extends QueryResultRow = QueryResultRow>(
      text: string,
      params?: unknown[]
    ): Promise<R[]> => {
      const result = await client.query<R>(text, params);
      return result.rows;
    };

    const result = await callback({
      query: clientQuery,
      queryOne: clientQueryOne,
      queryMany: clientQueryMany,
    });

    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Transaction error:', err);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Test the database connection.
 * @returns {Promise<boolean>} - True if connection successful.
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0]);
    return true;
  } catch (err) {
    console.error('Database connection failed:', err);
    return false;
  }
}

/**
 * Close the database connection pool.
 * Call this when shutting down the application.
 */
export async function closePool(): Promise<void> {
  await pool.end();
}

// Export the pool for advanced use cases
export { pool };

