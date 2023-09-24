import { state } from '@web-client/presenter/app.cerebral';

export const getSubmittedAndCavCasesForJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{
  cases: (RawCase & {
    daysElapsedSinceLastStatusChange: number;
    formattedCaseCount: number;
  })[];
}> => {
  const { CASE_STATUS_TYPES } = applicationContext.getConstants();

  const { name } = get(state.judgeUser);

  const { cases } = await applicationContext
    .getUseCases()
    .getCasesByStatusAndByJudgeInteractor(applicationContext, {
      judges: [name],
      statuses: [CASE_STATUS_TYPES.submitted, CASE_STATUS_TYPES.cav],
    });

  return {
    cases,
  };
};