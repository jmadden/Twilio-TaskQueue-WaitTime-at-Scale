const parseEvent = (req) => {
  const { name: eventName } = req[0].data;

  const {
    task_queue_sid: taskQueueSid,
    task_attributes: taskAttributesString,
    task_age: taskAge,
    task_priority: taskPriority,
    task_date_created: createdDate,
  } = req[0].data.payload;

  const createdDateTimestamp = new Date(createdDate) / 1000;
  const taskAttributes = JSON.parse(taskAttributesString);
  let taskUniqueId;
  if (taskAttributes.channelSid != null) {
    taskUniqueId = taskAttributes.channelSid;
  } else if (taskAttributes.conversationSid != null) {
    taskUniqueId = taskAttributes.conversationSid;
  } else if (taskAttributes.callSid != null) {
    taskUniqueId = taskAttributes.callSid;
  }

  return {
    eventName,
    createdDateTimestamp,
    taskQueueSid,
    taskUniqueId,
    taskAge,
    taskPriority,
  };
};

module.exports = {
  parseEvent,
};
