import { caseExistsAction } from '../actions/caseExistsAction';
import { clearSearchTermAction } from '../actions/clearSearchTermAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { navigateToCaseSearchNoMatchesAction } from '../actions/navigateToCaseSearchNoMatchesAction';
import { setCaseIdFromSearchAction } from '../actions/setCaseIdFromSearchAction';

export const submitCaseSearchSequence = [
  setCaseIdFromSearchAction,
  caseExistsAction,
  {
    error: [navigateToCaseSearchNoMatchesAction],
    success: [navigateToCaseDetailAction, clearSearchTermAction],
  },
];