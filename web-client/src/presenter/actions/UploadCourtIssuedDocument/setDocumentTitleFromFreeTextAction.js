import { state } from 'cerebral';

/**
 * sets the documentTitle using the freeText
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.get the get function
 */
export const setDocumentTitleFromFreeTextAction = ({ get, store }) => {
  store.set(state.form.documentTitle, get(state.form.freeText));
};