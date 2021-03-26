import {
  ADVANCED_SEARCH_TABS,
  PARTY_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  loginAs,
  setupTest as setupTestClient,
  uploadPetition,
} from '../integration-tests/helpers';
import { petitionsClerkServesElectronicCaseToIrs } from '../integration-tests/journey/petitionsClerkServesElectronicCaseToIrs';
import { setupTest } from './helpers';
import { unauthedUserNavigatesToPublicSite } from './journey/unauthedUserNavigatesToPublicSite';
import faker from 'faker';

const test = setupTest();
const testClient = setupTestClient();
const { COUNTRY_TYPES } = applicationContext.getConstants();

testClient.draftOrders = [];

const firstName = faker.name.firstName();

const baseContact = {
  address1: '734 Cowley Parkway',
  city: 'Somewhere',
  countryType: COUNTRY_TYPES.DOMESTIC,
  name: firstName,
  phone: '+1 (884) 358-9729',
  postalCode: '77546',
  state: 'CT',
};

const createdDocketNumbers = [];

const searchTerm = `${firstName}`;

// case 1 has contact primay name that matches case 2 contactsecodary name
//search for name, case 1 should shw up before case 2

//create a case with contact primary name 'X'
//create a case with contact secondary with name 'X'
//do a case search by petitioner name with value 'X'
//expect case 1 is first on the list
//expect case 2 iss second on list

/**
 * add a case with the contactSecondary.name provided
 */
describe('Petitioner creates cases', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(testClient, 'petitioner@example.com');

  // todo - loop!
  it('Create case with contactSecondary name matching search term', async () => {
    const caseDetail = await uploadPetition(testClient, {
      contactSecondary: { ...baseContact },
      partyType: PARTY_TYPES.petitionerSpouse,
    });

    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
    testClient.docketNumber = caseDetail.docketNumber;
    createdDocketNumbers.push(caseDetail.docketNumber);
  });

  loginAs(testClient, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(testClient);

  it('Create case with contactSecondary name matching search term', async () => {
    const caseDetail = await uploadPetition(testClient, {
      contactSecondary: { ...baseContact },
      partyType: PARTY_TYPES.petitionerSpouse,
    });

    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
    testClient.docketNumber = caseDetail.docketNumber;
    createdDocketNumbers.push(caseDetail.docketNumber);
  });

  loginAs(testClient, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(testClient);

  it('Create case with contactPrimary name matching search term', async () => {
    const caseDetail = await uploadPetition(testClient, {
      contactPrimary: { ...baseContact },
    });

    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
    testClient.docketNumber = caseDetail.docketNumber;
    createdDocketNumbers.push(caseDetail.docketNumber);
  });

  loginAs(testClient, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(testClient);

  it('Create case with contactSecondary name matching search term', async () => {
    const caseDetail = await uploadPetition(testClient, {
      contactSecondary: { ...baseContact },
      partyType: PARTY_TYPES.petitionerSpouse,
    });

    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
    testClient.docketNumber = caseDetail.docketNumber;
    createdDocketNumbers.push(caseDetail.docketNumber);
  });

  loginAs(testClient, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(testClient);

  it('Create case with contactSecondary name matching search term', async () => {
    const caseDetail = await uploadPetition(testClient, {
      contactSecondary: { ...baseContact },
      partyType: PARTY_TYPES.petitionerSpouse,
    });

    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
    testClient.docketNumber = caseDetail.docketNumber;
    createdDocketNumbers.push(caseDetail.docketNumber);
  });

  loginAs(testClient, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(testClient);
});

describe('Petitioner searches for exact name match', () => {
  unauthedUserNavigatesToPublicSite(test);

  it('should return case with contactPrimary name match as the first result and case with contactSecondary name match as the second result', async () => {
    const queryParams = {
      currentPage: 1,
      petitionerName: searchTerm,
    };

    test.setState('advancedSearchForm.caseSearchByName', queryParams);
    await test.runSequence('submitPublicCaseAdvancedSearchSequence', {});

    const searchResults = test.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.CASE}`,
    );

    expect(searchResults.length).toBe(5);
    expect(searchResults[0]).toMatchObject({
      docketNumber: createdDocketNumbers[2],
    });
  });
});
