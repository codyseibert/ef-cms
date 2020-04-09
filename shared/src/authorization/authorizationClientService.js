const ROLE_PERMISSIONS = {
  ADD_CASE_TO_TRIAL_SESSION: 'ADD_CASE_TO_TRIAL_SESSION',
  ADD_PRACTITIONER_USER: 'ADD_PRACTITIONER_USER',
  ADVANCED_SEARCH: 'ADVANCED_SEARCH',
  ARCHIVE_DOCUMENT: 'ARCHIVE_DOCUMENT',
  ASSIGN_WORK_ITEM: 'ASSIGN_WORK_ITEM',
  ASSOCIATE_SELF_WITH_CASE: 'ASSOCIATE_SELF_WITH_CASE',
  ASSOCIATE_USER_WITH_CASE: 'ASSOCIATE_USER_WITH_CASE',
  BATCH_DOWNLOAD_TRIAL_SESSION: 'BATCH_DOWNLOAD_TRIAL_SESSION',
  BLOCK_CASE: 'BLOCK_CASE',
  CASE_DEADLINE: 'CASE_DEADLINE',
  CASE_INVENTORY_REPORT: 'CASE_INVENTORY_REPORT',
  CASE_NOTES: 'CASE_NOTES',
  CONSOLIDATE_CASES: 'CONSOLIDATE_CASES',
  COURT_ISSUED_DOCUMENT: 'COURT_ISSUED_DOCUMENT',
  CREATE_ORDER_DOCKET_ENTRY: 'CREATE_ORDER_DOCKET_ENTRY',
  CREATE_USER: 'CREATE_USER',
  DOCKET_ENTRY: 'DOCKET_ENTRY',
  EDIT_DOCKET_ENTRY: 'EDIT_DOCKET_ENTRY',
  EDIT_PETITION_DETAILS: 'EDIT_PETITION_DETAILS',
  FILE_EXTERNAL_DOCUMENT: 'FILE_EXTERNAL_DOCUMENT',
  FILE_IN_CONSOLIDATED: 'FILE_IN_CONSOLIDATED',
  GET_CASE: 'GET_CASE',
  GET_READ_MESSAGES: 'GET_READ_MESSAGES',
  GET_USERS_IN_SECTION: 'GET_USERS_IN_SECTION',
  JUDGES_NOTES: 'JUDGES_NOTES',
  MANAGE_PRACTITIONER_USERS: 'MANAGE_PRACTITIONER_USERS',
  MIGRATE_CASE: 'MIGRATE_CASE',
  PENDING_ITEMS: 'PENDING_ITEMS',
  PETITION: 'PETITION',
  PRIORITIZE_CASE: 'PRIORITIZE_CASE',
  SEAL_CASE: 'SEAL_CASE',
  SERVE_DOCUMENT: 'SERVE_DOCUMENT',
  SET_TRIAL_SESSION_CALENDAR: 'SET_TRIAL_SESSION_CALENDAR',
  START_PAPER_CASE: 'START_PAPER_CASE',
  TRIAL_SESSION_QC_COMPLETE: 'TRIAL_SESSION_QC_COMPLETE',
  TRIAL_SESSION_WORKING_COPY: 'TRIAL_SESSION_WORKING_COPY',
  TRIAL_SESSIONS: 'TRIAL_SESSIONS',
  UPDATE_CASE: 'UPDATE_CASE',
  UPDATE_CASE_CONTEXT: 'UPDATE_CASE_CONTEXT',
  UPDATE_CONTACT_INFO: 'UPDATE_CONTACT_INFO',
  UPLOAD_DOCUMENT: 'UPLOAD_DOCUMENT',
  VIEW_DOCUMENTS: 'VIEW_DOCUMENTS',
  VIEW_SEALED_CASE: 'VIEW_SEALED_CASE',
  WORKITEM: 'WORKITEM',
};

exports.ROLE_PERMISSIONS = ROLE_PERMISSIONS;

const allInternalUserPermissions = [
  ROLE_PERMISSIONS.ADVANCED_SEARCH,
  ROLE_PERMISSIONS.ADD_CASE_TO_TRIAL_SESSION,
  ROLE_PERMISSIONS.ARCHIVE_DOCUMENT,
  ROLE_PERMISSIONS.ASSOCIATE_USER_WITH_CASE,
  ROLE_PERMISSIONS.BLOCK_CASE,
  ROLE_PERMISSIONS.CASE_DEADLINE,
  ROLE_PERMISSIONS.CASE_INVENTORY_REPORT,
  ROLE_PERMISSIONS.CONSOLIDATE_CASES,
  ROLE_PERMISSIONS.COURT_ISSUED_DOCUMENT,
  ROLE_PERMISSIONS.MANAGE_PRACTITIONER_USERS,
  ROLE_PERMISSIONS.GET_CASE,
  ROLE_PERMISSIONS.GET_READ_MESSAGES,
  ROLE_PERMISSIONS.GET_USERS_IN_SECTION,
  ROLE_PERMISSIONS.PENDING_ITEMS,
  ROLE_PERMISSIONS.CASE_NOTES,
  ROLE_PERMISSIONS.PRIORITIZE_CASE,
  ROLE_PERMISSIONS.TRIAL_SESSIONS,
  ROLE_PERMISSIONS.UPDATE_CASE,
  ROLE_PERMISSIONS.UPLOAD_DOCUMENT,
  ROLE_PERMISSIONS.VIEW_DOCUMENTS,
  ROLE_PERMISSIONS.VIEW_SEALED_CASE,
  ROLE_PERMISSIONS.WORKITEM,
];

