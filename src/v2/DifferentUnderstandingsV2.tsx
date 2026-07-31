import type { ReactNode } from "react";
import type { ContentRatio } from "../day14Types";
import { V2Shell } from "./V2Shell";
import { AgreementDocument } from "./AgreementDocument";
import { BoundaryRail } from "./BoundaryRail";
import { ProposedChangePanel } from "./ProposedChangePanel";
import { UnderstandingComparison } from "./UnderstandingComparison";

export function DifferentUnderstandingsV2({
  ratio,
  stateLine,
  onReset,
}: {
  ratio: ContentRatio;
  stateLine: ReactNode;
  onReset: () => void;
}) {
  return (
    <V2Shell
      testId="state-different_understandings"
      stateLine={stateLine}
      onReset={onReset}
    >
      {/* The proposal is a real DOM sibling of the agreement, never a child. */}
      <div className="v2-canvas">
        <AgreementDocument ratio={ratio} />
        <BoundaryRail mode="locked" />
        <ProposedChangePanel />
      </div>

      <UnderstandingComparison variant="different" />
    </V2Shell>
  );
}
