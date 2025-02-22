import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { getFileExternalDocumentAlertSuccessAction } from '../actions/FileDocument/getFileExternalDocumentAlertSuccessAction';
import { getPrintableFilingReceiptSequence } from './getPrintableFilingReceiptSequence';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { prepareUploadExternalDocumentsAction } from '@web-client/presenter/actions/FileDocument/prepareUploadExternalDocumentsAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setProgressForFileUploadAction } from '../actions/setProgressForFileUploadAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { submitRespondentCaseAssociationRequestAction } from '../actions/FileDocument/submitRespondentCaseAssociationRequestAction';
import { uploadExternalDocumentsAction } from '../actions/FileDocument/uploadExternalDocumentsAction';

const onSuccess = [
  submitRespondentCaseAssociationRequestAction,
  setCaseAction,
  closeFileUploadStatusModalAction,
  getPrintableFilingReceiptSequence,
  getFileExternalDocumentAlertSuccessAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  navigateToCaseDetailAction,
];

export const submitExternalDocumentSequence = showProgressSequenceDecorator([
  openFileUploadStatusModalAction,
  prepareUploadExternalDocumentsAction,
  setProgressForFileUploadAction,
  uploadExternalDocumentsAction,
  {
    error: [openFileUploadErrorModal],
    success: onSuccess,
  },
]);
