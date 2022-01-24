require('dotenv').config();

const { createClient } = require('redis');

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;
const redisUrl = `redis://default:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`;

const setQueueTimes = async (value) => {
  const client = createClient({
    url: redisUrl,
  });

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();

  await client.set('queue-times', value);
  await client.disconnect();
};

const getQueueTimes = async () => {
  const client = createClient({
    url: redisUrl,
  });

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();

  const value = await client.get('queue-times');
  await client.disconnect();
  return value;
};

module.exports = { setQueueTimes, getQueueTimes };
