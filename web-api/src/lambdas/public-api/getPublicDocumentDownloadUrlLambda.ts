import { genericHandler } from '../../genericHandler';

/**
 * used for fetching a single case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getPublicDocumentDownloadUrlLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .getPublicDownloadPolicyUrlInteractor(applicationContext, {
          ...event.pathParameters,
          isTerminalUser: event.isTerminalUser,
        });
    },
    { user: {} },
  );
