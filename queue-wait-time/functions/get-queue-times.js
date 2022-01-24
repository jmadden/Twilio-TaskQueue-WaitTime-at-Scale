require('dotenv').config();
exports.handler = async (context, event, callback) => {
  const { getQueueTimes } = require('../../utils/RedisUtils');
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WORKSPACE_SID } =
    process.env;

  const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  const getQueueWaitTime = async (queueSid) => {
    const queueTimes = await getQueueTimes();
    const queueTimesObj = await JSON.parse(queueTimes);
    return queueTimesObj.queues[queueSid]['waittime'];
  };

  const time = await getQueueWaitTime(event.queueSid);
  console.log('Wait time in seconds: ', time);

  return callback(null, `${time}`);
};
