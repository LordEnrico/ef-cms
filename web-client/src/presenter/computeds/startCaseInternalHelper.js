import { showContactsHelper } from '../computeds/showContactsHelper';
import { state } from 'cerebral';

/**
 * gets the start case internal form view options based on partyType
 *
 * @param {Function} get the cerebral get function
 * @param {object} applicationContext the application context
 * @returns {object} object containing the view settings
 */
export const startCaseInternalHelper = (get, applicationContext) => {
  const { PARTY_TYPES } = applicationContext.getConstants();
  const partyType = get(state.form.partyType);
  const showContacts = showContactsHelper(partyType, PARTY_TYPES);

  let showOwnershipDisclosureStatement = false;

  if (
    [
      PARTY_TYPES.partnershipAsTaxMattersPartner,
      PARTY_TYPES.partnershipOtherThanTaxMatters,
      PARTY_TYPES.partnershipBBA,
      PARTY_TYPES.corporation,
    ].includes(partyType)
  ) {
    showOwnershipDisclosureStatement = true;
  }

  return {
    partyTypes: PARTY_TYPES,
    showOwnershipDisclosureStatement,
    showPrimaryContact: showContacts.contactPrimary,
    showSecondaryContact: showContacts.contactSecondary,
  };
};