export const AppEnvConfig = () => {
  return {
    server: {
      port: process.env.PORT,
    },
    kafka: {
      brokers: process.env.KAFKA_BROKERS.split(','),
      clientId: process.env.KAFKA_CLIENT_ID,
    },
  };
};
