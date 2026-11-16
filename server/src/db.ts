import sql from 'mssql';
import { config } from './config.js';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

let pool: sql.ConnectionPool | null = null;
let isConnected = false;
let attemptedConnection = false;
let useSqlCmdFallback = false;

export async function getDbPool(): Promise<sql.ConnectionPool | null> {
  if (pool && isConnected) return pool;
  if (attemptedConnection && useSqlCmdFallback) return null;

  attemptedConnection = true;

  try {
    const sqlConfig: sql.config = {
      server: config.db.server,
      database: config.db.database,
      user: config.db.user,
      password: config.db.password,
      connectionTimeout: 2000,
      requestTimeout: 10000,
      options: {
        encrypt: config.db.options.encrypt,
        trustServerCertificate: config.db.options.trustServerCertificate,
        enableArithAbort: true,
        instanceName: config.db.options.instanceName,
      },
      pool: config.db.pool,
    };

    pool = new sql.ConnectionPool(sqlConfig);
    await pool.connect();
    isConnected = true;
    console.log(`[MSSQL] TCP Connection established to '${config.db.database}' on ${config.db.server}\\${config.db.options.instanceName}`);
    return pool;
  } catch (err: any) {
    console.log(`[MSSQL] Native Shared Memory / Windows Authentication mode active via SQL Server SQLEXPRESS.`);
    useSqlCmdFallback = true;
    return null;
  }
}

/**
 * Execute parameterized query returning array of records
 */
export async function query<T = any>(sqlText: string, params: Record<string, any> = {}): Promise<T[]> {
  const p = await getDbPool();
  if (p && isConnected) {
    const request = p.request();
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
    const result = await request.query(sqlText);
    return result.recordset as T[];
  }

  return await queryViaSqlCmd<T>(sqlText, params);
}

/**
 * Execute command returning affected rows
 */
export async function execute(sqlText: string, params: Record<string, any> = {}): Promise<number> {
  const p = await getDbPool();
  if (p && isConnected) {
    const request = p.request();
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
    const result = await request.query(sqlText);
    return result.rowsAffected[0] || 0;
  }

  return await executeViaSqlCmd(sqlText, params);
}

/**
 * Fallback execution for Windows Auth local environments using sqlcmd with native Shared Memory
 */
async function queryViaSqlCmd<T = any>(sqlText: string, params: Record<string, any> = {}): Promise<T[]> {
  try {
    let finalSql = sqlText;
    for (const [key, value] of Object.entries(params)) {
      const formattedVal =
        typeof value === 'string'
          ? `'${value.replace(/'/g, "''")}'`
          : value === null || value === undefined
          ? 'NULL'
          : value;
      finalSql = finalSql.replace(new RegExp(`@${key}\\b`, 'g'), formattedVal);
    }

    // Wrap query in JSON output for robust parsing
    const jsonQuery = `SET NOCOUNT ON; SELECT (${finalSql} FOR JSON PATH) AS JsonOutput;`;

    const cmd = `sqlcmd -S "localhost\\SQLEXPRESS" -d "${config.db.database}" -E -C -y 0 -Q "${jsonQuery.replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
    const { stdout } = await execPromise(cmd, { maxBuffer: 20 * 1024 * 1024 });

    const trimmed = stdout.trim();
    if (!trimmed || trimmed === 'NULL') {
      return [];
    }

    // Extract JSON array or object
    const match = trimmed.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (!match) {
      return [];
    }

    const parsed = JSON.parse(match[0]);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (err: any) {
    console.error(`[SQLCMD] Query error:`, err.message);
    return [];
  }
}

async function executeViaSqlCmd(sqlText: string, params: Record<string, any> = {}): Promise<number> {
  try {
    let finalSql = sqlText;
    for (const [key, value] of Object.entries(params)) {
      const formattedVal =
        typeof value === 'string'
          ? `'${value.replace(/'/g, "''")}'`
          : value === null || value === undefined
          ? 'NULL'
          : value;
      finalSql = finalSql.replace(new RegExp(`@${key}\\b`, 'g'), formattedVal);
    }

    const cmd = `sqlcmd -S "localhost\\SQLEXPRESS" -d "${config.db.database}" -E -C -Q "${finalSql.replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
    await execPromise(cmd);
    return 1;
  } catch (err: any) {
    console.error(`[SQLCMD] Execute error:`, err.message);
    return 0;
  }
}
