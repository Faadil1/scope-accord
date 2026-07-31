import * as DATA from "../day14Data";

/** The proposed change on espresso. Presentational only. */
export function ProposedChangePanel() {
  return (
    <section className="v2-proposal" data-testid="proposal-band">
      <div className="v2-doc-head">
        <h2 className="v2-eyebrow v2-eyebrow-signal">Proposed Change</h2>
        <p className="v2-doc-title">{DATA.REQUEST.title}</p>
      </div>

      <div className="v2-impact-figures">
        <div className="v2-impact-figure">
          <span className="v2-fact-label">Cost</span>
          <span className="v2-figure-lg">{DATA.EXPECTED_IMPACT.cost}</span>
        </div>
        <div className="v2-impact-figure">
          <span className="v2-fact-label">Venue access</span>
          <span className="v2-figure-lg">{DATA.EXPECTED_IMPACT.venueAccess}</span>
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
          {/* Literal casing: this label is asserted verbatim in the markup by
              the spike vocabulary test. CSS uppercases either way, so the
              rendering is unchanged. */}
          <span className="v2-fact-label">VENUE ACCESS STATUS</span>
          <span className="v2-uncertainty-value">
            {DATA.UNCERTAINTY.venueAccessStatus}
          </span>
        </div>
      </div>
    </section>
  );
}
