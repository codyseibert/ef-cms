const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getLimiterByKey, incrementKeyCount, setExpiresAt } = require('./store');

describe('incrementKeyCount', () => {
  beforeEach(() => {
    client.updateConsistent = jest.fn().mockReturnValue({ id: 1 });
  });

  it('should try to add one to the id', async () => {
    await incrementKeyCount({
      applicationContext,
      key: 'limiter',
    });

    expect(client.updateConsistent.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeNames: { '#id': 'id' },
      ExpressionAttributeValues: {
        ':value': 1,
      },
      Key: {
        pk: 'limiter',
        sk: 'limiter',
      },
      UpdateExpression: 'ADD #id :value',
    });
  });
});

describe('setExpiresAt', () => {
  beforeEach(() => {
    client.updateConsistent = jest.fn().mockReturnValue({ id: 1 });
  });

  it('should set expiresAt to the value passed in and reset the id back to 1', async () => {
    await setExpiresAt({
      applicationContext,
      expiresAt: '123',
      key: 'limiter',
    });

    expect(client.updateConsistent.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeNames: {
        '#expiresAt': 'expiresAt',
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':id': 1,
        ':value': '123',
      },
      Key: {
        pk: 'limiter',
        sk: 'limiter',
      },
      UpdateExpression: 'SET #expiresAt = :value, #id = :id',
    });
  });
});

describe('getLimiterByKey', () => {
  beforeEach(() => {
    client.getFromDeployTable = jest
      .fn()
      .mockReturnValue({ maxInvocations: 5, windowTime: 1000 });
  });

  it('should call getFromDeployTable with the correct key', async () => {
    const result = await getLimiterByKey({
      applicationContext,
      key: 'advanced-document-search',
    });

    expect(client.getFromDeployTable.mock.calls[0][0]).toMatchObject({
      Key: {
        pk: 'advanced-document-search',
        sk: 'advanced-document-search',
      },
    });

    expect(result).toMatchObject({
      maxInvocations: 5,
      windowTime: 1000,
    });
  });
});
