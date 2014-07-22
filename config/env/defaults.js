module.exports = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 1337,
  config: {
    paths: {
      environments: __dirname,
    }
  },
};