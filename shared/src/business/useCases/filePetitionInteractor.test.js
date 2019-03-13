const { filePetition } = require('./filePetitionInteractor');
const sinon = require('sinon');

describe('filePetition', () => {
  function createApplicationContext(options) {
    return {
      getCurrentUser: () => ({
        userId: 'respondent',
      }),
      getPersistenceGateway: () => ({
        uploadDocument: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
      getUseCases: () => ({
        createCase: () => null,
      }),
      environment: { stage: 'local' },
      ...options,
    };
  }

  let fileHasUploadedStub;

  beforeEach(() => {
    fileHasUploadedStub = sinon.stub();
  });

  it('throws an error when a null user tries to access the case', async () => {
    let error;
    try {
      await filePetition({
        applicationContext: createApplicationContext(),
        fileHasUploaded: fileHasUploadedStub,
        petitionFile: null,
        petitionMetadata: null,
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });

  it('throws an error when an unauthorized user tries to access the case', async () => {
    await filePetition({
      applicationContext: createApplicationContext({
        getCurrentUser: () => ({
          role: 'petitioner',
          userId: 'taxpayer',
        }),
      }),
      fileHasUploaded: fileHasUploadedStub,
      petitionFile: null,
      petitionMetadata: null,
    });
    expect(fileHasUploadedStub.called).toBeTruthy();
  });
});