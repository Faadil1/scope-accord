import type { ContentRatio } from "../day14Types";
import * as DATA from "../day14Data";

/* The commitment register reuses the existing scope string; nothing new is
   introduced, the items are only given their own lines. */
const SCOPE_ITEMS = DATA.CURRENT_AGREEMENT.scope.split(", ");

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

/** The current agreement as an ivory document page. Presentational only. */
export function AgreementDocument({ ratio }: { ratio: ContentRatio }) {
  const items = DATA.AGREEMENT_ITEMS_BY_RATIO[ratio];

  return (
    <section className="v2-agreement" data-testid="agreement-section">
      <div className="v2-doc-head">
        <h2 className="v2-eyebrow">Current Agreement</h2>
        <p className="v2-doc-title">{DATA.CURRENT_AGREEMENT.project}</p>
        <p className="v2-doc-sub">{DATA.CURRENT_AGREEMENT.venue}</p>
      </div>

      {/* Venue is carried once, as subtext under the title, so it is never
          repeated here. */}
      <div className="v2-facts">
        {items.includes("COST") && (
          <Fact label="Cost" value={DATA.CURRENT_AGREEMENT.cost} mono />
        )}
        {items.includes("DATE") && (
          <Fact label="Date" value={DATA.CURRENT_AGREEMENT.date} mono />
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
  );
}
