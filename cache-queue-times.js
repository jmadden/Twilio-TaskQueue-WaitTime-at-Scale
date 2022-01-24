require('dotenv').config();
const { saveToRedis } = require('./utils/RedisUtils');
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WORKSPACE_SID } =
  process.env;

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Get Queue SIDS
const getQueueSids = async () => {
  try {
    let queueSids = [];
    const queues = await client.taskrouter
      .workspaces(TWILIO_WORKSPACE_SID)
      .taskQueues.list();
    queues.forEach((tq) => {
      queueSids.push(tq.sid);
    });
    return queueSids;
  } catch (error) {
    console.error('Failed to retrieve list of TaskQueue SIDs.', error);
  }
};

// Get wait time per queue
const getWaitTimes = async (sids) => {
  try {
    let waitTimeObj = { queues: {} };
    for (let index = 0; index < sids.length; index++) {
      const stats = await client.taskrouter
        .workspaces(TWILIO_WORKSPACE_SID)
        .taskQueues(sids[index])
        .cumulativeStatistics()
        .fetch();
      const timeElapsed = Date.now();
      const today = new Date(timeElapsed);
      waitTimeObj.queues[sids[index]] = {
        waittime: stats.waitDurationInQueueUntilAccepted.avg,
        timestamp: today.toISOString(),
      };
    }
    console.log('Queue Wait Times: ', waitTimeObj);
    const queueTimes = JSON.stringify(waitTimeObj);
    return queueTimes;
  } catch (error) {
    console.error('Failed to retrieve TaskQueue wait times.', error);
  }
};

const init = async () => {
  const queueSids = await getQueueSids();
  const waitTimes = await getWaitTimes(queueSids);
  saveToRedis(waitTimes);
  console.log('Queue SIDS: ', queueSids);
};

init();
