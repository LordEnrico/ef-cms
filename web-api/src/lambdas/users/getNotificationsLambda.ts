import { genericHandler } from '../../genericHandler';

/**
 * creates a new document and attaches it to a case.  It also creates a work item on the docket section.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getNotificationsLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getNotificationsInteractor(applicationContext, {
        ...event.queryStringParameters,
      });
  });
