const { isEmpty } = require('lodash');

/**
 * scrapes the text content out of a pdf
 *
 * @param {string} pdfBuffer the buffer for the pdf content
 * @returns {Promise} the template with the brackets replaced with replacement values
 */
const scrapePdfContents = async ({ applicationContext, pdfBuffer }) => {
  let pdfjsLib;

  const neighborWordGapTolerance = 10;

  try {
    pdfjsLib = await applicationContext.getPdfJs();

    const document = await pdfjsLib.getDocument(pdfBuffer).promise;

    let scrapedText = '';

    for (let i = 1; i <= document.numPages; i++) {
      const page = await document.getPage(i);
      const pageTextContent = await page.getTextContent({
        disableCombineTextItems: false,
        normalizeWhitespace: true,
      });

      let lastY = null;
      let lastEndX = 0;
      let pageText = '';

      for (let item of pageTextContent.items) {
        const [itemX, itemY] = [item.transform[4], item.transform[5]];
        const readingNextWord = itemX - lastEndX > neighborWordGapTolerance;
        if (lastY === itemY || !lastY) {
          if (readingNextWord) {
            pageText += ' ';
          }
          pageText += item.str;
        } else {
          pageText += '\n' + item.str;
        }
        lastY = itemY;
        lastEndX = item.width + itemX;
      }

      if (!isEmpty(pageText)) {
        scrapedText += '\n\n' + pageText;
      }
    }

    return scrapedText;
  } catch (e) {
    const pdfjsVersion = pdfjsLib && pdfjsLib.version;
    throw new Error(
      `Error scraping PDF with PDF.JS v${pdfjsVersion} ${e.message}`,
    );
  }
};

exports.scrapePdfContents = scrapePdfContents;
