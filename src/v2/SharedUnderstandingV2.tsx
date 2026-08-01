import type { ReactNode } from "react";
import type { ContentRatio } from "../day14Types";
import { V2Shell } from "./V2Shell";
import { IntegratedAgreementDocument } from "./IntegratedAgreementDocument";
import { UnderstandingComparison } from "./UnderstandingComparison";

/**
 * Both parties expressed the same understanding, so the change is now shown
 * inside the current agreement.
 *
 * There is no boundary rail and no outside panel here: the boundary has not
 * changed colour, it no longer exists.
 */
export function SharedUnderstandingV2({
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
      testId="state-shared_understanding"
      stateLine={stateLine}
      onReset={onReset}
    >
      <IntegratedAgreementDocument ratio={ratio} />
      <UnderstandingComparison variant="shared" />
    </V2Shell>
  );
}
