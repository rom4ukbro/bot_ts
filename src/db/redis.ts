import * as redis from 'async-redis';

const REDIS_URL = process.env.REDIS_URL || 6379;

// @ts-ignore
const client = redis.createClient(REDIS_URL);

// client.on('error', (err) => console.log(err));

/**
 *
 * @param {string} key
 * @param {string} data
 * @param {number} ttl second
 *
 */
async function redisWriteData(key: string, data: any, ttl = 60) {
  data = JSON.stringify(data, null, 2);
  await client.set(key, data).finally(() => client.EXPIRE(key, ttl));
}

async function redisGetData(key: string) {
  return JSON.parse(await client.get(key));
}

async function redisDelData(key: string) {
  await client.del(key, () => { });
}

export { redisWriteData, redisGetData, redisDelData };
