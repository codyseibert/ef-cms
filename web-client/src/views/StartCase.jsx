import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import React from 'react';
import StartCaseCancelModalDialog from './StartCaseCancelModalDialog';
import CaseDifferenceExplained from './CaseDifferenceExplained';

import ErrorNotification from './ErrorNotification';

export default connect(
  {
    caseTypes: state.caseTypes,
    form: state.form,
    getTrialCities: sequences.getTrialCitiesSequence,
    procedureTypes: state.procedureTypes,
    showModal: state.showModal,
    startACaseToggleCancelSequence: sequences.startACaseToggleCancelSequence,
    startCaseHelper: state.startCaseHelper,
    submitFilePetitionSequence: sequences.submitFilePetitionSequence,
    submitting: state.submitting,
    toggleCaseDifferenceSequence: sequences.toggleCaseDifferenceSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updatePetitionValueSequence: sequences.updatePetitionValueSequence,
  },
  function StartCase({
    caseTypes,
    form,
    getTrialCities,
    procedureTypes,
    showModal,
    startACaseToggleCancelSequence,
    startCaseHelper,
    submitFilePetitionSequence,
    submitting,
    toggleCaseDifferenceSequence,
    updateFormValueSequence,
    updatePetitionValueSequence,
  }) {
    return (
      <section className="usa-section usa-grid">
        <form
          role="form"
          aria-labelledby="start-case-header"
          noValidate
          onSubmit={e => {
            e.preventDefault();
            submitFilePetitionSequence();
          }}
        >
          <h1 tabIndex="-1" id="start-case-header">
            Start a Case
          </h1>
          {showModal && <StartCaseCancelModalDialog />}
          <ErrorNotification />
          <div className="grey-container">
            <div className="usa-grid-full">
              <h2 id="get-started">Before You Get Started...</h2>
              <p>
                There are a few things you need to do before you can submit your
                case.
              </p>
              <div role="list" aria-describedby="get-started">
                <div
                  className="usa-width-one-third create-case-step"
                  role="listitem"
                >
                  <span className="step-count">1</span>
                  <h3>Fill out a petition form</h3>
                  <p>
                    Use{' '}
                    <a
                      href="https://www.ustaxcourt.gov/forms/Petition_Simplified_Form_2.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      USTC Form 2
                    </a>{' '}
                    or a custom petition format that complies with the
                    requirements of the{' '}
                    <a
                      href="https://www.ustaxcourt.gov/rules.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Tax Court Rules of Practice and Procedure
                    </a>
                    .
                  </p>
                </div>
                <div
                  className="usa-width-one-third create-case-step"
                  role="listitem"
                >
                  <span className="step-count">2</span>
                  <h3>Gather any IRS notice(s) you’ve received</h3>
                  <p>
                    If you’ve received an IRS notice, such as a Notice of
                    Deficiency or Notice of Determination, you’ll need to
                    include those in your Petition.
                  </p>
                </div>
                <div
                  className="usa-width-one-third create-case-step"
                  role="listitem"
                >
                  <span className="step-count">3</span>
                  <h3>Create your Petition as a single PDF</h3>
                  <p>
                    Scan your petition form and IRS notices into one Petition
                    PDF or combine them digitally. Learn{' '}
                    <a href="/">how to merge files into one PDF</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="required-statement">All fields required</p>
          <h2>Tell Us About Your Case</h2>
          <p>You must file a Petition to begin a Tax Court case.</p>
          <div className="blue-container">
            <div className="usa-form-group">
              <h3>Who is Filing This Case?</h3>
              <p>Myself</p>
              <h3>IRS Notice</h3>
              <label htmlFor="case-type">Type of Notice</label>
              <select
                name="caseType"
                id="case-type"
                aria-labelledby="case-type"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              >
                <option value="">-- Select --</option>
                {caseTypes.map(caseType => (
                  <option key={caseType.type} value={caseType.type}>
                    {caseType.description}
                  </option>
                ))}
              </select>
            </div>
            <fieldset>
              <legend id="date-of-notice-legend">Date of Notice</legend>
              <div className="usa-date-of-birth">
                <div className="usa-form-group usa-form-group-month">
                  <label htmlFor="date-of-notice-month" aria-hidden="true">
                    MM
                  </label>
                  <input
                    className="usa-input-inline"
                    aria-describedby="date-of-notice-legend"
                    id="date-of-notice-month"
                    name="month"
                    aria-label="month, two digits"
                    type="number"
                    min="1"
                    max="12"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group-day">
                  <label htmlFor="date-of-notice-day" aria-hidden="true">
                    DD
                  </label>
                  <input
                    className="usa-input-inline"
                    aria-describedby="date-of-notice-legend"
                    aria-label="day, two digits"
                    id="date-of-notice-day"
                    name="day"
                    type="number"
                    min="1"
                    max="31"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group-year">
                  <label htmlFor="date-of-notice-year" aria-hidden="true">
                    YYYY
                  </label>
                  <input
                    className="usa-input-inline"
                    aria-describedby="date-of-notice-legend"
                    aria-label="year, four digits"
                    id="date-of-notice-year"
                    name="year"
                    type="number"
                    min="1900"
                    max="2100"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </fieldset>
            <div className="usa-grid-full">
              <div className="usa-width-one-third">
                <div className="usa-form-group">
                  <label
                    htmlFor="petition-file"
                    className={
                      'with-hint ' +
                      (startCaseHelper.showPetitionFileValid ? 'validated' : '')
                    }
                  >
                    Upload Your Petition
                  </label>
                  <span className="usa-form-hint">
                    File must be in PDF format (.pdf)
                  </span>
                  <input
                    id="petition-file"
                    type="file"
                    accept=".pdf"
                    aria-describedby="petition-hint"
                    name="petitionFile"
                    onChange={e => {
                      updatePetitionValueSequence({
                        key: e.target.name,
                        value: e.target.files[0],
                      });
                    }}
                  />
                </div>
              </div>
              <div className="usa-width-two-thirds">
                <div className="alert-dark" id="petition-hint">
                  <FontAwesomeIcon icon="arrow-alt-circle-left" size="sm" />
                  <span>
                    This should include your petition form and any IRS notice
                    <span aria-hidden="true">(s)</span> you received.
                  </span>
                </div>
              </div>
            </div>
          </div>
          <h2>How Do You Want This Case Handled?</h2>
          <p>
            Tax laws allow you to file your case as a “small case,” which means
            it’s handled a bit differently than a regular case. If you choose to
            have your case processed as a small case, the Tax Court must approve
            your choice. Generally, the Tax Court will agree with your request
            if you qualify.
          </p>
          <div className="usa-accordion start-a-case">
            <button
              type="button"
              className="usa-accordion-button case-difference"
              aria-expanded={!!form.showCaseDifference}
              aria-controls="case-difference-container"
              onClick={() => toggleCaseDifferenceSequence()}
            >
              <span className="usa-banner-button-text">
                How is a small case different than a regular case, and do I
                qualify?
                {form.showCaseDifference ? (
                  <FontAwesomeIcon icon="caret-up" />
                ) : (
                  <FontAwesomeIcon icon="caret-down" />
                )}
              </span>
            </button>
            <div
              id="case-difference-container"
              className="usa-accordion-content"
              aria-hidden={!form.showCaseDifference}
            >
              <CaseDifferenceExplained />
            </div>
          </div>
          <div className="blue-container">
            <div className="usa-form-group">
              <fieldset id="radios" className="usa-fieldset-inputs usa-sans">
                <legend>Select Case Procedure</legend>
                <ul className="usa-unstyled-list">
                  {procedureTypes.map((procedureType, idx) => (
                    <li key={procedureType}>
                      <input
                        id={procedureType}
                        data-type={procedureType}
                        type="radio"
                        name="procedureType"
                        value={procedureType}
                        onChange={e => {
                          getTrialCities({
                            value: e.currentTarget.value,
                          });
                        }}
                      />
                      <label id={`proc-type-${idx}`} htmlFor={procedureType}>
                        {procedureType} case
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>
            </div>
            {startCaseHelper.showSelectTrial && (
              <div className="usa-form-group">
                <label htmlFor="preferred-trial-city" className="with-hint">
                  Select a Trial Location
                </label>
                <span className="usa-form-hint">
                  {startCaseHelper.showSmallTrialCitiesHint && (
                    <React.Fragment>
                      Trial locations are unavailable in the following states:
                      DE, NH, NJ, RI. Please select the next closest location.
                    </React.Fragment>
                  )}
                  {startCaseHelper.showRegularTrialCitiesHint && (
                    <React.Fragment>
                      Trial locations are unavailable in the following states:
                      DE, KS, ME, NH, NJ, ND, RI, SD, VT, WY. Please select the
                      next closest location.
                    </React.Fragment>
                  )}
                </span>
                <select
                  name="preferredTrialCity"
                  id="preferred-trial-city"
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value || null,
                    });
                  }}
                  value={form.preferredTrialCity || ''}
                >
                  <option value="">-- Select --</option>
                  {Object.keys(startCaseHelper.trialCitiesByState).map(
                    (state, idx) => (
                      <optgroup key={idx} label={state}>
                        {startCaseHelper.trialCitiesByState[state].map(
                          (trialCity, cityIdx) => (
                            <option key={cityIdx} value={trialCity}>
                              {trialCity}
                            </option>
                          ),
                        )}
                      </optgroup>
                    ),
                  )}
                </select>
              </div>
            )}
          </div>
          <h2>Review Your Information</h2>
          <p>
            You can’t edit your case once you submit it. Please make sure all
            your information appears the way you want it to.
          </p>
          <div className="blue-container">
            <div className="usa-form-group">
              <legend>Review and Sign</legend>
              <input
                id="signature"
                type="checkbox"
                name="signature"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.checked ? true : undefined,
                  });
                }}
              />
              <label htmlFor="signature">
                Checking this box acts as your digital signature, acknowledging
                that you’ve verified all information is correct.
              </label>
            </div>
          </div>
          <button
            id="submit-case"
            type="submit"
            disabled={submitting}
            className={submitting ? 'usa-button-active' : 'usa-button'}
            aria-disabled={submitting ? 'true' : 'false'}
          >
            {submitting && <div className="spinner" />}
            Submit to U.S. Tax Court
          </button>
          <button
            type="button"
            className="usa-button-secondary"
            onClick={() => {
              startACaseToggleCancelSequence();
              return false;
            }}
          >
            Cancel
          </button>
        </form>
      </section>
    );
  },
);
