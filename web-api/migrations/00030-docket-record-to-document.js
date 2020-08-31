const createApplicationContext = require('../src/applicationContext');
const {
  aggregateCaseItems,
} = require('../../shared/src/persistence/dynamo/helpers/aggregateCaseItems');
const {
  INITIAL_DOCUMENT_TYPES,
  MINUTE_ENTRIES_MAP,
} = require('../../shared/src/business/entities/EntityConstants');
const { Document } = require('../../shared/src/business/entities/Document');
const { isCaseRecord, upGenerator } = require('./utilities');

const documentTypesMap = [
  ...Object.values(MINUTE_ENTRIES_MAP),
  ...Object.values(INITIAL_DOCUMENT_TYPES),
];

const applicationContext = createApplicationContext({});

const mutateRecord = async (item, documentClient, tableName) => {
  if (isCaseRecord(item)) {
    const caseRecords = await documentClient
      .query({
        ExpressionAttributeNames: {
          '#pk': 'pk',
        },
        ExpressionAttributeValues: {
          ':pk': `case|${item.docketNumber}`,
        },
        KeyConditionExpression: '#pk = :pk',
        TableName: tableName,
      })
      .promise();

    if (!caseRecords || !caseRecords.Items) {
      return false;
    }

    const fullCaseRecord = aggregateCaseItems(caseRecords.Items);

    await Promise.all(
      fullCaseRecord.documents.map(document => {
        const docketEntry = fullCaseRecord.docketRecord.find(
          d => d.documentId === document.documentId,
        );

        if (docketEntry) {
          const updatedDocument = new Document(
            {
              ...document,
              ...docketEntry,
              isOnDocketRecord: true,
            },
            { applicationContext },
          )
            .validate()
            .toRawObject();

          documentClient
            .put({
              Item: {
                ...updatedDocument,
                pk: `case|${item.docketNumber}`,
                sk: `document|${document.documentId}`,
              },
              TableName: tableName,
            })
            .promise();
        }
      }),
    );

    await Promise.all(
      fullCaseRecord.docketRecord.map(docketEntry => {
        const caseDocument = fullCaseRecord.documents.find(
          d => d.documentId === docketEntry.documentId,
        );

        if (!caseDocument) {
          const { documentType } = documentTypesMap.find(
            m => m.eventCode === docketEntry.eventCode,
          );

          const newDocument = new Document(
            {
              ...docketEntry,
              documentTitle: docketEntry.description,
              documentType,
              isFileAttached: false,
              isMinuteEntry: true,
              isOnDocketRecord: true,
              processingStatus: 'complete',
              userId: item.userId,
            },
            { applicationContext },
          )
            .validate()
            .toRawObject();

          documentClient
            .put({
              Item: {
                ...newDocument,
                pk: `case|${item.docketNumber}`,
                sk: `document|${docketEntry.documentId}`,
              },
              TableName: tableName,
            })
            .promise();
        }

        documentClient
          .delete({
            Key: {
              pk: docketEntry.pk,
              sk: docketEntry.sk,
            },
            TableName: tableName,
          })
          .promise();
      }),
    );
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
