import type { ReactNode } from "react";
import type { ContentRatio } from "../day14Types";
import * as DATA from "../day14Data";
import "./v2.css";

/* Sections are not implemented, so the rail is presentational only. */
const NAV_SECTIONS = [
  "Agreement",
  "Changes",
  "Conversations",
  "Files",
  "History",
] as const;

const ACTIVE_SECTION = "Changes";

/* The commitment register reuses the existing scope string; nothing new is
   introduced, the items are only given their own lines. */
const SCOPE_ITEMS = DATA.CURRENT_AGREEMENT.scope.split(", ");

/* Emphasis derived from each statement. Never replaces the statement. */
const PROVIDER_EMPHASIS = "Additional service";
const CLIENT_EMPHASIS = "Included in current package";

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

/* Monospace is opt-in: it belongs to amounts, dates and durations only. */
function Fact({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="v2-fact">
      <span className="v2-fact-label">{label}</span>
      <span className={mono ? "v2-fact-value v2-fact-figure" : "v2-fact-value"}>
        {value}
      </span>
    </div>
  );
}

function Interpretation({
  testId,
  label,
  emphasis,
  statement,
}: {
  testId: string;
  label: string;
  emphasis: string;
  statement: string;
}) {
  return (
    <div className="understanding-column" data-testid={testId}>
      <h3 className="understanding-label">{label}</h3>
      <div className="difference-tick" />
      <p className="v2-emphasis">{emphasis}</p>
      <p className="understanding-text">{statement}</p>
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
        <div className="v2-identity">
          <h1 className="v2-brand">Scope Accord</h1>
          <span className="v2-brand-rule" aria-hidden="true" />
        </div>
        <div className="v2-context">
          <span className="v2-context-project">
            {DATA.CURRENT_AGREEMENT.project}
          </span>
          <span className="v2-context-dot" aria-hidden="true" />
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
          <ol className="v2-nav-list">
            {NAV_SECTIONS.map((section, index) => {
              const active = section === ACTIVE_SECTION;
              return (
                <li
                  key={section}
                  className={
                    active ? "v2-nav-item v2-nav-item-active" : "v2-nav-item"
                  }
                  {...(active ? { "aria-current": "true" as const } : {})}
                >
                  <span className="v2-nav-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="v2-nav-label">{section}</span>
                </li>
              );
            })}
          </ol>
        </nav>

        <main className="v2-main">
          {/* The proposal is a real DOM sibling of the agreement, never a child. */}
          <div className="v2-canvas">
            <section className="v2-agreement" data-testid="agreement-section">
              <div className="v2-doc-head">
                <h2 className="v2-eyebrow">Current Agreement</h2>
                <p className="v2-doc-title">{DATA.CURRENT_AGREEMENT.project}</p>
                <p className="v2-doc-sub">{DATA.CURRENT_AGREEMENT.venue}</p>
              </div>

              <div className="v2-facts">
                {items.includes("COST") && (
                  <Fact label="Cost" value={DATA.CURRENT_AGREEMENT.cost} mono />
                )}
                {items.includes("DATE") && (
                  <Fact label="Date" value={DATA.CURRENT_AGREEMENT.date} mono />
                )}
                {items.includes("VENUE") && (
                  <Fact label="Venue" value={DATA.CURRENT_AGREEMENT.venue} />
                )}
              </div>

              {items.includes("SCOPE") && (
                <div className="v2-register">
                  <h3 className="v2-eyebrow v2-eyebrow-quiet">Included scope</h3>
                  <ol className="v2-register-list">
                    {SCOPE_ITEMS.map((item, index) => (
                      <li className="v2-register-item" key={item}>
                        <span className="v2-register-index" aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="v2-register-text">{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <p className="v2-folio" aria-hidden="true">
                <span>Agreement</span>
                <span className="v2-folio-rule" />
                <span className="v2-folio-index">01</span>
              </p>
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
              <div className="v2-doc-head">
                <h2 className="v2-eyebrow v2-eyebrow-signal">Proposed Change</h2>
                <p className="v2-doc-title">{DATA.REQUEST.title}</p>
              </div>

              <div className="v2-impact-figures">
                <div className="v2-impact-figure">
                  <span className="v2-fact-label">Cost</span>
                  <span className="v2-figure-lg">
                    {DATA.EXPECTED_IMPACT.cost}
                  </span>
                </div>
                <div className="v2-impact-figure">
                  <span className="v2-fact-label">Venue access</span>
                  <span className="v2-figure-lg">
                    {DATA.EXPECTED_IMPACT.venueAccess}
                  </span>
                </div>
              </div>

              <div className="v2-impact-note">
                <span className="v2-fact-label">Dependency</span>
                <span className="v2-impact-note-value">
                  {DATA.EXPECTED_IMPACT.documentsAffected}
                </span>
              </div>

              <div className="v2-uncertainty">
                <h3 className="v2-eyebrow v2-eyebrow-signal">
                  {DATA.UNCERTAINTY.heading}
                </h3>
                <div className="v2-uncertainty-row">
                  <span className="v2-fact-label">Venue access status</span>
                  <span className="v2-uncertainty-value">
                    {DATA.UNCERTAINTY.venueAccessStatus}
                  </span>
                </div>
              </div>
            </section>
          </div>

          <section className="v2-comparison">
            <div className="v2-comparison-head">
              <h2 className="v2-eyebrow">Expressed Understandings</h2>
              <p className="v2-annotation" aria-hidden="true">
                <span>Same request</span>
                <span className="v2-annotation-break" />
                <span>Different meaning</span>
              </p>
            </div>
            <p className="v2-comparison-note">
              The two expressions below do not describe the same impact.
            </p>
            <div className="understanding-pair" data-testid="understanding-pair">
              <Interpretation
                testId="provider-understanding"
                label={DATA.PROVIDER_UNDERSTANDING.heading}
                emphasis={PROVIDER_EMPHASIS}
                statement={DATA.PROVIDER_UNDERSTANDING.text}
              />
              <div className="understanding-divider" />
              <Interpretation
                testId="client-understanding"
                label="CLIENT UNDERSTANDING"
                emphasis={CLIENT_EMPHASIS}
                statement={DATA.CLIENT_UNDERSTANDING_DIFFERENT.text}
              />
            </div>
          </section>

          <footer className="v2-footer">{stateLine}</footer>
        </main>
      </div>
    </div>
  );
}
