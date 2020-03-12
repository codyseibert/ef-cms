const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const { getCasesByUser } = require('./getCasesByUser');
const { User } = require('../../../business/entities/User');

let queryStub = jest.fn().mockReturnValue({
  promise: async () => ({
    Items: [],
  }),
});

const applicationContext = {
  environment: {
    stage: 'local',
  },
  filterCaseMetadata: ({ cases }) => cases,
  getDocumentClient: () => ({
    query: queryStub,
  }),
  isAuthorizedForWorkItems: () => true,
};

const user = {
  role: User.ROLES.petitioner,
  userId: 'petitioner',
};

describe('getCasesByUser', () => {
  beforeEach(() => {
    sinon.stub(client, 'get').resolves({
      caseId: '123',
      pk: '123',
      sk: '123',
      status: 'New',
    });
    sinon.stub(client, 'put').resolves({
      caseId: '123',
      pk: '123',
      sk: '123',
      status: 'New',
    });
    sinon.stub(client, 'delete').resolves({
      caseId: '123',
      pk: '123',
      sk: '123',
      status: 'New',
    });
    sinon.stub(client, 'batchGet').resolves([
      {
        caseId: '123',
        pk: 'case|123',
        sk: 'case|123',
        status: 'New',
      },
    ]);
    sinon.stub(client, 'query').resolves([
      {
        caseId: '123',
        pk: 'case|123',
        sk: 'case|123',
        status: 'New',
      },
    ]);
    sinon.stub(client, 'batchWrite').resolves(null);
    sinon.stub(client, 'updateConsistent').resolves(null);
  });

  afterEach(() => {
    client.get.restore();
    client.delete.restore();
    client.put.restore();
    client.query.restore();
    client.batchGet.restore();
    client.batchWrite.restore();
    client.updateConsistent.restore();
  });

  it('should return data as received from persistence', async () => {
    const result = await getCasesByUser({
      applicationContext,
      user,
    });
    expect(result).toEqual([
      {
        caseId: '123',
        docketRecord: [],
        documents: [],
<<<<<<< HEAD
        pk: 'case|123',
        practitioners: [],
        respondents: [],
        sk: 'case|123',
=======
        irsPractitioners: [],
        pk: '123',
        privatePractitioners: [],
        sk: '123',
>>>>>>> develop
        status: 'New',
      },
    ]);
  });

  it('should attempt to do a batch get in the same ids that were returned in the mapping records', async () => {
    await getCasesByUser({
      applicationContext,
      user,
    });
    expect(client.batchGet.getCall(0).args[0].keys).toEqual([
      { pk: 'case|123', sk: 'case|123' },
    ]);
  });
});
