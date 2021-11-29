const createApplicationContext = require('../../../web-api/src/applicationContext');
const {
  filterForPublic,
} = require('../../src/business/useCases/public/publicHelpers');
const {
  ORDER_EVENT_CODES,
} = require('../../src/business/entities/EntityConstants');
const {
  PublicDocumentSearchResult,
} = require('../../src/business/entities/documents/PublicDocumentSearchResult');
const { getClient } = require('../../../web-api/elasticsearch/client');

const applicationContext = createApplicationContext({});

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';

(async () => {
  // call advancedDocumentSearch with keyword = 'facebook' vs. ustc/migration
  const esClient = await getClient({ environmentName, version });
  const keyword = 'facebook';
  const documentEventCodes = ORDER_EVENT_CODES;

  const sourceFields = [
    'caseCaption',
    'petitioners',
    'docketEntryId',
    'docketNumber',
    'docketNumberWithSuffix',
    'documentTitle',
    'documentType',
    'eventCode',
    'filingDate',
    'irsPractitioners',
    'isFileAttached',
    'isSealed',
    'isStricken',
    'judge',
    'numberOfPages',
    'privatePractitioners',
    'sealedDate',
    'signedJudgeName',
  ];
  const documentQueryFilter = [
    { term: { 'entityName.S': 'DocketEntry' } },
    {
      exists: {
        field: 'servedAt',
      },
    },
    { terms: { 'eventCode.S': documentEventCodes } },
    { term: { 'isFileAttached.BOOL': true } },
  ];
  const docketEntryQueryParams = [];
  const from = 0;
  const simpleQueryFlags = 'OR|AND|ESCAPE|PHRASE'; // OR|AND|NOT|PHRASE|ESCAPE|PRECEDENCE', // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html#supported-flags

  if (keyword) {
    docketEntryQueryParams.push({
      simple_query_string: {
        default_operator: 'and',
        fields: ['documentContents.S', 'documentTitle.S'],
        flags: simpleQueryFlags,
        query: keyword,
      },
    });
  }

  const caseQueryParams = {
    has_parent: {
      inner_hits: {
        _source: {
          includes: sourceFields,
        },
        name: 'case-mappings',
      },
      parent_type: 'case',
      query: {
        bool: { filter: [], must_not: [{ term: { 'isSealed.BOOL': true } }] },
      },
      score: true,
    },
  };

  docketEntryQueryParams.push(caseQueryParams);

  const documentQuery = {
    body: {
      _source: sourceFields,
      from,
      query: {
        bool: {
          filter: documentQueryFilter,
          must: docketEntryQueryParams,
          must_not: [{ term: { 'isStricken.BOOL': true } }],
        },
      },
    },
    index: 'efcms-docket-entry',
    size: 5000,
  };

  const results = await esClient.search(documentQuery);

  // log results
  console.log(
    '******* Raw results',
    JSON.stringify(results.hits.hits, null, 2),
    results.hits.hits.length,
  );

  // log validation of results
  const filteredResults = await filterForPublic({
    applicationContext,
    unfiltered: results.hits.hits,
  });

  const validatedResults = PublicDocumentSearchResult.validateRawCollection(
    filteredResults,
    {
      applicationContext,
    },
  );
  console.log(
    '******* Validated results',
    JSON.stringify(validatedResults, null, 2),
    validatedResults.length,
  );
})();
