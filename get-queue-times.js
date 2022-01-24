require('dotenv').config();
const { getQueueTimes } = require('./utils/RedisUtils');
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WORKSPACE_SID } =
  process.env;

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const getQueueWaitTime = async (queueSid) => {
  const queueTimes = await getQueueTimes();
  const queueTimesObj = await JSON.parse(queueTimes);
  return queueTimesObj.queues[queueSid]['waittime'];
};

const init = async () => {
  const queue = await getQueueWaitTime('WQ4da031327e9c3081b9b567aefe5a411e');
  console.log('Wait Time:', queue);
};

init();
