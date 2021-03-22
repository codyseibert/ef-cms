const { get } = require('../requests');

/**
 * getUsersInSectionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.section the section to get the users
 * @returns {Promise<*>} the promise of the api call
 */
exports.getUsersInSectionInteractor = (applicationContext, { section }) => {
  return get({
    applicationContext,
    endpoint: `/sections/${section}/users`,
  });
};
