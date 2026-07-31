/**
 * The structural gate between the current agreement and the proposed change.
 *
 * `agreement-boundary` stays the tested 2px element; the rail around it carries
 * the label and lock. The `absent` mode is reserved for shared_understanding,
 * where the proposal moves inside the agreement and no boundary exists.
 */
export type BoundaryMode = "recording" | "unexpressed" | "locked";

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

export function BoundaryRail({ mode }: { mode: BoundaryMode }) {
  return (
    <div className={`v2-rail v2-rail-${mode}`}>
      <span className="v2-rail-label">Outside current agreement</span>
      <span className="v2-rail-lock">
        <LockMark />
      </span>
      <div className="agreement-boundary" data-testid="agreement-boundary" />
    </div>
  );
}
