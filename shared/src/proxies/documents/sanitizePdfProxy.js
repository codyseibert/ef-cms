const { put } = require('../requests');

/**
 * sanitizePdfInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.key the key of the document to validate
 * @returns {Promise<*>} the promise of the api call
 */
exports.sanitizePdfInteractor = (applicationContext, { key }) => {
  return put({
    applicationContext,
    endpoint: `/documents/${key}/sanitize`,
  });
};
