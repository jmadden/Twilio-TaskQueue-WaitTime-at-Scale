require('dotenv').config();
const { getQueueTimes } = require('./utils/RedisUtils');
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WORKSPACE_SID } =
  process.env;

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
exports.handler = async (event, context, callback) => {
  console.log(event);
  const getQueueWaitTime = async (queueSid) => {
    const queueTimes = await getQueueTimes();
    const queueTimesObj = await JSON.parse(queueTimes);
    return queueTimesObj.queues[queueSid]['waittime'];
  };

  const init = async (sid) => {
    const queue = await getQueueWaitTime(sid);
    console.log('Wait Time:', queue);
    return queue;
  };

  return init();
};
