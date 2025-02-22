import { OBJECTIONS_OPTIONS_MAP } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsPaperFiledDocketEntryAndSavesForLater } from './journey/docketClerkAddsPaperFiledDocketEntryAndSavesForLater';
import { docketClerkServesDocumentFromCaseDetailDocumentView } from './journey/docketClerkServesDocumentFromCaseDetailDocumentView';
import { docketClerkViewsCaseDetailDocumentView } from './journey/docketClerkViewsCaseDetailDocumentView';
import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';

describe('Docket Clerk Serves Paper Filed Document From Case Detail Documents View', () => {
  const cerebralTest = setupTest();

  cerebralTest.draftOrders = [];

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk1@example.com');

  const documentFormValues = {
    dateReceivedDay: 1,
    dateReceivedMonth: 1,
    dateReceivedYear: 2018,
    eventCode: 'M115',
    objections: OBJECTIONS_OPTIONS_MAP.NO,
    primaryDocumentFile: fakeFile,
    primaryDocumentFileSize: 100,
    'secondaryDocument.addToCoversheet': true,
    'secondaryDocument.additionalInfo': 'Test Secondary Additional Info',
    'secondaryDocument.eventCode': 'APPW',
    secondaryDocumentFile: fakeFile,
    secondaryDocumentFileSize: 100,
  };

  docketClerkAddsPaperFiledDocketEntryAndSavesForLater({
    cerebralTest,
    documentFormValues,
    expectedDocumentType: 'Motion for Leave to File',
  });
  docketClerkServesDocumentFromCaseDetailDocumentView(cerebralTest);
  docketClerkViewsCaseDetailDocumentView(cerebralTest);
});
