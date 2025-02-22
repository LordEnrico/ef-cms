import { CaseDeadline } from '../entities/CaseDeadline';

/**
 * autoGenerateDeadline
 *
 * @param {object} applicationContext the application context
 * @param {string} providers.deadlineDate the date of the deadline to generated
 * @param {string} providers.description the description of the deadline
 * @param {Case} providers.subjectCaseEntity the subjectCaseEntity
 */
export const autoGenerateDeadline = async ({
  applicationContext,
  deadlineDate,
  description,
  subjectCaseEntity,
}) => {
  const newCaseDeadline = new CaseDeadline(
    {
      associatedJudge: subjectCaseEntity.associatedJudge,
      associatedJudgeId: subjectCaseEntity.associatedJudgeId,
      deadlineDate,
      description,
      docketNumber: subjectCaseEntity.docketNumber,
      sortableDocketNumber: subjectCaseEntity.sortableDocketNumber,
    },
    {
      applicationContext,
    },
  );

  await applicationContext.getPersistenceGateway().createCaseDeadline({
    applicationContext,
    caseDeadline: newCaseDeadline.validate().toRawObject(),
  });
};
