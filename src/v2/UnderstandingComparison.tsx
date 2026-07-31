import * as DATA from "../day14Data";

/* Emphasis derived from each statement. Never replaces the statement. */
const PROVIDER_EMPHASIS = "Additional service";
const CLIENT_EMPHASIS = "Included in current package";

export type ComparisonVariant = "different" | "unexpressed";

function Interpretation({
  testId,
  label,
  emphasis,
  statement,
  showTick,
}: {
  testId: string;
  label: string;
  emphasis: string;
  statement: string;
  showTick: boolean;
}) {
  return (
    <div className="understanding-column" data-testid={testId}>
      <h3 className="understanding-label">{label}</h3>
      {showTick && <div className="difference-tick" />}
      <p className="v2-emphasis">{emphasis}</p>
      <p className="understanding-text">{statement}</p>
    </div>
  );
}

/**
 * Provider and client interpretations at equal width and hierarchy.
 *
 * `different` — both sides expressed, meanings conflict.
 * `unexpressed` — one expression exists, the other does not yet exist.
 */
export function UnderstandingComparison({
  variant,
}: {
  variant: ComparisonVariant;
}) {
  const isDifferent = variant === "different";

  return (
    <section className={`v2-comparison v2-comparison-${variant}`}>
      <div className="v2-comparison-head">
        {/* Only the provider has expressed an understanding in the unexpressed
            variant, so the heading states status rather than claiming both
            sides have expressed. */}
        <h2 className="v2-eyebrow">
          {isDifferent ? "Expressed Understandings" : "Understanding Status"}
        </h2>
        {isDifferent && (
          <p className="v2-annotation" aria-hidden="true">
            <span>Same request</span>
            <span className="v2-annotation-break" />
            <span>Different meaning</span>
          </p>
        )}
      </div>

      {isDifferent && (
        <p className="v2-comparison-note">
          The two expressions below do not describe the same impact.
        </p>
      )}

      <div
        className={
          isDifferent
            ? "understanding-pair"
            : "understanding-pair unexpressed v2-pair-unexpressed"
        }
        data-testid="understanding-pair"
      >
        <Interpretation
          testId="provider-understanding"
          label={DATA.PROVIDER_UNDERSTANDING.heading}
          emphasis={PROVIDER_EMPHASIS}
          statement={DATA.PROVIDER_UNDERSTANDING.text}
          showTick={isDifferent}
        />

        <div
          className={
            isDifferent
              ? "understanding-divider"
              : "understanding-divider dashed"
          }
        />

        {isDifferent ? (
          <Interpretation
            testId="client-understanding"
            label="CLIENT UNDERSTANDING"
            emphasis={CLIENT_EMPHASIS}
            statement={DATA.CLIENT_UNDERSTANDING_DIFFERENT.text}
            showTick
          />
        ) : (
          <div
            className="understanding-column"
            data-testid="client-understanding"
          >
            <h3 className="understanding-label">CLIENT UNDERSTANDING</h3>
            <div className="v2-unexpressed">
              <p className="v2-unexpressed-value understanding-text">
                {DATA.CLIENT_UNDERSTANDING_UNEXPRESSED.text}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
