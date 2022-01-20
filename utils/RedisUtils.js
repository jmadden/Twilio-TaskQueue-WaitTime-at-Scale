class RedisUtils {
  constructor(redisClient) {
    this.redisClient = redisClient;
  }

  async deleteQueue(queueName) {
    await this.redisClient.del(queueName);
  }

  async pushItem(queueName, data, priority) {
    await this.redisClient.zadd(queueName, priority, data);
  }

  async popItem(queueName) {
    const poppedItem = await this.redisClient.bzpopmax(queueName, 1);
    return poppedItem;
  }

  async removeItem(queueName, data) {
    return await this.redisClient.zrem(queueName, data);
  }

  async findItemIndex(queueName, data) {
    return await this.redisClient.zrevrank(queueName, data);
  }

  async findItemScore(queueName, data) {
    return await this.redisClient.zscore(queueName, data);
  }

  async listItemsBetweenScores(queueName, begin, end) {
    return await this.redisClient.zrangebyscore(queueName, begin, end);
  }

  async getQueueItems(queueName) {
    //return await this.redisClient.zrange(queueName,0,-1,"WITHSCORES")
    return await this.redisClient.zrangebyscore(
      queueName,
      '-inf',
      '+inf',
      'WITHSCORES'
    );
  }
}
module.exports = RedisUtils;
