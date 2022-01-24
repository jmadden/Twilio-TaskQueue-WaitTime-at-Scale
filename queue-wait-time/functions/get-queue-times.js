require('dotenv').config();
exports.handler = async (context, event, callback) => {
  const { getQueueTimes } = require('../../utils/RedisUtils');
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WORKSPACE_SID } =
    process.env;

  const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  const getQueueWaitTime = async (queueSid) => {
    const queueTimes = await getQueueTimes();
    const queueTimesObj = await JSON.parse(queueTimes);
    console.log('Queue Wait Times: ', queueTimesObj);
    return queueTimesObj.queues[queueSid]['waittime'];
  };

  const response = new Twilio.Response();
  // Set the status code to 200 OK
  response.setStatusCode(200);
  // Set the response body
  const time = await getQueueWaitTime(event.queueSid);

  response.setBody(`${time}`);

  return callback(null, response);
};