const AUTHORIZATION_MAP = {
  adc: allInternalUserPermissions,
  admin: [
    ROLE_PERMISSIONS.CREATE_USER,
    ROLE_PERMISSIONS.FILE_IN_CONSOLIDATED,
    ROLE_PERMISSIONS.MANAGE_PRACTITIONER_USERS,
    ROLE_PERMISSIONS.MIGRATE_CASE,
  ],
  admissionsclerk: [
    ...allInternalUserPermissions,
    ROLE_PERMISSIONS.ADD_PRACTITIONER_USER,
  ],
  chambers: [
    ...allInternalUserPermissions,
    ROLE_PERMISSIONS.BATCH_DOWNLOAD_TRIAL_SESSION,
    ROLE_PERMISSIONS.JUDGES_NOTES,
    ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY,
  ],
  clerkofcourt: [
    ...allInternalUserPermissions,
    ROLE_PERMISSIONS.ASSIGN_WORK_ITEM,
    ROLE_PERMISSIONS.DOCKET_ENTRY,
    ROLE_PERMISSIONS.EDIT_PETITION_DETAILS,
    ROLE_PERMISSIONS.SEAL_CASE,
    ROLE_PERMISSIONS.SERVE_DOCUMENT,
    ROLE_PERMISSIONS.UPDATE_CASE_CONTEXT,
  ],
  docketclerk: [
    ...allInternalUserPermissions,
    ROLE_PERMISSIONS.ASSIGN_WORK_ITEM,
    ROLE_PERMISSIONS.DOCKET_ENTRY,
    ROLE_PERMISSIONS.EDIT_DOCKET_ENTRY,
    ROLE_PERMISSIONS.EDIT_PETITION_DETAILS,
    ROLE_PERMISSIONS.SEAL_CASE,
    ROLE_PERMISSIONS.SERVE_DOCUMENT,
    ROLE_PERMISSIONS.UPDATE_CASE_CONTEXT,
    ROLE_PERMISSIONS.CREATE_ORDER_DOCKET_ENTRY,
  ],
  floater: allInternalUserPermissions,
  inactivePractitioner: [],
  irsPractitioner: [
    ROLE_PERMISSIONS.ADVANCED_SEARCH,
    ROLE_PERMISSIONS.ASSOCIATE_SELF_WITH_CASE,
    ROLE_PERMISSIONS.FILE_EXTERNAL_DOCUMENT,
    ROLE_PERMISSIONS.GET_CASE,
    ROLE_PERMISSIONS.UPDATE_CONTACT_INFO,
    ROLE_PERMISSIONS.UPLOAD_DOCUMENT,
    ROLE_PERMISSIONS.VIEW_DOCUMENTS,
  ],
  irsSuperuser: [
    ROLE_PERMISSIONS.ADVANCED_SEARCH,
    ROLE_PERMISSIONS.GET_CASE,
    ROLE_PERMISSIONS.VIEW_DOCUMENTS,
    ROLE_PERMISSIONS.VIEW_SEALED_CASE,
  ],
  judge: [
    ...allInternalUserPermissions,
    ROLE_PERMISSIONS.BATCH_DOWNLOAD_TRIAL_SESSION,
    ROLE_PERMISSIONS.JUDGES_NOTES,
    ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY,
  ],
  petitioner: [
    ROLE_PERMISSIONS.FILE_EXTERNAL_DOCUMENT,
    ROLE_PERMISSIONS.PETITION,
    ROLE_PERMISSIONS.UPDATE_CONTACT_INFO,
    ROLE_PERMISSIONS.UPLOAD_DOCUMENT,
    ROLE_PERMISSIONS.VIEW_DOCUMENTS,
  ],
  petitionsclerk: [
    ...allInternalUserPermissions,
    ROLE_PERMISSIONS.ASSIGN_WORK_ITEM,
    ROLE_PERMISSIONS.CREATE_ORDER_DOCKET_ENTRY,
    ROLE_PERMISSIONS.SERVE_DOCUMENT,
    ROLE_PERMISSIONS.SET_TRIAL_SESSION_CALENDAR,
    ROLE_PERMISSIONS.START_PAPER_CASE,
    ROLE_PERMISSIONS.TRIAL_SESSION_QC_COMPLETE,
  ],
  privatePractitioner: [
    ROLE_PERMISSIONS.ADVANCED_SEARCH,
    ROLE_PERMISSIONS.ASSOCIATE_SELF_WITH_CASE,
    ROLE_PERMISSIONS.FILE_EXTERNAL_DOCUMENT,
    ROLE_PERMISSIONS.GET_CASE,
    ROLE_PERMISSIONS.PETITION,
    ROLE_PERMISSIONS.UPDATE_CONTACT_INFO,
    ROLE_PERMISSIONS.UPLOAD_DOCUMENT,
    ROLE_PERMISSIONS.VIEW_DOCUMENTS,
  ],
  trialclerk: [
    ...allInternalUserPermissions,
    ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY,
  ],
};

exports.AUTHORIZATION_MAP = AUTHORIZATION_MAP;

/**
 * Checks user permissions for an action
 *
 * @param {object} user the user to check for authorization
 * @param {string} action the action to verify if the user is authorized for
 * @param {string} owner the user id of the owner of the item to verify
 * @returns {boolean} true if user is authorized, false otherwise
 */
exports.isAuthorized = (user, action, owner) => {
  if (user.userId && user.userId === owner) {
    return true;
  }

  const userRole = user.role;
  if (!AUTHORIZATION_MAP[userRole]) {
    return false;
  }

  const roleActionIndex = AUTHORIZATION_MAP[userRole].indexOf(action);

  const actionInRoleAuthorization = !!AUTHORIZATION_MAP[userRole][
    roleActionIndex
  ];

  return actionInRoleAuthorization;
};
