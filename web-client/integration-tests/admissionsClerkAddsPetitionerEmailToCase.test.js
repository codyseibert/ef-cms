import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  fakeFile,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
} from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

const test = setupTest();

describe('admissions clerk adds petitioner with existing cognito email to case', () => {
  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

  const EMAIL_TO_ADD = 'petitioner2@example.com';

  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(test, fakeFile);

  loginAs(test, 'admissionsclerk@example.com');
  it('admissions clerk adds petitioner email to case', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoEditPetitionerInformationSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('EditPetitionerInformation');
    expect(test.getState('form.email')).toBeUndefined();
    expect(test.getState('form.confirmEmail')).toBeUndefined();

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.email',
      value: EMAIL_TO_ADD,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.confirmEmail',
      value: EMAIL_TO_ADD,
    });

    await test.runSequence('updatePetitionerInformationFormSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('modal.showModal')).toBe('MatchingEmailFoundModal');
    expect(test.getState('currentPage')).toEqual('EditPetitionerInformation');

    await test.runSequence('submitMatchingEmailFoundModalSequence');

    expect(test.getState('modal.showModal')).toBeUndefined();
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    expect(test.getState('caseDetail.contactPrimary.email')).toEqual(
      EMAIL_TO_ADD,
    );
    expect(test.getState('caseDetail.contactPrimary.serviceIndicator')).toEqual(
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );

    await refreshElasticsearchIndex();
  });

  loginAs(test, 'petitioner2@example.com');
  it('petitioner with existing account verifies case is added to dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');

    expect(test.getState('currentPage')).toEqual('DashboardPetitioner');
    const openCases = test.getState('openCases');

    const addedCase = openCases.find(c => c.docketNumber === test.docketNumber);
    expect(addedCase).toBeDefined();
  });
});
