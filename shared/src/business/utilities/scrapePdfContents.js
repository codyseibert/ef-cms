const { isEmpty } = require('lodash');

/**
 * scrapes the text content out of a pdf
 *
 * @param {string} pdfBuffer the buffer for the pdf content
 * @returns {Promise} the template with the brackets replaced with replacement values
 */
const scrapePdfContents = async ({ applicationContext, pdfBuffer }) => {
  let pdfjsLib;

  try {
    pdfjsLib = await applicationContext.getPdfJs();

    const document = await pdfjsLib.getDocument(pdfBuffer).promise;

    let scrapedText = '';

    for (let i = 1; i <= document.numPages; i++) {
      const page = await document.getPage(i);
      const pageTextContent = await page.getTextContent({
        disableCombineTextItems: true, // TODO interesting...
        // enableCombineItems: true
        normalizeWhitespace: true, // TODO: hmm
      });

      let lastY = null,
        pageText = '';

      for (let item of pageTextContent.items.slice(0, 10)) {
        pageText += item.str;
        console.log(item);
        // if (item.hasEOL) {
        //   pageText += '~~~' + item.str;
        // } else {
        //   pageText += ' ' + item.str;
        // }
        // // lastY = item.transform[5];
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

//   Home Latest Worship Information News  the presiding minister
