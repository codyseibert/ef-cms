import { isEmpty } from 'lodash';
import { state } from 'cerebral';

export const addCourtIssuedDocketEntryHelper = (get, applicationContext) => {
  const { COURT_ISSUED_EVENT_CODES } = applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);
  const documentTypes = COURT_ISSUED_EVENT_CODES.map(type => ({
    ...type,
    label: type.documentType,
    value: type.eventCode,
  }));

  const petitioners = [caseDetail.contactPrimary];

  if (!isEmpty(caseDetail.contactSecondary)) {
    petitioners.push(caseDetail.contactSecondary);
  }

  const serviceParties = [
    ...petitioners.map(petitioner => ({
      ...petitioner,
      displayName: `${petitioner.name}, Petitioner`,
    })),
    ...caseDetail.practitioners.map(practitioner => ({
      ...practitioner,
      displayName: `${practitioner.name}, Petitioner Counsel`,
    })),
    ...caseDetail.respondents.map(practitioner => ({
      ...practitioner,
      displayName: `${practitioner.name}, Respondent Counsel`,
    })),
  ];

  return {
    documentTypes,
    serviceParties,
  };
};
