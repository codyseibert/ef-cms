import { BigHeader } from '../BigHeader';
import { CaseSearchForm } from './CaseSearchForm';
import { ErrorNotification } from '../ErrorNotification';
import { PractitionerSearchForm } from './PractitionerSearchForm';
import { PractitionerSearchResults } from './PractitionerSearchResults';
import { SearchResults } from './SearchResults';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AdvancedSearch = connect(
  {
    advancedSearchHelper: state.advancedSearchHelper,
    advancedSearchTabChangeSequence: sequences.advancedSearchTabChangeSequence,
    submitCaseAdvancedSearchSequence:
      sequences.submitCaseAdvancedSearchSequence,
    submitCaseDocketNumberSearchSequence:
      sequences.submitCaseDocketNumberSearchSequence,
    submitPractitionerBarNumberSearchSequence:
      sequences.submitPractitionerBarNumberSearchSequence,
    submitPractitionerNameSearchSequence:
      sequences.submitPractitionerNameSearchSequence,
  },
  function AdvancedSearch({
    advancedSearchHelper,
    advancedSearchTabChangeSequence,
    submitCaseAdvancedSearchSequence,
    submitCaseDocketNumberSearchSequence,
    submitPractitionerBarNumberSearchSequence,
    submitPractitionerNameSearchSequence,
  }) {
    return (
      <>
        <BigHeader text="Advanced Search" />

        <section className="usa-section grid-container advanced-search">
          <ErrorNotification />
          <Tabs
            bind="advancedSearchTab"
            className="classic-horizontal-header3 tab-border"
            onSelect={() => {
              advancedSearchTabChangeSequence();
            }}
          >
            <Tab id="tab-case" tabName="case" title="Case">
              <p>
                Anyone can search for a case in our system for cases filed{' '}
                <span className="text-semibold">on or after May 1, 1986</span>.
                If you aren’t affiliated with that case, you will only see
                limited information about that case.
              </p>

              <CaseSearchForm
                submitAdvancedSearchSequence={submitCaseAdvancedSearchSequence}
                submitDocketNumberSearchSequence={
                  submitCaseDocketNumberSearchSequence
                }
              />
              <SearchResults />
            </Tab>
            {advancedSearchHelper.showPractitionerSearch && (
              <Tab
                id="tab-practitioner"
                tabName="practitioner"
                title="Practitioner"
              >
                <PractitionerSearchForm
                  submitPractitionerBarNumberSearchSequence={
                    submitPractitionerBarNumberSearchSequence
                  }
                  submitPractitionerNameSearchSequence={
                    submitPractitionerNameSearchSequence
                  }
                />
                <PractitionerSearchResults />
              </Tab>
            )}
          </Tabs>
        </section>
      </>
    );
  },
);
