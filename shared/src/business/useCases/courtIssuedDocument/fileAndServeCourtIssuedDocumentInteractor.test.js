const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  COURT_ISSUED_EVENT_CODES,
  DOCKET_SECTION,
  PARTY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
  TRANSCRIPT_EVENT_CODE,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const {
  ENTERED_AND_SERVED_EVENT_CODES,
} = require('../../entities/courtIssuedDocument/CourtIssuedDocumentConstants');
const {
  fileAndServeCourtIssuedDocumentInteractor,
} = require('../courtIssuedDocument/fileAndServeCourtIssuedDocumentInteractor');
const { createISODateString } = require('../../utilities/DateHandler');
const { v4: uuidv4 } = require('uuid');

describe('fileAndServeCourtIssuedDocumentInteractor', () => {
  let caseRecord;

  const mockUser = {
    name: 'Docket Clerk',
    role: ROLES.docketClerk,
    userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
  };

  const mockUserId = applicationContext.getUniqueId();
  const mockPdfUrl = 'www.example.com';
  const mockWorkItem = {
    docketNumber: '101-20',
    section: DOCKET_SECTION,
    sentBy: mockUser.name,
    sentByUserId: mockUser.userId,
    workItemId: 'b4c7337f-9ca0-45d9-9396-75e003f81e32',
  };

  const mockDocketEntryWithWorkItem = {
    docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
    docketNumber: '45678-18',
    documentTitle: 'Order',
    documentType: 'Order',
    eventCode: 'O',
    signedAt: '2019-03-01T21:40:46.415Z',
    signedByUserId: mockUserId,
    signedJudgeName: 'Dredd',
    userId: mockUserId,
    workItem: mockWorkItem,
  };

  const dynamicallyGeneratedDocketEntries = [];
  const docketEntriesWithCaseClosingEventCodes = ENTERED_AND_SERVED_EVENT_CODES.map(
    eventCode => {
      const docketEntryId = uuidv4();
      const docketRecordId = uuidv4();

      const index = dynamicallyGeneratedDocketEntries.length + 2; // 2 statically set docket records per case;

      dynamicallyGeneratedDocketEntries.push({
        docketEntryId,
        docketRecordId,
        documentTitle: `Docket Record ${index}`,
        eventCode: 'O',
        filingDate: createISODateString(),
        index,
      });

      const eventCodeMap = COURT_ISSUED_EVENT_CODES.find(
        entry => entry.eventCode === eventCode,
      );

      return {
        docketEntryId,
        documentType: eventCodeMap.documentType,
        eventCode,
        signedAt: createISODateString(),
        signedByUserId: uuidv4(),
        signedJudgeName: 'Chief Judge',
        userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
        workItem: mockWorkItem,
      };
    },
  );

  beforeEach(() => {
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
    caseRecord = {
      caseCaption: 'Caption',
      caseType: CASE_TYPES_MAP.deficiency,
      createdAt: '',
      docketEntries: [
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: '45678-18',
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          userId: mockUserId,
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: '45678-18',
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          userId: mockUserId,
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: '45678-18',
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          userId: mockUserId,
        },
        mockDocketEntryWithWorkItem,
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          docketNumber: '45678-18',
          documentTitle: 'Order to Show Cause',
          documentType: 'Order to Show Cause',
          eventCode: 'OSC',
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
          userId: mockUserId,
        },
        {
          docketEntryId: '7f61161c-ede8-43ba-8fab-69e15d057012',
          docketNumber: '45678-18',
          documentTitle: 'Transcript of [anything] on [date]',
          documentType: 'Transcript',
          eventCode: TRANSCRIPT_EVENT_CODE,
          userId: mockUserId,
        },
      ],
      docketNumber: '45678-18',
      filingType: 'Myself',
      partyType: PARTY_TYPES.petitioner,
      petitioners: [
        {
          address1: '123 Main St',
          city: 'Somewhere',
          contactType: CONTACT_TYPES.primary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'fieri@example.com',
          name: 'Guy Fieri',
          phone: '1234567890',
          postalCode: '12345',
          state: 'CA',
        },
      ],
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
      role: ROLES.petitioner,
      userId: '8100e22a-c7f2-4574-b4f6-eb092fca9f35',
    };
    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockReturnValue(1);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => caseRecord);

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: async () => ({
        Body: testPdfDoc,
      }),
    });
  });

  it('should throw an error if not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        documentMeta: {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          docketNumber: caseRecord.docketNumber,
          documentType: 'Memorandum in Support',
        },
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if the document is not found on the case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await expect(
      fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        documentMeta: {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
          docketNumber: caseRecord.docketNumber,
          documentType: 'Order',
        },
      }),
    ).rejects.toThrow('Docket entry not found');
  });

  it('should set the document as served and update the case and work items for a generic order document', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      documentMeta: {
        date: '2019-03-01T21:40:46.415Z',
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Order',
        documentType: 'Order',
        eventCode: 'O',
        freeText: 'Dogs',
        generatedDocumentTitle: 'Transcript of Dogs on 03-01-19',
        serviceStamp: 'Served',
      },
    });

    const updatedCase = applicationContext.getPersistenceGateway().updateCase
      .mock.calls[0][0].caseToUpdate;
    const updatedDocument = updatedCase.docketEntries.find(
      docketEntry =>
        docketEntry.docketEntryId === 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
    );

    expect(updatedDocument.servedAt).toBeDefined();
    expect(updatedDocument.filingDate).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox,
    ).toHaveBeenCalled();
  });

  it('should set the number of pages present in the document to be served', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      documentMeta: {
        date: '2019-03-01T21:40:46.415Z',
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Order',
        documentType: 'Order',
        eventCode: 'O',
        freeText: 'Dogs',
        generatedDocumentTitle: 'Transcript of Dogs on 03-01-19',
        serviceStamp: 'Served',
      },
    });

    const updatedCase = applicationContext.getPersistenceGateway().updateCase
      .mock.calls[0][0].caseToUpdate;
    const updatedDocument = updatedCase.docketEntries.find(
      docketEntry =>
        docketEntry.docketEntryId === 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
    );

    expect(updatedDocument.numberOfPages).toBe(1);
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument.mock
        .calls[0][0],
    ).toMatchObject({ docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba' });
  });

  it('should set the document as served and update the case and work items for a non-generic order document', async () => {
    applicationContext
      .getPersistenceGateway()
      .saveDocumentFromLambda.mockImplementation(() => {});

    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      documentMeta: {
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Order to Show Cause',
        documentType: 'Order to Show Cause',
        eventCode: 'OSC',
      },
    });

    const updatedCase = applicationContext.getPersistenceGateway().updateCase
      .mock.calls[0][0].caseToUpdate;
    const updatedDocument = updatedCase.docketEntries.find(
      docketEntry =>
        docketEntry.docketEntryId === 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
    );

    expect(updatedDocument.servedAt).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox,
    ).toHaveBeenCalled();
  });

  it('should remove the case from the trial session if the case has a trialSessionId', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        caseOrder: [
          {
            docketNumber: '101-20',
          },
        ],
        createdAt: '2019-10-27T05:00:00.000Z',
        gsi1pk: 'trial-session-catalog',
        isCalendared: false,
        judge: {
          name: 'Judge Colvin',
          userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
        },
        maxCases: 100,
        pk: 'trial-session|959c4338-0fac-42eb-b0eb-d53b8d0195cc',
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
        sessionType: 'Regular',
        sk: 'trial-session|959c4338-0fac-42eb-b0eb-d53b8d0195cc',
        startDate: '2019-11-27T05:00:00.000Z',
        startTime: '10:00',
        swingSession: true,
        swingSessionId: '208a959f-9526-4db5-b262-e58c476a4604',
        term: 'Fall',
        termYear: '2019',
        trialLocation: 'Houston, Texas',
        trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
      });

    caseRecord.trialSessionId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';
    caseRecord.trialDate = '2019-03-01T21:40:46.415Z';

    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      documentMeta: {
        date: '2019-03-01T21:40:46.415Z',
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Order',
        documentType: 'Order',
        eventCode: 'OD',
        freeText: 'Dogs',
        generatedDocumentTitle: 'Transcript of Dogs on 03-01-19',
        serviceStamp: 'Served',
      },
    });

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
  });

  it('should call updateCaseAutomaticBlock and deleteCaseTrialSortMappingRecords', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      documentMeta: {
        date: '2019-03-01T21:40:46.415Z',
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Order',
        documentType: 'Order',
        eventCode: 'OD',
        freeText: 'Dogs',
        pending: true,
        serviceStamp: 'Served',
      },
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAutomaticBlock,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toBeCalled();
  });

  it('should call serveDocumentAndGetPaperServicePdf and return its result', async () => {
    caseRecord.petitioners[0].serviceIndicator =
      SERVICE_INDICATOR_TYPES.SI_PAPER;
    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: mockPdfUrl,
      });

    const result = await fileAndServeCourtIssuedDocumentInteractor(
      applicationContext,
      {
        documentMeta: {
          date: '2019-03-01T21:40:46.415Z',
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Order',
          documentType: 'Order',
          eventCode: 'OD',
          freeText: 'Dogs',
          pending: true,
          serviceStamp: 'Served',
        },
      },
    );

    expect(result.pdfUrl).toBe(mockPdfUrl);
  });

  it('should call updateCase with the docket entry set as pending if the document is a tracked document', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      documentMeta: {
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Order to Show Cause',
        documentType: 'Order to Show Cause',
        eventCode: 'OSC',
        generatedDocumentTitle: 'Generated Order Document Title',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    const {
      caseToUpdate,
    } = applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0];
    const docketEntryInCaseToUpdate = caseToUpdate.docketEntries.find(
      d => d.docketEntryId === 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
    );
    expect(docketEntryInCaseToUpdate).toMatchObject({
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
      pending: true,
    });
  });

  it('should set isDraft to false on a document when creating a court issued docket entry', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      documentMeta: {
        date: '2019-03-01T21:40:46.415Z',
        docketEntryId: '7f61161c-ede8-43ba-8fab-69e15d057012',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        eventCode: TRANSCRIPT_EVENT_CODE,
        freeText: 'Dogs',
        generatedDocumentTitle: 'Transcript of Dogs on 03-01-19',
        isDraft: true,
      },
    });

    const lastDocumentIndex =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries.length - 1;

    const newlyFiledDocument = applicationContext.getPersistenceGateway()
      .updateCase.mock.calls[0][0].caseToUpdate.docketEntries[
      lastDocumentIndex
    ];

    expect(newlyFiledDocument).toMatchObject({
      isDraft: false,
    });
  });

  it('should update the work item and set as completed when a work item previously existed on the docket entry', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      documentMeta: {
        docketEntryId: mockDocketEntryWithWorkItem.docketEntryId,
        docketNumber: caseRecord.docketNumber,
        documentTitle: mockDocketEntryWithWorkItem.documentTitle,
        documentType: mockDocketEntryWithWorkItem.documentType,
        eventCode: mockDocketEntryWithWorkItem.eventCode,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateWorkItem.mock
        .calls[0][0],
    ).toMatchObject({
      workItemToUpdate: { completedAt: expect.anything() },
    });
  });

  it('should delete the draftOrderState from the docketEntry', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      documentMeta: {
        docketEntryId: mockDocketEntryWithWorkItem.docketEntryId,
        docketNumber: caseRecord.docketNumber,
        documentTitle: mockDocketEntryWithWorkItem.documentTitle,
        documentType: 'Transcript',
        draftOrderState: {
          documentContents: 'Some content',
          richText: 'some content',
        },
        eventCode: 'TRAN',
      },
    });

    const docketEntryToUpdate = applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
        d => d.docketEntryId === mockDocketEntryWithWorkItem.docketEntryId,
      );

    expect(docketEntryToUpdate).toMatchObject({ draftOrderState: null });
  });

  docketEntriesWithCaseClosingEventCodes.forEach(docketEntry => {
    it(`should set the case status to closed for event code: ${docketEntry.eventCode}`, async () => {
      await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        documentMeta: {
          date: '2019-03-01T21:40:46.415Z',
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Order',
          documentType: 'Order',
          eventCode: docketEntry.eventCode,
          serviceStamp: 'Served',
        },
      });

      const updatedCase = applicationContext.getPersistenceGateway().updateCase
        .mock.calls[0][0].caseToUpdate;

      expect(updatedCase.status).toEqual(CASE_STATUS_TYPES.closed);
      expect(
        applicationContext.getPersistenceGateway()
          .deleteCaseTrialSortMappingRecords,
      ).toHaveBeenCalled();
    });
  });

  it('should use original case caption to create case title when creating work item', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      documentMeta: {
        date: '2019-03-01T21:40:46.415Z',
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Order',
        documentType: 'Order',
        eventCode: 'O',
        freeText: 'Dogs',
        generatedDocumentTitle: 'Transcript of Dogs on 03-01-19',
        serviceStamp: 'Served',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox.mock
        .calls[0][0].workItem,
    ).toMatchObject({
      caseTitle: caseRecord.caseCaption,
    });
  });

  it('should throw an error if there is no one on the case with electronic or paper service', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...caseRecord,
        petitioners: [
          {
            ...caseRecord.petitioners[0],
            serviceIndicator: 'None',
          },
        ],
      });

    await expect(
      fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        documentMeta: {
          date: '2019-03-01T21:40:46.415Z',
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Order',
          documentType: 'Order',
          eventCode: 'O',
          serviceStamp: 'Served',
        },
      }),
    ).rejects.toThrow("servedPartiesCode' is not allowed to be empty");
  });
});
