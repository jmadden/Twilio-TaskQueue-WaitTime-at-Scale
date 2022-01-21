require('dotenv').config();

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WORKSPACE_SID } =
  process.env;

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Get Queue SIDS
const getQueueSids = async () => {
  let queueSids = [];
  const queues = await client.taskrouter
    .workspaces(TWILIO_WORKSPACE_SID)
    .taskQueues.list();
  queues.forEach((tq) => {
    queueSids.push(tq.sid);
  });
  return queueSids;
};

// Get wait time per queue
const getWaitTime = async (sids) => {
  let waitTimeObj = {};
  for (let index = 0; index < sids.length; index++) {
    const stats = await client.taskrouter
      .workspaces(TWILIO_WORKSPACE_SID)
      .taskQueues(sids[index])
      .cumulativeStatistics()
      .fetch();

    waitTimeObj[sids[index]] = stats.waitDurationInQueueUntilAccepted.avg;
  }
  return waitTimeObj;
};

const init = async () => {
  const queueSids = await getQueueSids();
  const waitTime = await getWaitTime(queueSids);
  console.log('Queue SIDS: ', queueSids);
  console.log('Wait Time Obj: ', waitTime);
};

init();
