export default () => ({
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  midtrans: {
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  },
  redis: {
    url: process.env.REDIS_URL,
  },
});
