# Twilio TaskRouter TaskQueue Wait Times

## Using Serverless Node.js and Redis

## Overview

The purpose of this project is to address the need for a high volume contact center to calculate wait times within the Twilio TaskRouter ecosystem. Due to various limitations within Twilio (API rate limite, Serverless Function timeout limits, API request limits, etc.) we need to move this funcionality out of Twilio and make it faster to retrieve with less chance of a timeout or error.

## How

In this example we will use AWS to set up our enviornment; however, this could technically be built in any combination of services that allow you to run serverless code and build a Redis database. What we'll need in AWS:

- AWS Lambda to run Node.js code and communcate with the Twilio API.
- AWS CloudWatch to [schedule running a Lambda function](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/RunLambdaSchedule.html).
- AWS Elasticache, specifically Redis, to store TaskRouter TaskQueue wait time data.

### High Level Flow Overview

#### TaskRouter Wait Time Storage

The [cache-queue-time.js](https://github.com/jmadden/Twilio-TaskQueue-WaitTime-at-Scale/blob/main/cache-queue-times.js) file holds the code to be used in Lambda to run every two minutes to push all TaskQueue wait times in to a Redis data store.

1. CloudWatch runs a Lambda function every 2 minutes.
2. The Lambda function uses the Twilio TaskRouter API to retrieve a list of TaskQueues.
3. The Lambda function then uses the TaskQueue SIDs to query the builds a JSON object of TaskQueues, their respective wait times, and a timestamp that looks like this:

   ```json
   queues: {
     WQxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx: { waittime: 0, timestamp: '2022-01-25T21:49:52.812Z' },
     WQxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx: { waittime: 0, timestamp: '2022-01-25T21:49:53.319Z' },
     WQxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx: { waittime: 0, timestamp: '2022-01-25T21:49:54.006Z' },
     WQxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx: { waittime: 0, timestamp: '2022-01-25T21:49:54.661Z' }
   }
   ```

4. The JSON object is console logged so there is a persistent record of the object in AWS Lambda logs.
5. The JSON object is then converted into a string and saved to the Redis instance in Elasticache.

#### Wait Time Retrieval

The Wait Time will be retrieved by a Twilio Studio [Make HTTP Request](https://www.twilio.com/docs/studio/widget-library/http-request) widget. The TaskQueue a call is going to be routed to is determined in the Studio Flow during an incoming call. This data will be used to retrieve the TaskQueue wait time.

This code has been written as a [Twilio Serverless function named get-queue-times.js](https://github.com/jmadden/Twilio-TaskQueue-WaitTime-at-Scale/blob/main/queue-wait-time/functions/get-queue-times.js) for easier local development. It should be able to be easily converted into a Lambda function.

1. When the appropriate TaskQueue is determined during a Studio Flow execution, the name of the TaskQueue is passed into a Function widget.
2. The Function widget uses a Twilio Function to retrieve a static JSON object stored in Assets. The JSON object is a copy of the TaskRouter Workflow config.
3. The Function finds the TaskQueue SID in the JSON object and passes it back to the Studio Flow.
4. The Studio Flow then uses the Make HTTP Request widget to make a GET request of the AWS Lambda function that is responsible for retrieving TaskQueue wait time from Redis.

   - The GET request will have the TaskQueue SID appended to the end of the URL so the proper TaskQueue wait time can be retrieved.

5. The Lambda function retrieves the `queues` key/value from Redis.
6. The Lambda function then converts the `queues` value string into a JSON object and retrieves the correct wait time based on the provided TaskQueue SID.
7. The wait time is then added to the [Enqueue Call widget](https://www.twilio.com/docs/studio/widget-library/enqueue-call) in the Hold Music TwiML URL as a parameter to be used in the hold music logic.
