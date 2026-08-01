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
 * The provider is recording a proposed addition. The client has not entered
 * the flow, so there is no comparison — only provenance and the provider's
 * own expressed understanding.
 *
 * Dispatch stays in App; this component only invokes callbacks.
 */
export function ProviderCaptureV2({
  ratio,
  stateLine,
  onReset,
  onRecordProposal,
}: {
  ratio: ContentRatio;
  stateLine: ReactNode;
  onReset: () => void;
  onRecordProposal: () => void;
}) {
  return (
    <V2Shell
      testId="state-provider_capture"
      stateLine={stateLine}
      onReset={onReset}
    >
      {/* The proposal is a real DOM sibling of the agreement, never a child. */}
      <div className="v2-canvas">
        <AgreementDocument ratio={ratio} />
        <BoundaryRail mode="recording" />
        <ProposedChangePanel />
      </div>

      <section className="v2-capture">
        <div className="v2-comparison-head">
          <h2 className="v2-eyebrow">Provider Capture</h2>
        </div>

        <div className="v2-capture-grid">
          {/* Provenance is a factual record, not an identity proof, so it is
              a description list rather than form labels. */}
          <dl className="v2-provenance">
            <div className="v2-provenance-item">
              <dt className="v2-provenance-label">{DATA.RECORDED_BY.heading}</dt>
              <dd className="v2-provenance-value">{DATA.RECORDED_BY.value}</dd>
            </div>
            <div className="v2-provenance-item">
              <dt className="v2-provenance-label">{DATA.RECORDED_AT.heading}</dt>
              <dd className="v2-provenance-value v2-provenance-figure">
                {DATA.RECORDED_AT.value}
              </dd>
            </div>
          </dl>

          <div className="v2-capture-divider" aria-hidden="true" />

          <div className="v2-record" data-testid="provider-understanding">
            <h3 className="v2-record-label">
              {DATA.PROVIDER_UNDERSTANDING.heading}
            </h3>
            <p className="v2-emphasis v2-record-emphasis">
              {PROVIDER_EMPHASIS}
            </p>
            <p className="v2-record-statement">
              {DATA.PROVIDER_UNDERSTANDING.text}
            </p>
          </div>
        </div>
      </section>

      <div className="v2-action-single">
        <button
          type="button"
          className="v2-action v2-action-record"
          data-testid="record-proposal"
          onClick={onRecordProposal}
        >
          Record proposal
        </button>
      </div>
    </V2Shell>
  );
}
