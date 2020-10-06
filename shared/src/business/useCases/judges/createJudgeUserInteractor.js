const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

/**
 * createJudgeUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
exports.createJudgeUserInteractor = async ({ applicationContext, user }) => {
  const requestUser = applicationContext.getCurrentUser();

  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.ADD_EDIT_JUDGE_USER)) {
    throw new UnauthorizedError('Unauthorized for creating judge user');
  }

  const judge = new User(user, { applicationContext }).validate().toRawObject();

  const createdUser = await applicationContext
    .getPersistenceGateway()
    .createUser({
      applicationContext,
      user: judge,
    });

  return createdUser;
};