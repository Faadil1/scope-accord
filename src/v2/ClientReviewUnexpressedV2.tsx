import type { ReactNode } from "react";
import type { ContentRatio } from "../day14Types";
import { V2Shell } from "./V2Shell";
import { AgreementDocument } from "./AgreementDocument";
import { BoundaryRail } from "./BoundaryRail";
import { ProposedChangePanel } from "./ProposedChangePanel";
import { UnderstandingComparison } from "./UnderstandingComparison";

/**
 * The client has seen the proposed change and has not yet expressed an
 * understanding. Dispatch stays in App; this component only invokes callbacks.
 */
export function ClientReviewUnexpressedV2({
  ratio,
  stateLine,
  onReset,
  onMatch,
  onDifferent,
  onDecline,
}: {
  ratio: ContentRatio;
  stateLine: ReactNode;
  onReset: () => void;
  onMatch: () => void;
  onDifferent: () => void;
  onDecline: () => void;
}) {
  return (
    <V2Shell
      testId="state-client_review_unexpressed"
      stateLine={stateLine}
      onReset={onReset}
    >
      {/* The proposal is a real DOM sibling of the agreement, never a child. */}
      <div className="v2-canvas">
        <AgreementDocument ratio={ratio} />
        <BoundaryRail mode="unexpressed" />
        <ProposedChangePanel />
      </div>

      <UnderstandingComparison variant="unexpressed" />

      <div className="v2-action-row">
        <button
          type="button"
          className="v2-action v2-action-primary"
          data-testid="match-understanding"
          onClick={onMatch}
        >
          This matches my understanding
        </button>
        <button
          type="button"
          className="v2-action v2-action-secondary"
          data-testid="different-understanding"
          onClick={onDifferent}
        >
          I understood something different
        </button>
        <button
          type="button"
          className="v2-action v2-action-secondary"
          data-testid="decline-change"
          onClick={onDecline}
        >
          I do not want to add this
        </button>
      </div>
    </V2Shell>
  );
}
