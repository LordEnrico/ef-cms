import { post } from '../requests';

/**
 * generateTrialCalendarPdfInteractor (proxy)
 *
 * @param {object} providers the providers object
 * @param {object} applicationContext the application context
 * @param {string} providers.trialSessionId the trial session number
 * @returns {Promise<*>} the promise of the api call
 */
export const generateTrialCalendarPdfInteractor = (
  applicationContext,
  { trialSessionId },
) => {
  return post({
    applicationContext,
    body: {
      trialSessionId,
    },
    endpoint: '/reports/trial-calendar-pdf',
  });
};
