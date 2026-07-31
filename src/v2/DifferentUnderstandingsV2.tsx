import type { ReactNode } from "react";
import type { ContentRatio } from "../day14Types";
import * as DATA from "../day14Data";
import "./v2.css";

const NAV_SECTIONS = [
  "Agreement",
  "Changes",
  "Conversations",
  "Files",
  "History",
] as const;

const ACTIVE_SECTION = "Changes";

function LockMark() {
  return (
    <svg
      width="12"
      height="14"
      viewBox="0 0 12 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="1" y="6" width="10" height="7" rx="1" />
      <path d="M3.4 6V3.9a2.6 2.6 0 0 1 5.2 0V6" />
    </svg>
  );
}

function LedgerRow({
  label,
  value,
  figure = false,
}: {
  label: string;
  value: string;
  figure?: boolean;
}) {
  return (
    <div className="v2-ledger-row">
      <span className="v2-ledger-label">{label}</span>
      <span className={figure ? "v2-ledger-value v2-figure" : "v2-ledger-value"}>
        {value}
      </span>
    </div>
  );
}

export function DifferentUnderstandingsV2({
  ratio,
  stateLine,
  onReset,
}: {
  ratio: ContentRatio;
  stateLine: ReactNode;
  onReset: () => void;
}) {
  const items = DATA.AGREEMENT_ITEMS_BY_RATIO[ratio];

  return (
    <div className="v2-shell" data-testid="state-different_understandings">
      <header className="v2-topbar">
        <h1 className="v2-brand">Scope Accord</h1>
        <div className="v2-context">
          <span>{DATA.CURRENT_AGREEMENT.project}</span>
          <span className="v2-context-rule" aria-hidden="true" />
          <span className="v2-context-change">Change 01</span>
        </div>
        <div className="v2-utilities">
          <button
            type="button"
            className="control-button v2-utility"
            data-testid="reset-demo"
            onClick={onReset}
          >
            Reset demo
          </button>
        </div>
      </header>

      <div className="v2-body">
        <nav className="v2-nav" aria-label="Project sections">
          <ul className="v2-nav-list">
            {NAV_SECTIONS.map((section) => (
              <li
                key={section}
                className="v2-nav-item"
                {...(section === ACTIVE_SECTION
                  ? { "aria-current": "true" as const }
                  : {})}
              >
                {section}
              </li>
            ))}
          </ul>
        </nav>

        <main className="v2-main">
          {/* The proposal is a real DOM sibling of the agreement, never a child. */}
          <div className="v2-canvas">
            <section className="v2-agreement" data-testid="agreement-section">
              <h2 className="v2-region-label">Current Agreement</h2>
              <div className="v2-agreement-foundations">
                <p className="v2-doc-title">{DATA.CURRENT_AGREEMENT.project}</p>
                <div className="v2-foundation-meta">
                  <span>{DATA.CURRENT_AGREEMENT.venue}</span>
                </div>
              </div>
              <div className="v2-ledger">
                {items.includes("COST") && (
                  <LedgerRow
                    label="Cost"
                    value={DATA.CURRENT_AGREEMENT.cost}
                    figure
                  />
                )}
                {items.includes("DATE") && (
                  <LedgerRow
                    label="Date"
                    value={DATA.CURRENT_AGREEMENT.date}
                    figure
                  />
                )}
                {items.includes("SCOPE") && (
                  <LedgerRow label="Scope" value={DATA.CURRENT_AGREEMENT.scope} />
                )}
                {items.includes("VENUE") && (
                  <LedgerRow label="Venue" value={DATA.CURRENT_AGREEMENT.venue} />
                )}
              </div>
            </section>

            <div className="v2-rail">
              <span className="v2-rail-label">Outside current agreement</span>
              <span className="v2-rail-lock">
                <LockMark />
              </span>
              <div
                className="agreement-boundary"
                data-testid="agreement-boundary"
              />
            </div>

            <section className="v2-proposal" data-testid="proposal-band">
              <h2 className="v2-region-label">Proposed Change</h2>
              <div className="v2-proposal-head">
                <p className="v2-doc-title">{DATA.REQUEST.title}</p>
              </div>
              <div className="v2-ledger">
                <LedgerRow
                  label="Cost"
                  value={DATA.EXPECTED_IMPACT.cost}
                  figure
                />
                <LedgerRow
                  label="Venue access"
                  value={DATA.EXPECTED_IMPACT.venueAccess}
                  figure
                />
                <LedgerRow
                  label="Dependency"
                  value={DATA.EXPECTED_IMPACT.documentsAffected}
                />
              </div>
              <div className="v2-uncertainty">
                <h3 className="v2-region-label">{DATA.UNCERTAINTY.heading}</h3>
                <div className="v2-uncertainty-row">
                  <span className="v2-uncertainty-label">
                    Venue access status
                  </span>
                  <span className="v2-uncertainty-value">
                    {DATA.UNCERTAINTY.venueAccessStatus}
                  </span>
                </div>
              </div>
            </section>
          </div>

          <section className="v2-comparison">
            <div className="v2-comparison-head">
              <h2 className="v2-region-label">Expressed Understandings</h2>
            </div>
            <p className="v2-comparison-note">
              The two expressions below do not describe the same impact.
            </p>
            <div className="understanding-pair" data-testid="understanding-pair">
              <div
                className="understanding-column"
                data-testid="provider-understanding"
              >
                <h3 className="understanding-label">
                  {DATA.PROVIDER_UNDERSTANDING.heading}
                </h3>
                <div className="difference-tick" />
                <p className="understanding-text">
                  {DATA.PROVIDER_UNDERSTANDING.text}
                </p>
              </div>
              <div className="understanding-divider" />
              <div
                className="understanding-column"
                data-testid="client-understanding"
              >
                <h3 className="understanding-label">CLIENT UNDERSTANDING</h3>
                <div className="difference-tick" />
                <p className="understanding-text">
                  {DATA.CLIENT_UNDERSTANDING_DIFFERENT.text}
                </p>
              </div>
            </div>
          </section>

          <footer className="v2-footer">
            {stateLine}
            <div className="v2-actions">
              <button type="button" className="v2-action v2-action-primary">
                Request clarification
              </button>
              <button type="button" className="v2-action">
                Add conversation
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
