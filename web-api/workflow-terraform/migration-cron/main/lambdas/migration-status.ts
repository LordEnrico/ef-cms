import {
  approvePendingJob,
  cancelWorkflow,
} from '../../../../../shared/admin-tools/circleci/circleci-helper';
import {
  getMetricStatistics,
  getMigrationQueueIsEmptyFlag,
  getSqsQueueCount,
  putMigrationQueueIsEmptyFlag,
} from '../../../../../shared/admin-tools/aws/migrationWaitHelper';
import type { GetMetricStatisticsOutput } from '@aws-sdk/client-cloudwatch';
import type { Handler } from 'aws-lambda';

const apiToken = process.env.CIRCLE_MACHINE_USER_TOKEN!;
const workflowId = process.env.CIRCLE_WORKFLOW_ID!;
const dlQueueUrl = `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/migration_segments_dl_queue_${process.env.STAGE}`;
const workQueueUrl = `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/migration_segments_queue_${process.env.STAGE}`;
const jobName = 'wait-for-migration';

export const handler: Handler = async (_event, context) => {
  const results: {
    dlQueueCount?: number;
    errorRate?: number;
    migrateFlag: string;
    migrationQueueIsEmptyFlag?: boolean;
    totalActiveJobs?: number;
  } = {
    migrateFlag: process.env.MIGRATE_FLAG!,
  };
  if (results.migrateFlag !== 'true') {
    await approvePendingJob({ apiToken, jobName, workflowId });
    return succeed({ context, results });
  }

  results.errorRate = await getSegmentErrorRate();
  if (results.errorRate === -1) {
    return succeed({ context, results });
  }
  if (results.errorRate > 50) {
    await cancelWorkflow({ apiToken, workflowId });
    return succeed({ context, results });
  }

  results.dlQueueCount = await getSqsQueueCount(dlQueueUrl);
  if (results.dlQueueCount === -1) {
    return succeed({ context, results });
  }
  if (results.dlQueueCount > 0) {
    await cancelWorkflow({ apiToken, workflowId });
    return succeed({ context, results });
  }

  // it's possible the queue has caught up but there are still more segments to process
  // don't approve the job if this is the first consecutive time the queue is empty
  results.totalActiveJobs = await getSqsQueueCount(workQueueUrl);
  if (results.totalActiveJobs === -1) {
    return succeed({ context, results });
  }
  if (results.totalActiveJobs > 0) {
    await putMigrationQueueIsEmptyFlag(false);
    return succeed({ context, results });
  }

  results.migrationQueueIsEmptyFlag = await getMigrationQueueIsEmptyFlag();
  if (!results.migrationQueueIsEmptyFlag) {
    await putMigrationQueueIsEmptyFlag(true);
  } else {
    await approvePendingJob({ apiToken, jobName, workflowId });
  }
  return succeed({ context, results });
};

const getSegmentErrorRate = async (): Promise<number> => {
  let errorResponse = {};
  let invocationResponse = {};
  try {
    errorResponse = await getMetricStatistics('Errors');
    invocationResponse = await getMetricStatistics('Invocations');
  } catch (error) {
    console.log(error);
    return -1;
  }

  let errorTotal = 0;
  let invocationTotal = 0;
  try {
    errorTotal = getTotals(errorResponse);
    invocationTotal = getTotals(invocationResponse);
  } catch (error) {
    console.log('Response from AWS did not match expected structure.');
    console.error(error);
    return -1;
  }

  if (invocationTotal > 0) {
    console.log(`There were ${errorTotal} errors in the last 15 minutes.`);
    console.log(
      `There were ${invocationTotal} invocations in the last 15 minutes.`,
    );
    const errorRate = (errorTotal * 100) / invocationTotal;
    console.log(`There were ${errorRate}% errors in the last 15 minutes.`);
    return errorRate;
  }
  return 0;
};

const getTotals = (response: GetMetricStatisticsOutput): number => {
  let total = 0;
  if (response && 'Datapoints' in response && response.Datapoints) {
    for (const datapoint of response.Datapoints) {
      if (datapoint && 'Sum' in datapoint && datapoint.Sum) {
        total += Number(datapoint.Sum);
      }
    }
  } else {
    throw new Error('Unexpected GetMetricStatisticsOutput object structure');
  }
  return total;
};

const succeed = ({ context, results }) => {
  console.log(results);
  return context.succeed(results);
};
