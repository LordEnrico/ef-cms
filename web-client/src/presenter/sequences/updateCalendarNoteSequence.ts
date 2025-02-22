import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { saveCalendarNoteAction } from '../actions/TrialSession/saveCalendarNoteAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { updateTrialSessionInTrialSessionsAction } from '../actions/updateTrialSessionInTrialSessionsAction';
import { validateCalendarNoteAction } from '../actions/validateCalendarNoteAction';

export const updateCalendarNoteSequence = [
  validateCalendarNoteAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      clearAlertsAction,
      saveCalendarNoteAction,
      updateTrialSessionInTrialSessionsAction,
      setAlertSuccessAction,
      clearModalAction,
      clearModalStateAction,
    ]),
  },
];
