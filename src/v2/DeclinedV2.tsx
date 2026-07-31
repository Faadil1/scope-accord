import type { ReactNode } from "react";
import type { ContentRatio } from "../day14Types";
import * as DATA from "../day14Data";
import { V2Shell } from "./V2Shell";
import { AgreementDocument } from "./AgreementDocument";
import { BoundaryRail } from "./BoundaryRail";
import { ProposedChangePanel } from "./ProposedChangePanel";

/* Emphasis derived from the statement. Never replaces the statement. */
const PROVIDER_EMPHASIS = "Additional service";

/**
 * The client does not want to add the proposed change, so the proposal stays
 * outside the current agreement. This is a recorded response, not a
 * disagreement and not a failure — the two parties are simply not adding it.
 *
 * Terminal branch: no response controls. Reset demo lives in the shell.
 */
export function DeclinedV2({
  ratio,
  stateLine,
  onReset,
}: {
  ratio: ContentRatio;
  stateLine: ReactNode;
  onReset: () => void;
}) {
  return (
    <V2Shell testId="state-declined" stateLine={stateLine} onReset={onReset}>
      {/* The proposal is a real DOM sibling of the agreement, never a child. */}
      <div className="v2-canvas">
        <AgreementDocument ratio={ratio} />
        <BoundaryRail mode="declined" />
        <ProposedChangePanel />
      </div>

      <section className="v2-response">
        <div className="v2-comparison-head">
          <h2 className="v2-eyebrow">Change Response</h2>
        </div>

        <div className="v2-response-grid">
          <div
            className="v2-response-region"
            data-testid="provider-understanding"
          >
            <h3 className="v2-response-label">
              {DATA.PROVIDER_UNDERSTANDING.heading}
            </h3>
            <p className="v2-emphasis v2-response-emphasis">
              {PROVIDER_EMPHASIS}
            </p>
            <p className="v2-response-statement">
              {DATA.PROVIDER_UNDERSTANDING.text}
            </p>
          </div>

          <div className="v2-response-divider" aria-hidden="true" />

          <div className="v2-response-region" data-testid="client-response">
            <h3 className="v2-response-label">
              {DATA.CLIENT_RESPONSE_DECLINE.heading}
            </h3>
            <p className="v2-emphasis v2-response-emphasis">
              {DATA.CLIENT_RESPONSE_DECLINE.text}
            </p>
          </div>
        </div>
      </section>
    </V2Shell>
  );
}
