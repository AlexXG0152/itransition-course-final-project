export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,

  PORT: parseInt(process.env.PORT, 10) || 3001,

  // MYSQL_DIALECT: 'mysql',
  // MYSQL_HOST: process.env.MYSQL_HOST,
  // MYSQL_PORT: process.env.MYSQL_PORT,
  // MYSQL_USER: process.env.MYSQL_USER,
  // MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
  // MYSQL_DATABASE: process.env.MYSQL_DATABASE,
  // MYSQL_POOL_MAX: process.env.MYSQL_POOL_MAX,
  // MYSQL_POOL_MIN: process.env.MYSQL_POOL_MIN,
  // MYSQL_POOL_ACQUIRE: process.env.MYSQL_POOL_ACQUIRE,
  // MYSQL_POOL_IDLE: process.env.MYSQL_POOL_IDLE,

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
});
