import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsAndServesDocketEntryFromOrderOfAmendedPetition } from '../integration-tests/journey/docketClerkAddsAndServesDocketEntryFromOrderOfAmendedPetition';
import { docketClerkCreatesAnOrder } from '../integration-tests/journey/docketClerkCreatesAnOrder';
import { docketClerkSignsOrder } from '../integration-tests/journey/docketClerkSignsOrder';
import { docketClerkViewsCaseDetail } from '../integration-tests/journey/docketClerkViewsCaseDetail';
import { docketClerkViewsDraftOrder } from '../integration-tests/journey/docketClerkViewsDraftOrder';
import {
  loginAs,
  setupTest,
  uploadPetition,
} from '../integration-tests/helpers';

const cerebralTest = setupTest();
describe('create test orders', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  cerebralTest.draftOrders = [];
  // cerebralTest.docketNumber = '121-20';
  const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Cupertino',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Tim Apple',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  docketClerkCreatesAnOrder(cerebralTest, {
    documentContents: 'Yadadada',
    documentTitle: 'Foofoofoo',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(cerebralTest, 0);
  docketClerkSignsOrder(cerebralTest, 0);
  docketClerkAddsAndServesDocketEntryFromOrderOfAmendedPetition(
    cerebralTest,
    0,
  );
  docketClerkViewsCaseDetail(cerebralTest);

  it('shares docket number', () => {
    console.log(cerebralTest.docketNumber);
  });
});
