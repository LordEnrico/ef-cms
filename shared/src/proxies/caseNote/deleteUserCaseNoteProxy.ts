import { remove } from '../requests';

/**
 * deleteUserCaseNoteInteractorProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number to delete note from
 * @returns {Promise<*>} the promise of the api call
 */
export const deleteUserCaseNoteInteractor = (
  applicationContext,
  { docketNumber },
) => {
  return remove({
    applicationContext,
    endpoint: `/case-notes/${docketNumber}/user-notes`,
  });
};
