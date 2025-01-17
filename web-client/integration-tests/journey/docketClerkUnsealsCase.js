import { refreshElasticsearchIndex } from '../helpers';

export const docketClerkUnsealsCase = cerebralTest => {
  return it('Docketclerk seals a case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('caseDetail.sealedDate')).toBeDefined();
    expect(cerebralTest.getState('caseDetail.isSealed')).toBeTruthy();

    await cerebralTest.runSequence('unsealCaseSequence');

    expect(cerebralTest.getState('caseDetail.sealedDate')).not.toBeDefined();
    expect(cerebralTest.getState('caseDetail.isSealed')).toBeFalsy();

    await refreshElasticsearchIndex();
  });
};
