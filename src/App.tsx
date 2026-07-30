import { useReducer, useMemo, useRef, useEffect } from "react";
import "./App.css";
import {
  day14Reducer,
  day14InitialState,
} from "./day14Reducer";
import * as DATA from "./day14Data";

type ContentRatio = "1:1" | "1:3" | "3:1";

function App() {
  const [state, dispatch] = useReducer(day14Reducer, day14InitialState);
  const stateLineRef = useRef<HTMLDivElement>(null);

  // Focus management: restore focus to state-line if active control was removed
  useEffect(() => {
    const activeEl = document.activeElement as HTMLElement;
    if (
      activeEl === document.body ||
      (activeEl && !activeEl.isConnected)
    ) {
      stateLineRef.current?.focus({ preventScroll: true });
    }
  }, [state]);

  // Dev-only fixture handling via query parameter
  const ratio = useMemo(() => {
    if (typeof window === "undefined") return "1:1";
    if (!import.meta.env.DEV) return "1:1"; // Production always uses 1:1

    const params = new URLSearchParams(window.location.search);
    const fixture = params.get("fixture") as ContentRatio | null;
    return (fixture && ["1:1", "1:3", "3:1"].includes(fixture)) ? fixture : "1:1";
  }, []);

  const renderRow = (
    label: string,
    value: string,
    isMonospace: boolean = false
  ) => (
    <div className="impact-row">
      <div className="impact-row-content">
        <label className="impact-label">{label}</label>
        <span className={isMonospace ? "impact-value-mono" : "impact-value"}>
          {value}
        </span>
      </div>
    </div>
  );

  const agreementContent = (
    <>
      <h3 className="region-heading">CURRENT AGREEMENT</h3>
      <div className="content-section">
        {DATA.AGREEMENT_ITEMS_BY_RATIO[ratio].includes("COST") &&
          renderRow("COST", DATA.CURRENT_AGREEMENT.cost, true)}
        {DATA.AGREEMENT_ITEMS_BY_RATIO[ratio].includes("DATE") &&
          renderRow("DATE", DATA.CURRENT_AGREEMENT.date, true)}
        {DATA.AGREEMENT_ITEMS_BY_RATIO[ratio].includes("SCOPE") &&
          renderRow("SCOPE", DATA.CURRENT_AGREEMENT.scope, false)}
        {DATA.AGREEMENT_ITEMS_BY_RATIO[ratio].includes("VENUE") &&
          renderRow("VENUE", DATA.CURRENT_AGREEMENT.venue, false)}
      </div>
    </>
  );

  const proposalContent = (
    <>
      <h3 className="region-heading">PROPOSED CHANGE</h3>
      <h4 className="proposal-heading">{DATA.REQUEST.title}</h4>
      <div style={{ marginBottom: "40px" }}>
        <div className="group-label">{DATA.EXPECTED_IMPACT.heading}</div>
        <div className="content-section">
          {renderRow("COST", DATA.EXPECTED_IMPACT.cost, true)}
          {renderRow("VENUE ACCESS", DATA.EXPECTED_IMPACT.venueAccess, true)}
          {renderRow(
            "DOCUMENTS AFFECTED",
            DATA.EXPECTED_IMPACT.documentsAffected,
            false
          )}
          {DATA.PROPOSAL_ITEMS_BY_RATIO[ratio] >= 2 &&
            renderRow("IMPACT ITEM", "Additional technical team required", false)}
          {DATA.PROPOSAL_ITEMS_BY_RATIO[ratio] >= 3 &&
            renderRow("CAPACITY", "500 per hour", true)}
          {DATA.PROPOSAL_ITEMS_BY_RATIO[ratio] >= 4 &&
            renderRow("OVERFLOW 1", "Extra long proposal content", false)}
        </div>
      </div>
      <div>
        <div className="group-label">{DATA.UNCERTAINTY.heading}</div>
        <div className="content-section">
          {renderRow(
            "VENUE ACCESS STATUS",
            DATA.UNCERTAINTY.venueAccessStatus,
            false
          )}
        </div>
      </div>
    </>
  );

  const getStateText = (): string => {
    switch (state) {
      case "provider_capture":
        return "PROVIDER RECORDING PROPOSAL · PROPOSAL REMAINS OUTSIDE THE CURRENT AGREEMENT";
      case "client_review_unexpressed":
        return "CLIENT UNDERSTANDING NOT YET EXPRESSED · PROPOSAL REMAINS OUTSIDE THE CURRENT AGREEMENT";
      case "different_understandings":
        return "UNDERSTANDINGS DIFFER · PROPOSAL REMAINS OUTSIDE THE CURRENT AGREEMENT";
      case "shared_understanding":
        return "SAME UNDERSTANDING EXPRESSED · PROPOSAL NOW SHOWN IN THE CURRENT AGREEMENT";
      case "declined":
        return "CLIENT DOES NOT WANT TO ADD THIS · PROPOSAL REMAINS OUTSIDE THE CURRENT AGREEMENT";
      default:
        return "";
    }
  };

  const providerCapture = (
    <div className="composition" data-testid="state-provider_capture">
      <section className="agreement-section" data-testid="agreement-section">
        {agreementContent}
      </section>
      <div className="agreement-boundary" data-testid="agreement-boundary" />
      <section className="proposal-band" data-testid="proposal-band">
        <h3 className="region-heading">PROVIDER CAPTURE</h3>
        <h4 className="proposal-heading">{DATA.REQUEST.title}</h4>
        <div style={{ marginBottom: "40px" }}>
          <div className="group-label">{DATA.EXPECTED_IMPACT.heading}</div>
          <div className="content-section">
            {renderRow("COST", DATA.EXPECTED_IMPACT.cost, true)}
            {renderRow("VENUE ACCESS", DATA.EXPECTED_IMPACT.venueAccess, true)}
            {renderRow(
              "DOCUMENTS AFFECTED",
              DATA.EXPECTED_IMPACT.documentsAffected,
              false
            )}
          </div>
        </div>
        <div>
          <div className="group-label">{DATA.UNCERTAINTY.heading}</div>
          <div className="content-section">
            {renderRow(
              "VENUE ACCESS STATUS",
              DATA.UNCERTAINTY.venueAccessStatus,
              false
            )}
          </div>
        </div>
        <div>
          <div className="group-label">{DATA.RECORDED_BY.heading}</div>
          <div className="content-section">
            {renderRow("", DATA.RECORDED_BY.value, false)}
          </div>
        </div>
        <div>
          <div className="group-label">{DATA.RECORDED_AT.heading}</div>
          <div className="content-section">
            {renderRow("", DATA.RECORDED_AT.value, true)}
          </div>
        </div>
        <div className="control-row">
          <button
            className="control-button"
            data-testid="record-proposal"
            onClick={() => dispatch({ type: "RECORD_PROPOSAL" })}
          >
            RECORD PROPOSAL
          </button>
        </div>
      </section>
    </div>
  );

  const clientReviewUnexpressed = (
    <div className="composition" data-testid="state-client_review_unexpressed">
      <section className="agreement-section" data-testid="agreement-section">
        {agreementContent}
      </section>
      <div className="agreement-boundary" data-testid="agreement-boundary" />
      <section className="proposal-band" data-testid="proposal-band">
        {proposalContent}
        <div
          className="understanding-pair unexpressed"
          data-testid="understanding-pair"
        >
          <div className="understanding-column" data-testid="provider-understanding">
            <h5 className="understanding-label">
              {DATA.PROVIDER_UNDERSTANDING.heading}
            </h5>
            <p className="understanding-text">
              {DATA.PROVIDER_UNDERSTANDING.text}
            </p>
          </div>
          <div className="understanding-divider dashed" />
          <div className="understanding-column" data-testid="client-understanding">
            <h5 className="understanding-label">CLIENT UNDERSTANDING</h5>
            <p className="understanding-text unexpressed-text">
              {DATA.CLIENT_UNDERSTANDING_UNEXPRESSED.text}
            </p>
          </div>
        </div>
        <div className="control-row three-buttons">
          <button
            className="control-button"
            data-testid="match-understanding"
            onClick={() => dispatch({ type: "EXPRESS_MATCH" })}
          >
            THIS MATCHES MY UNDERSTANDING
          </button>
          <button
            className="control-button"
            data-testid="different-understanding"
            onClick={() => dispatch({ type: "EXPRESS_DIFFERENCE" })}
          >
            I UNDERSTOOD SOMETHING DIFFERENT
          </button>
          <button
            className="control-button"
            data-testid="decline-change"
            onClick={() => dispatch({ type: "DECLINE_CHANGE" })}
          >
            I DO NOT WANT TO ADD THIS
          </button>
        </div>
      </section>
    </div>
  );

  const differentUnderstandings = (
    <div className="composition" data-testid="state-different_understandings">
      <section className="agreement-section" data-testid="agreement-section">
        {agreementContent}
      </section>
      <div className="agreement-boundary" data-testid="agreement-boundary" />
      <section className="proposal-band" data-testid="proposal-band">
        {proposalContent}
        <div className="understanding-pair" data-testid="understanding-pair">
          <div className="understanding-column" data-testid="provider-understanding">
            <h5 className="understanding-label">
              {DATA.PROVIDER_UNDERSTANDING.heading}
            </h5>
            <div className="difference-tick" />
            <p className="understanding-text">
              {DATA.PROVIDER_UNDERSTANDING.text}
            </p>
          </div>
          <div className="understanding-divider" />
          <div className="understanding-column" data-testid="client-understanding">
            <h5 className="understanding-label">CLIENT UNDERSTANDING</h5>
            <div className="difference-tick" />
            <p className="understanding-text">
              {DATA.CLIENT_UNDERSTANDING_DIFFERENT.text}
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  const sharedUnderstanding = (
    <div data-testid="state-shared_understanding">
      <div
        className="agreement-shell"
        data-testid="agreement-shell"
      >
        <section className="existing-agreement" data-testid="existing-agreement">
        {agreementContent}
      </section>
      <section className="shared-proposal-block" data-testid="shared-proposal-block">
        <div className="provenance-block" data-testid="provenance-block">
          {DATA.PROVENANCE.text}
        </div>
        {proposalContent}
        <div className="understanding-pair" data-testid="understanding-pair">
          <div className="understanding-column" data-testid="provider-understanding">
            <h5 className="understanding-label">
              {DATA.PROVIDER_UNDERSTANDING.heading}
            </h5>
            <p className="understanding-text">
              {DATA.PROVIDER_UNDERSTANDING.text}
            </p>
          </div>
          <div className="understanding-divider" />
          <div className="understanding-column" data-testid="client-understanding">
            <h5 className="understanding-label">CLIENT UNDERSTANDING</h5>
            <p className="understanding-text">
              {DATA.CLIENT_UNDERSTANDING_MATCH.text}
            </p>
          </div>
        </div>
      </section>
      </div>
    </div>
  );

  const declined = (
    <div className="composition" data-testid="state-declined">
      <section className="agreement-section" data-testid="agreement-section">
        {agreementContent}
      </section>
      <div className="agreement-boundary" data-testid="agreement-boundary" />
      <section className="proposal-band" data-testid="proposal-band">
        {proposalContent}
        <div className="understanding-pair" data-testid="understanding-pair">
          <div className="understanding-column" data-testid="provider-understanding">
            <h5 className="understanding-label">
              {DATA.PROVIDER_UNDERSTANDING.heading}
            </h5>
            <p className="understanding-text">
              {DATA.PROVIDER_UNDERSTANDING.text}
            </p>
          </div>
          <div className="understanding-divider" />
          <div className="understanding-column" data-testid="client-response">
            <h5 className="understanding-label">
              {DATA.CLIENT_RESPONSE_DECLINE.heading}
            </h5>
            <p className="understanding-text">
              {DATA.CLIENT_RESPONSE_DECLINE.text}
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  const renderState = () => {
    switch (state) {
      case "provider_capture":
        return providerCapture;
      case "client_review_unexpressed":
        return clientReviewUnexpressed;
      case "different_understandings":
        return differentUnderstandings;
      case "shared_understanding":
        return sharedUnderstanding;
      case "declined":
        return declined;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <div className="demo-control">
        <div className="control-label">DEMO CONTROL — NOT PRODUCT UI</div>
        <button
          className="control-button"
          data-testid="reset-demo"
          onClick={() => dispatch({ type: "RESET_DEMO" })}
        >
          RESET DEMO
        </button>
      </div>

      <div
        ref={stateLineRef}
        className="state-line"
        data-testid="state-line"
        aria-live="polite"
        role="status"
        tabIndex={-1}
      >
        <span className="state-tick" />
        {getStateText()}
      </div>

      {renderState()}
    </div>
  );
}

export default App;
