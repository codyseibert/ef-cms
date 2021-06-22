const fs = require('fs');
const path = require('path');
const testAssetsPath = path.join(__dirname, '../../../test-assets/');
const { scrapePdfContents } = require('./scrapePdfContents');

const testAsset = filename => {
  return fs.readFileSync(testAssetsPath + filename);
};

describe('pdf things', () => {
  it('does things', async () => {
    const pdfBuffer = testAsset('worship.pdf');
    const applicationContext = {
      getPdfJs: async () => {
        const pdfjsLib = require('../../../../node_modules/pdfjs-dist/legacy/build/pdf');
        pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.js';
        return pdfjsLib;
      },
    };
    const result = await scrapePdfContents({ applicationContext, pdfBuffer });
    console.log('The results are', result);
    expect(true).toBe(true);
  });
});
