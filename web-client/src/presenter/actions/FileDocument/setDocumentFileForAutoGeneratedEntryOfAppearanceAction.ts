import { state } from '@web-client/presenter/app.cerebral';

export const setDocumentFileForAutoGeneratedEntryOfAppearanceAction = async ({
  get,
  store,
}: ActionProps) => {
  const primaryDocumentFile = get(state.form.primaryDocumentFile);
  const pdfPreviewUrl = get(state.pdfPreviewUrl);
  store.set(state.fileUploadProgress.isUploading, true);
  if (pdfPreviewUrl) {
    const file = await fetch(pdfPreviewUrl).then(async response => {
      const blob = await response.blob();
      return new File(
        [blob],
        primaryDocumentFile ? primaryDocumentFile.name : 'file.pdf',
        {
          type: blob.type,
        },
      );
    });
    store.set(state.form.primaryDocumentFile, file);
  }
};
