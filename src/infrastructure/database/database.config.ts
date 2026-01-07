export const databaseConfig = () => ({
  type: process.env.DB_TYPE,

  mongo: {
    uri: process.env.MONGO_URI,
  },

  postgres: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    db: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  },
});
