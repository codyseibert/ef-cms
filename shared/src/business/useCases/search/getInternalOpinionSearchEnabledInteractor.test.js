const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getInternalOpinionSearchEnabledInteractor,
} = require('./getInternalOpinionSearchEnabledInteractor');

describe('getInternalOpinionSearchEnabledInteractor', () => {
  it('persistence method returns true, and interactor returns true', async () => {
    applicationContext
      .getPersistenceGateway()
      .getInternalOpinionSearchEnabled.mockResolvedValue(true);

    const result = await getInternalOpinionSearchEnabledInteractor(
      applicationContext,
    );

    expect(result).toBe(true);
  });

  it('persistence method returns false, and interactor returns false', async () => {
    applicationContext
      .getPersistenceGateway()
      .getInternalOpinionSearchEnabled.mockResolvedValue(false);

    const result = await getInternalOpinionSearchEnabledInteractor(
      applicationContext,
    );

    expect(result).toBe(false);
  });
});
