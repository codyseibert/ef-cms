const createApplicationContext = require('../../../web-api/src/applicationContext');
const {
  ORDER_EVENT_CODES,
} = require('../../src/business/entities/EntityConstants');
const { Case } = require('../../src/business/entities/cases/Case');
const { DynamoDB } = require('aws-sdk');
const { getClient } = require('../../../web-api/elasticsearch/client');

const applicationContext = createApplicationContext({});

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';
const dynamodb = new DynamoDB({ region: 'us-east-1' });

const loadCase = async docketNumber => {
  const result = await dynamodb
    .getItem({
      Key: {
        pk: {
          S: `case|${docketNumber}`,
        },
        sk: {
          S: `case|${docketNumber}`,
        },
      },
      TableName: `efcms-${environmentName}-${version}`,
    })
    .promise();

  return DynamoDB.Converter.unmarshall(result.Item);
};

(async () => {
  // call advancedDocumentSearch with keyword = 'facebook' vs. ustc/migration
  // log results
  // log validation of results
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
  };

  const queryArray = [
    {
      range: {
        'deadlineDate.S': {
          format: 'strict_date_time', // ISO-8601 time stamp
          // gte: startDate,
        },
      },
    },
    {
      range: {
        'deadlineDate.S': {
          format: 'strict_date_time', // ISO-8601 time stamp
          // lte: endDate,
        },
      },
    },
  ];

  const size = 100;

  const query = {
    body: {
      from,
      query: {
        bool: {
          must: queryArray,
        },
      },
      size,
      sort: [
        { 'deadlineDate.S': { order: 'asc' } },
        { 'sortableDocketNumber.N': { order: 'asc' } },
      ],
    },
    index: 'efcms-case-deadline',
  };

  const results = await esClient.search(query);
  const docketNumbers = results.hits.hits.map(
    row => row['_source']['docketNumber']['S'],
  );
  const records = await Promise.all(docketNumbers.map(loadCase));

  records.forEach(record => {
    console.log(record.docketNumber);
    const caseEntity = new Case(
      {
        ...record,
      },
      { applicationContext },
    );
    try {
      caseEntity.validate();
    } catch (err) {
      console.log(err);
      console.log(caseEntity.getFormattedValidationErrors());
      console.log(record);
    }
    console.log('------');
  });

  // const validatedCaseData = Case.validateRawCollection(records, {
  //   applicationContext,
  // });
})();
