import {
  COURT_ISSUED_EVENT_CODES,
  SERVICE_INDICATOR_TYPES,
} from '../../entities/EntityConstants';
import { Case } from '../../entities/cases/Case';
import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { getCaseCaptionMeta } from '../../utilities/getCaseCaptionMeta';

export type ServeThirtyDayNoticeRequest = {
  trialSessionId: string;
};

export const serveThirtyDayNoticeInteractor = async (
  applicationContext: IApplicationContext,
  request: ServeThirtyDayNoticeRequest,
): Promise<void> => {
  const currentUser = applicationContext.getCurrentUser();

  if (!isAuthorized(currentUser, ROLE_PERMISSIONS.DIMISS_NOTT_REMINDER)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (!request.trialSessionId) {
    throw new InvalidRequest('No trial Session Id provided');
  }

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId: request.trialSessionId,
    });

  const { PDFDocument } = await applicationContext.getPdfLib();
  const paperServicePdf = await PDFDocument.create();
  const thirtyDayNoticeDocumentInfo = COURT_ISSUED_EVENT_CODES.find(
    doc => doc.eventCode === 'NOTT',
  );

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'paper_service_started',
      totalPdfs: trialSession.caseOrder.length, // make message identical when sent.
    },
    userId: currentUser.userId,
  });

  let pdfsAppended: number = 0;
  let hasPaperService = false;
  for (const aCase of trialSession.caseOrder!) {
    const rawCase = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber: aCase.docketNumber,
      });
    const caseEntity = new Case(rawCase, { applicationContext });

    const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta({
      caseCaption: caseEntity.caseCaption,
    });

    const noticePdf = await applicationContext
      .getDocumentGenerators()
      .thirtyDayNoticeOfTrial({
        applicationContext,
        data: {
          caseCaptionExtension,
          caseTitle,
          docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
          judgeName: trialSession.judge!.name,
          proceedingType: trialSession.proceedingType,
          scopeType: trialSession.sessionScope,
          trialDate: trialSession.startDate,
          trialLocation: {
            address1: trialSession.address1,
            address2: trialSession.address2,
            city: trialSession.city,
            courthouseName: trialSession.courthouseName,
            postalCode: trialSession.postalCode,
            state: trialSession.state,
          },
        },
      });

    await applicationContext
      .getUseCaseHelpers()
      .createAndServeNoticeDocketEntry(applicationContext, {
        caseEntity,
        documentInfo: {
          documentTitle: thirtyDayNoticeDocumentInfo!.documentTitle,
          documentType: thirtyDayNoticeDocumentInfo!.documentType,
          eventCode: thirtyDayNoticeDocumentInfo!.eventCode,
        },
        newPdfDoc: paperServicePdf,
        noticePdf,
        userId: currentUser.userId,
      });

    pdfsAppended++;
    hasPaperService =
      hasPaperService ||
      caseEntity.hasPartyWithServiceType(SERVICE_INDICATOR_TYPES.SI_PAPER);
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'paper_service_updated',
        pdfsAppended,
      },
      userId: currentUser.userId,
    });
  }

  let pdfUrl: string | undefined = undefined;
  if (hasPaperService) {
    const paperServicePdfData = await paperServicePdf.save();
    const { url } = await applicationContext
      .getUseCaseHelpers()
      .saveFileAndGenerateUrl({
        applicationContext,
        file: paperServicePdfData,
        useTempBucket: true,
      });
    pdfUrl = url;
  }

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'paper_service_complete',
      pdfUrl,
    },
    userId: currentUser.userId,
  });
};
