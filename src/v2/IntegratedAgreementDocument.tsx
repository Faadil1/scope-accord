import type { ContentRatio } from "../day14Types";
import * as DATA from "../day14Data";
import { AgreementDocument } from "./AgreementDocument";

/* When the proposal and the matching expression happened. It records timing,
   nothing more — the third clause of the source string belongs to the state
   conclusion, not to this line. */
const INTEGRATION_PROVENANCE = DATA.PROVENANCE.text
  .split(" · ")
  .slice(0, 2)
  .join(" · ");

/**
 * One ivory agreement document containing both the existing agreement and the
 * newly integrated change.
 *
 * The change is a real DOM descendant of the shell — not an overlay, not a
 * neighbouring card, not a repositioned panel. There is no boundary element
 * and no space reserved for one.
 */
export function IntegratedAgreementDocument({ ratio }: { ratio: ContentRatio }) {
  return (
    <div className="v2-shared" data-testid="shared-agreement-shell">
      <div className="v2-shared-grid" data-testid="agreement-shell">
        <AgreementDocument
          ratio={ratio}
          variant="integrated"
          testId="shared-existing-agreement"
        />

        <section
          className="v2-shared-change"
          data-testid="shared-proposal-block"
        >
          <div className="v2-integrated" data-testid="shared-integrated-change">
            <p className="v2-integration-provenance">
              {INTEGRATION_PROVENANCE}
            </p>

            <div className="v2-integrated-head">
              <h2 className="v2-eyebrow v2-eyebrow-quiet">Change 01</h2>
              <p className="v2-integrated-title">{DATA.REQUEST.title}</p>
            </div>

            <div className="v2-integrated-figures">
              <div className="v2-integrated-figure">
                <span className="v2-fact-label">Cost</span>
                <span className="v2-integrated-amount">
                  {DATA.EXPECTED_IMPACT.cost}
                </span>
              </div>
              <div className="v2-integrated-figure">
                <span className="v2-fact-label">Venue access</span>
                <span className="v2-integrated-amount">
                  {DATA.EXPECTED_IMPACT.venueAccess}
                </span>
              </div>
            </div>

            <div className="v2-integrated-note">
              <span className="v2-fact-label">Dependency</span>
              <span className="v2-integrated-note-value">
                {DATA.EXPECTED_IMPACT.documentsAffected}
              </span>
            </div>

            {/* The shared understanding did not resolve this. */}
            <div className="v2-integrated-uncertainty">
              <h3 className="v2-eyebrow v2-eyebrow-quiet">
                {DATA.UNCERTAINTY.heading}
              </h3>
              <div className="v2-integrated-uncertainty-row">
                <span className="v2-fact-label">VENUE ACCESS STATUS</span>
                <span className="v2-integrated-note-value">
                  {DATA.UNCERTAINTY.venueAccessStatus}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
