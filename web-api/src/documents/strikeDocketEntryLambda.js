const { genericHandler } = require('../genericHandler');

/**
 * used for striking docket records
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.strikeDocketEntryLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const {
      pathParameters: { docketEntryId, docketNumber },
    } = event;

    return await applicationContext
      .getUseCases()
      .strikeDocketEntryInteractor(applicationContext, {
        docketEntryId,
        docketNumber,
      });
  });
