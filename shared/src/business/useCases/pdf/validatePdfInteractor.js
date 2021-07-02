const { StringDecoder } = require('string_decoder');

const removePdf = async ({
  applicationContext,
  key,
  message = 'PDF Error',
}) => {
  applicationContext.logger.debug(`${message}: Deleting from S3`, key);
  await applicationContext.getPersistenceGateway().deleteDocumentFromS3({
    applicationContext,
    key,
  });
};

exports.removePdf = removePdf;

/**
 * normalizePdfInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.key the key of the document to validate
 * @returns {object} errors (null if no errors)
 */
const normalizePdf = async ({ applicationContext, key, pdfDoc }) => {
  const { PageSizes, PDFDocument } = await applicationContext.getPdfLib();
  const [MAX_PAGE_WIDTH] = PageSizes.Letter;

  const pdfPages = pdfDoc.getPages();
  const needsResize = pdfPages.some(
    page => page.getSize().width > MAX_PAGE_WIDTH,
  );

  if (!needsResize) {
    return true;
  }

  pdfPages.forEach(page => {
    const { height, width } = page.getSize();
    if (width > MAX_PAGE_WIDTH) {
      const scaleRatio = MAX_PAGE_WIDTH / width;
      scaleContent(page, MAX_PAGE_WIDTH, height * scaleRatio);
    }
  });

  const scaledPdfData = await pdfDoc.save();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: scaledPdfData,
    key,
  });
};

// scales the content of the page (not annotations)
/**
 *
 */
function scaleContent(page, x, y) {
  // load dependencies
  const { popGraphicsState, pushGraphicsState, scale } = require('pdf-lib');

  page.node.normalize();
  page.getContentStream();

  const start = page.createContentStream(pushGraphicsState(), scale(x, y));
  const startRef = page.doc.context.register(start);

  const end = page.createContentStream(popGraphicsState());
  const endRef = page.doc.context.register(end);

  page.node.wrapContentStreams(startRef, endRef);
}

/**
 * validatePdfInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.key the key of the document to validate
 * @returns {object} errors (null if no errors)
 */
exports.validatePdfInteractor = async (applicationContext, { key }) => {
  let { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: key,
    })
    .promise();

  const stringDecoder = new StringDecoder('utf8');
  const pdfHeaderBytes = pdfData.slice(0, 5);
  const pdfHeaderString = stringDecoder.write(pdfHeaderBytes);

  applicationContext.logger.debug('pdfHeaderBytes', pdfHeaderBytes);
  applicationContext.logger.debug('pdfHeaderString', pdfHeaderString);

  let pdfIsEncrypted = false;

  const { PDFDocument } = await applicationContext.getPdfLib();

  const pdfDoc = await PDFDocument.load(pdfData, { ignoreEncryption: true });
  pdfIsEncrypted = pdfDoc.isEncrypted;

  applicationContext.logger.debug('pdfIsEncrypted', pdfIsEncrypted);

  if (pdfIsEncrypted || pdfHeaderString !== '%PDF-') {
    await removePdf({
      applicationContext,
      key,
      message: 'PDF Invalid',
    });

    throw new Error('invalid pdf');
  }

  try {
    pdfDoc.getPages();
  } catch (e) {
    await removePdf({
      applicationContext,
      key,
      message: 'PDF Pages Unreadable',
    });

    throw new Error('pdf pages cannot be read');
  }

  // await normalizePdf({ applicationContext, key, pdfDoc });

  return true;
};
