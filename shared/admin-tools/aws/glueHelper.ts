import {
  GetJobRunsCommand,
  GlueClient,
  StartJobRunCommand,
} from '@aws-sdk/client-glue';

const glueClient = new GlueClient({ region: 'us-east-1' });
const JobName = 'mock-emails';

export const FAILURE_STATES = ['ERROR', 'FAILED', 'STOPPED', 'TIMEOUT'];
export const RUNNING_STATES = ['RUNNING', 'STARTING', 'STOPPING', 'WAITING'];

export const getRunStateOfMostRecentJobRun = async (): Promise<
  string | undefined
> => {
  let mostRecentRunState;
  const getJobRunsCommand = new GetJobRunsCommand({ JobName });
  const getJobRunsResponse = await glueClient.send(getJobRunsCommand);
  if (
    'JobRuns' in getJobRunsResponse &&
    getJobRunsResponse.JobRuns &&
    'JobRunState' in getJobRunsResponse.JobRuns[0] &&
    getJobRunsResponse.JobRuns[0].JobRunState
  ) {
    mostRecentRunState = getJobRunsResponse.JobRuns[0].JobRunState;
  } else {
    console.log('Enable to read most recent job run state', getJobRunsResponse);
  }

  return mostRecentRunState;
};

export const startGlueJob = async ({
  destinationTable,
  sourceTable,
}: {
  destinationTable: string;
  sourceTable: string;
}): Promise<boolean> => {
  let glueJobStarted = false;
  const mostRecentRunState = await getRunStateOfMostRecentJobRun();
  if (mostRecentRunState && RUNNING_STATES.includes(mostRecentRunState)) {
    console.log('Not starting glue job - another glue job is already running');
    return glueJobStarted;
  }

  const startJobRunCommand = new StartJobRunCommand({
    Arguments: {
      '--destination-table': destinationTable,
      '--source-table': sourceTable,
    },
    JobName,
  });
  const startJobRunResponse = await glueClient.send(startJobRunCommand);

  if ('JobRunId' in startJobRunResponse) {
    glueJobStarted = !!startJobRunResponse.JobRunId;
  } else {
    console.log('Unable to start glue job', startJobRunResponse);
  }

  return glueJobStarted;
};
