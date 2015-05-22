module.exports = {
  db: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/fitness',
  redis: process.env.REDIS_URL || 'redis://localhost:6379'
};
