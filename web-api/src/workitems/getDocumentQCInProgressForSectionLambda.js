const { genericHandler } = require('../genericHandler');

/**
 * returns all in progress work items in a particular section
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getDocumentQCInProgressForSectionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { section } = event.pathParameters || {};

    return await applicationContext
      .getUseCases()
      .getDocumentQCInProgressForSectionInteractor(applicationContext, {
        section,
        ...event.queryStringParameters,
      });
  });
