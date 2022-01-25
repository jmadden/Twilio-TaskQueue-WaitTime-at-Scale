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

## Setup

This
