import {
  ADVANCED_SEARCH_TABS,
  DATE_RANGE_SEARCH_OPTIONS,
} from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../../integration-tests/helpers';

export const unauthedUserSearchesForOpinionByKeyword = cerebralTest => {
  return it('Search for opinion by keyword', async () => {
    await refreshElasticsearchIndex();

    cerebralTest.setState('advancedSearchTab', ADVANCED_SEARCH_TABS.OPINION);

    cerebralTest.setState('advancedSearchForm', {
      opinionSearch: {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        keyword: 'osteodontolignikeratic',
        opinionTypes: { SOP: true },
        startDate: '01/01/2001',
      },
    });

    await cerebralTest.runSequence('submitPublicOpinionAdvancedSearchSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(
      cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
    ).toEqual([]);

    // search for an opinion on a sealed case
    cerebralTest.setState('advancedSearchForm', {
      opinionSearch: {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        keyword: 'opinion',
        opinionTypes: { TCOP: true },
        startDate: '01/01/2001',
      },
    });

    await cerebralTest.runSequence('submitPublicOpinionAdvancedSearchSequence');

    expect(
      cerebralTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.OPINION}`),
    ).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: '130a3790-7e82-4f5c-8158-17f5d9d560e7',
          documentTitle:
            'T.C. Opinion Judge Colvin Some very strong opinions about sunglasses',
        }),
      ]),
    );
  });
};
