import 'server-only';
import sql, { config as SqlConfig, IResult } from 'mssql';

// Azure SQL Database connection configuration
const config: SqlConfig = {
  server: process.env.DB_HOST || '',
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_NAME || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  options: {
    encrypt: true, // Required for Azure SQL
    trustServerCertificate: false, // Set to true for local dev only
  },
  pool: {
    max: 20,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Create a connection pool for Azure SQL
let pool: sql.ConnectionPool | null = null;

/**
 * Get or create the connection pool
 */
async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await new sql.ConnectionPool(config).connect();
    console.log('Azure SQL connection pool created');

    pool.on('error', (err) => {
      console.error('Azure SQL pool error:', err);
      pool = null; // Reset pool on error
    });
  }
  return pool;
}

/**
 * Execute a SQL query against the database.
 * @param {string} text - The SQL query string.
 * @param {Record<string, unknown>} params - Named parameters for the query.
 * @returns {Promise<IResult<T>>} - The query results.
 * @template T - The type of the row data returned by the query.
 */
export async function query<T = unknown>(
  text: string,
  params?: Record<string, unknown>
): Promise<IResult<T>> {
  const start = Date.now();
  try {
    const pool = await getPool();
    const request = pool.request();

    // Add parameters if provided
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        request.input(key, value);
      }
    }

    const result = await request.query<T>(text);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowsAffected[0] });
    return result;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }
}

/**
 * Execute a query and return the first row, or null if no rows found.
 * @param {string} text - The SQL query string.
 * @param {Record<string, unknown>} params - Named parameters for the query.
 * @returns {Promise<T | null>} - The first row or null.
 * @template T - The type of the row data.
 */
export async function queryOne<T = unknown>(
  text: string,
  params?: Record<string, unknown>
): Promise<T | null> {
  try {
    const result = await query<T>(text, params);
    return result.recordset[0] || null;
  } catch (err) {
    console.error('Database queryOne error:', err);
    throw err;
  }
}

/**
 * Execute a query and return all rows.
 * @param {string} text - The SQL query string.
 * @param {Record<string, unknown>} params - Named parameters for the query.
 * @returns {Promise<T[]>} - Array of rows.
 * @template T - The type of the row data.
 */
export async function queryMany<T = unknown>(
  text: string,
  params?: Record<string, unknown>
): Promise<T[]> {
  try {
    const result = await query<T>(text, params);
    return result.recordset;
  } catch (err) {
    console.error('Database queryMany error:', err);
    throw err;
  }
}

/**
 * Execute a transaction with multiple queries.
 * @param {Function} callback - Async function that receives a transaction and executes queries.
 * @returns {Promise<T>} - The result of the transaction.
 * @template T - The return type of the callback.
 */
export async function transaction<T>(
  callback: (tx: {
    query: typeof query;
    queryOne: typeof queryOne;
    queryMany: typeof queryMany;
  }) => Promise<T>
): Promise<T> {
  const pool = await getPool();
  const tx = pool.transaction();

  try {
    await tx.begin();

    // Create wrapper functions that use this specific transaction
    const txQuery = async <R = unknown>(
      text: string,
      params?: Record<string, unknown>
    ): Promise<IResult<R>> => {
      const request = tx.request();
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          request.input(key, value);
        }
      }
      return await request.query<R>(text);
    };

    const txQueryOne = async <R = unknown>(
      text: string,
      params?: Record<string, unknown>
    ): Promise<R | null> => {
      const result = await txQuery<R>(text, params);
      return result.recordset[0] || null;
    };

    const txQueryMany = async <R = unknown>(
      text: string,
      params?: Record<string, unknown>
    ): Promise<R[]> => {
      const result = await txQuery<R>(text, params);
      return result.recordset;
    };

    const result = await callback({
      query: txQuery,
      queryOne: txQueryOne,
      queryMany: txQueryMany,
    });

    await tx.commit();
    return result;
  } catch (err) {
    await tx.rollback();
    console.error('Transaction error:', err);
    throw err;
  }
}

/**
 * Test the database connection.
 * @returns {Promise<boolean>} - True if connection successful.
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT GETDATE() as now');
    console.log('Azure SQL connection successful:', result.recordset[0]);
    return true;
  } catch (err) {
    console.error('Azure SQL connection failed:', err);
    return false;
  }
}

/**
 * Close the database connection pool.
 * Call this when shutting down the application.
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
  }
}

// Export the pool getter for advanced use cases
export { getPool };
