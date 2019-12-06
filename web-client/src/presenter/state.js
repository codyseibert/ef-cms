import {
  formattedCaseDetail,
  formattedCases,
} from './computeds/formattedCaseDetail';

import { addCourtIssuedDocketEntryHelper } from './computeds/addCourtIssuedDocketEntryHelper';
import { addCourtIssuedDocketEntryNonstandardHelper } from './computeds/addCourtIssuedDocketEntryNonstandardHelper';
import { addDocketEntryHelper } from './computeds/addDocketEntryHelper';
import { addToTrialSessionModalHelper } from './computeds/addToTrialSessionModalHelper';
import { advancedSearchHelper } from './computeds/advancedSearchHelper';
import { alertHelper } from './computeds/alertHelper';
import { batchDownloadHelper } from './computeds/batchDownloadHelper';
import { blockedCasesReportHelper } from './computeds/blockedCasesReportHelper';
import { caseDeadlineReportHelper } from './computeds/caseDeadlineReportHelper';
import { caseDetailEditContactsHelper } from './computeds/caseDetailEditContactsHelper';
import { caseDetailEditHelper } from './computeds/caseDetailEditHelper';
import { caseDetailHeaderHelper } from './computeds/caseDetailHeaderHelper';
import { caseDetailHelper } from './computeds/caseDetailHelper';
import { caseInformationHelper } from './computeds/caseInformationHelper';
import { caseTypeDescriptionHelper } from './computeds/caseTypeDescriptionHelper';
import { completeDocumentTypeSectionHelper } from './computeds/completeDocumentTypeSectionHelper';
import { contactsHelper } from './computeds/contactsHelper';
import { createOrderHelper } from './computeds/createOrderHelper';
import { dashboardExternalHelper } from './computeds/dashboardExternalHelper';
import { docketRecordHelper } from './computeds/docketRecordHelper';
import { documentDetailHelper } from './computeds/documentDetailHelper';
import { documentEditLinkHelper } from './computeds/documentEditLinkHelper';
import { documentSigningHelper } from './computeds/documentSigningHelper';
import { extractedDocument } from './computeds/extractDocument';
import { extractedPendingMessagesFromCaseDetail } from './computeds/extractPendingMessagesFromCaseDetail';
import { fileDocumentHelper } from './computeds/fileDocumentHelper';
import { fileUploadStatusHelper } from './computeds/fileUploadStatusHelper';
import { formattedDashboardTrialSessions } from './computeds/formattedDashboardTrialSessions';
import { formattedPendingItems } from './computeds/formattedPendingItems';
import { formattedTrialSessionDetails } from './computeds/formattedTrialSessionDetails';
import { formattedTrialSessions } from './computeds/formattedTrialSessions';
import { formattedWorkQueue } from './computeds/formattedWorkQueue';
import { getTrialCityName } from './computeds/formattedTrialCity';
import { headerHelper } from './computeds/headerHelper';
import { internalTypesHelper } from './computeds/internalTypesHelper';
import { loadingHelper } from './computeds/loadingHelper';
import { menuHelper } from './computeds/menuHelper';
import { pdfPreviewModalHelper } from './computeds/PDFPreviewModal/pdfPreviewModalHelper';
import { pdfSignerHelper } from './computeds/pdfSignerHelper';
import { primaryContactEditHelper } from './computeds/primaryContactEditHelper';
import { requestAccessHelper } from './computeds/requestAccessHelper';
import { scanBatchPreviewerHelper } from './computeds/scanBatchPreviewerHelper';
import { scanHelper } from './computeds/scanHelper';
import { selectDocumentSelectHelper } from './computeds/selectDocumentSelectHelper';
import { selectDocumentTypeHelper } from './computeds/selectDocumentTypeHelper';
import { showAppTimeoutModalHelper } from './computeds/showAppTimeoutModalHelper';
import { startCaseHelper } from './computeds/startCaseHelper';
import { startCaseInternalContactsHelper } from './computeds/startCaseInternalContactsHelper';
import { startCaseInternalHelper } from './computeds/startCaseInternalHelper';
import { trialCitiesHelper } from './computeds/trialCitiesHelper';
import { trialSessionHeaderHelper } from './computeds/trialSessionHeaderHelper';
import { trialSessionWorkingCopyHelper } from './computeds/trialSessionWorkingCopyHelper';
import { updateCaseModalHelper } from './computeds/updateCaseModalHelper';
import { viewAllDocumentsHelper } from './computeds/viewAllDocumentsHelper';
import { workQueueHelper } from './computeds/workQueueHelper';
import { workQueueSectionHelper } from './computeds/workQueueSectionHelper';

