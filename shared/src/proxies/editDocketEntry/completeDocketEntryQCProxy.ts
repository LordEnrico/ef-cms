import { put } from '../requests';

/**
 * completeDocketEntryQCInteractorProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.entryMetadata the entry metadata
 * @returns {Promise<*>} the promise of the api call
 */
export const completeDocketEntryQCInteractor = (
  applicationContext,
  { entryMetadata },
) => {
  const { docketNumber } = entryMetadata;
  return put({
    applicationContext,
    body: {
      entryMetadata,
    },
    endpoint: `/case-documents/${docketNumber}/docket-entry-complete`,
  });
};
