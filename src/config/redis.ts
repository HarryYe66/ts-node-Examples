import Redis from 'ioredis'

const redisConfig = {
  host: process.env.REDIS_HOST,
  port: 6379, // 默认 Redis 端口
  password: process.env.REDIS_PASSWORD,
}

const client = new Redis(redisConfig)

client.on('error', (err) => {
  console.error('Redis error:', err)
})

client.on('connect', () => {
  console.log('Connected to Redis')
})

/**
 * 确保与 Redis 的连接
 */
async function connectRedis() {
  if (!client.status || client.status !== 'ready') {
    await client.connect().catch((err) => {
      console.error('Redis connection error:', err)
    })
  }
}

/**
 * 获取指定键的值
 * @param key 键
 * @returns 值
 */
async function getAsync(key: string): Promise<string | null> {
  await connectRedis()
  try {
    return client.get(key) || null
  } catch (error) {
    console.log('Redis get error:', error)
    return null
  }
}

/**
 * 设置指定键的值，并指定过期时间
 * @param key 键
 * @param value 值
 * @param expireInSeconds 过期时间（秒）
 */
async function setAsync(
  key: string,
  value: string,
  expireInSeconds: number | null = null
): Promise<void> {
  await connectRedis()
  try {
    if (expireInSeconds !== null) {
      await client.set(key, value, 'EX', expireInSeconds)
    } else {
      await client.set(key, value)
    }
  } catch (error) {
    console.error('Redis set error:', error)
  }
}

/**
 * 自增指定键的值
 * @param key 键
 * @returns 自增后的值
 */
async function incrAsync(key: string): Promise<number> {
  await connectRedis()
  const result = await client.incr(key)
  return Number(result)
}

/**
 * 获取有序集合中指定范围的成员（降序）
 * @param key 键
 * @param start 起始位置
 * @param stop 结束位置
 * @returns 成员列表和分数
 */
async function zrevrangeAsync(
  key: string,
  start: number,
  stop: number
): Promise<string[]> {
  await connectRedis()
  return client.zrevrange(key, start, stop, 'WITHSCORES')
}

/**
 * 增加有序集合中指定成员的分数
 * @param key 键
 * @param increment 增量
 * @param member 成员
 * @returns 增加后的分数
 */
async function zincrbyAsync(
  key: string,
  increment: number,
  member: string
): Promise<number> {
  await connectRedis()
  const result = await client.zincrby(key, increment, member)
  return Number(result)
}

/**
 * 获取有序集合中指定成员的排名（升序）
 * @param key 键
 * @param member 成员
 * @returns 排名
 */
async function zrankAsync(key: string, member: string): Promise<number | null> {
  await connectRedis()
  const result = await client.zrank(key, member)
  return result !== null ? Number(result) : null
}

/**
 * 获取有序集合中指定成员的分数
 * @param key 键
 * @param member 成员
 * @returns 分数
 */
async function zscoreAsync(
  key: string,
  member: string
): Promise<string | null> {
  await connectRedis()
  const result = await client.zscore(key, member)
  return result
}

/**
 * 获取有序集合中指定成员的排名（降序）
 * @param key 键
 * @param member 成员
 * @returns 排名
 */
async function zrevrankAsync(
  key: string,
  member: string
): Promise<number | null> {
  await connectRedis()
  const result = await client.zrevrank(key, member)
  return result !== null ? Number(result) : null
}

/**
 * 删除指定键
 * @param key 键
 */
async function delAsync(key: string): Promise<void> {
  await connectRedis()
  await client.del(key)
}

/**
 * 获取符合模式的键列表
 * @param pattern 模式
 * @returns 键列表
 */
async function keysAsync(pattern: string): Promise<string[]> {
  await connectRedis()
  const result = await client.keys(pattern)
  return result
}

/**
 * 获取有序集合中的元素数量
 * @param key Redis 有序集合的键
 * @returns 有序集合中的元素数量
 */
async function zcardAsync(key: string): Promise<number> {
  await connectRedis()
  return client.zcard(key)
}

/**
 * 将成员添加到有序集合中
 * @param key 键
 * @param score 分数
 * @param member 成员
 * @returns 添加结果
 */
async function zaddAsync(
  key: string,
  score: number,
  member: string
): Promise<number> {
  await connectRedis()
  return client.zadd(key, score, member)
}

/**
 * 获取有序集合中指定分数范围的成员数量
 * @param key 键
 * @param min 最小分数
 * @param max 最大分数
 * @returns 成员数量
 */
async function zcountAsync(
  key: string,
  min: string | number,
  max: string | number
): Promise<number> {
  await connectRedis()
  return client.zcount(key, min, max)
}

export {
  client,
  connectRedis,
  getAsync,
  setAsync,
  incrAsync,
  zrevrangeAsync,
  zincrbyAsync,
  zrankAsync,
  zscoreAsync,
  zrevrankAsync,
  delAsync,
  keysAsync,
  zcardAsync,
  zaddAsync,
  zcountAsync,
}