export const state = {
  addCourtIssuedDocketEntryHelper,
  addCourtIssuedDocketEntryNonstandardHelper,
  addDocketEntryHelper,
  addToTrialSessionModalHelper,
  advancedSearchForm: {},
  advancedSearchHelper,
  alertHelper,
  archiveDraftDocument: {
    caseId: null,
    documentId: null,
    documentTitle: null,
  },
  assigneeId: null,
  batchDownloadHelper,
  batchDownloads: {},
  batchIndexToRescan: null,
  batches: [],
  betaBar: {
    isVisible: true,
  },
  blockedCasesReportHelper,
  caseCaption: '',
  caseDeadlineReportHelper,
  caseDetail: {},
  caseDetailEditContactsHelper,
  caseDetailEditHelper,
  caseDetailErrors: {},
  caseDetailHeaderHelper,
  caseDetailHelper,
  caseDetailPage: {},
  caseInformationHelper,
  caseTypeDescriptionHelper,
  caseTypes: [],
  cases: [],
  cognitoLoginUrl: null,
  completeDocumentTypeSectionHelper,
  completeForm: {},
  contactsHelper,
  createOrderHelper,
  currentPage: 'Interstitial',
  currentPageHeader: '',
  currentPageIndex: 0,
  currentTab: '',
  dashboardExternalHelper,
  docketNumberSearchForm: {},
  docketRecordHelper,
  docketRecordIndex: 0,
  document: {},
  documentDetail: {
    tab: '',
  },
  documentDetailHelper,
  documentEditLinkHelper,
  documentId: null,
  documentSelectedForPreview: null,
  documentSelectedForScan: null,
  documentSigningHelper,
  documentUploadMode: 'scan',
  extractedDocument,
  extractedPendingMessagesFromCaseDetail,
  fieldOrder: [],
  fileDocumentHelper,
  fileUploadStatusHelper,
  filingTypes: [],
  form: {},
  formattedCaseDetail,
  formattedCases,
  formattedDashboardTrialSessions,
  formattedPendingItems,
  formattedTrialSessionDetails,
  formattedTrialSessions,
  formattedWorkQueue,
  getTrialCityName,
  headerHelper,
  internalTypesHelper,
  isAccountMenuOpen: false,
  loadingHelper,
  menuHelper,
  mobileMenu: {
    isVisible: false,
  },
  modal: {},
  navigation: {},
  notifications: {},
  path: '/',
  paymentInfo: {
    showDetails: false,
  },
  pdfForSigning: {
    documentId: null,
    nameForSigning: '',
    pageNumber: 1,
    pdfjsObj: null,
    signatureApplied: false,
    signatureData: null,
  },
  pdfPreviewModal: {},
  pdfPreviewModalHelper,
  pdfSignerHelper,
  percentComplete: 0,
  permissions: null,
  petition: {},
  previewPdfFile: null,
  primaryContactEditHelper,
  procedureTypes: [],
  requestAccessHelper,
  scanBatchPreviewerHelper,
  scanHelper,
  scanner: {},
  screenMetadata: {},
  searchMode: 'byName',
  searchTerm: '',
  sectionInboxCount: 0,
  sectionUsers: [],
  selectDocumentSelectHelper,
  selectDocumentTypeHelper,
  selectedBatchIndex: 0,
  selectedWorkItems: [],
  sessionMetadata: {
    docketRecordSort: [],
  },
  showAppTimeoutModalHelper,
  showModal: '',
  showValidation: false,
  startCaseHelper,
  startCaseInternalContactsHelper,
  startCaseInternalHelper,
  timeRemaining: Number.POSITIVE_INFINITY,
  trialCitiesHelper,
  trialSessionHeaderHelper,
  trialSessionWorkingCopyHelper,
  trialSessionsTab: {
    group: null,
  },
  updateCaseModalHelper,
  usaBanner: {
    showDetails: false,
  },
  user: null,
  users: [],
  validationErrors: {},
  viewAllDocumentsHelper,
  waitingForResponse: false,
  workItem: {},
  workItemActions: {},
  workItemMetadata: {},
  workQueue: [],
  workQueueHelper,
  workQueueSectionHelper,
  workQueueToDisplay: { box: 'inbox', queue: 'my', workQueueIsInternal: true },
};
