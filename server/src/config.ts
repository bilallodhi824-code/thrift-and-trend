import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'thrift_and_trend_super_secret_jwt_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  db: {
    server: process.env.DB_SERVER || 'localhost',
    instance: process.env.DB_INSTANCE || 'SQLEXPRESS',
    database: process.env.DB_NAME || 'ThriftAndTrendDB',
    port: parseInt(process.env.DB_PORT || '1433', 10),
    user: process.env.DB_USER || 'tt_user',
    password: process.env.DB_PASSWORD || 'ThriftTrend2026!',
    options: {
      encrypt: process.env.DB_ENCRYPT === 'true',
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
      enableArithAbort: true,
      instanceName: process.env.DB_INSTANCE || 'SQLEXPRESS',
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  },
};
