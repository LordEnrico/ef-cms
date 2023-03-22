const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const coverSheet = async ({ applicationContext, data }) => {
  const coverSheetTemplate = reactTemplateGenerator({
    componentName: 'CoverSheet',
    data,
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: coverSheetTemplate,
  });

  let footerHtml = '';
  if (data.dateServed) {
    footerHtml = reactTemplateGenerator({
      componentName: 'DateServedFooter',
      data: {
        dateServed: data.dateServed,
      },
    });
  }

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: data.docketNumberWithSuffix,
      footerHtml,
      headerHtml: '',
    });

  return pdf;
};

module.exports = {
  coverSheet,
};