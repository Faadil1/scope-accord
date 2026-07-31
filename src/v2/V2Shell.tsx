import type { ReactNode } from "react";
import * as DATA from "../day14Data";
import "./v2.css";

/* Sections are not implemented, so the rail is presentational only. */
const NAV_SECTIONS = [
  "Agreement",
  "Changes",
  "Conversations",
  "Files",
  "History",
] as const;

export type NavSection = (typeof NAV_SECTIONS)[number];

/**
 * The V2 product shell: identity, project metadata, Reset demo, numbered
 * navigation rail, ivory workspace and the shared conclusion slot.
 *
 * It holds no state-specific logic — each migrated state supplies its own
 * canvas as children and its own conclusion node.
 */
export function V2Shell({
  testId,
  children,
  stateLine,
  onReset,
  activeSection = "Changes",
}: {
  testId: string;
  children: ReactNode;
  stateLine: ReactNode;
  onReset: () => void;
  activeSection?: NavSection;
}) {
  return (
    <div className="v2-shell" data-testid={testId}>
      <header className="v2-topbar">
        <div className="v2-identity">
          <h1 className="v2-brand">Scope Accord</h1>
          <span className="v2-brand-rule" aria-hidden="true" />
        </div>
        <div className="v2-context">
          <span className="v2-context-project">
            {DATA.CURRENT_AGREEMENT.project}
          </span>
          <span className="v2-context-dot" aria-hidden="true" />
          <span className="v2-context-change">Change 01</span>
        </div>
        <div className="v2-utilities">
          <button
            type="button"
            className="control-button v2-utility"
            data-testid="reset-demo"
            onClick={onReset}
          >
            Reset demo
          </button>
        </div>
      </header>

      <div className="v2-body">
        <nav className="v2-nav" aria-label="Project sections">
          <ol className="v2-nav-list">
            {NAV_SECTIONS.map((section, index) => {
              const active = section === activeSection;
              return (
                <li
                  key={section}
                  className={
                    active ? "v2-nav-item v2-nav-item-active" : "v2-nav-item"
                  }
                  {...(active ? { "aria-current": "true" as const } : {})}
                >
                  <span className="v2-nav-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="v2-nav-label">{section}</span>
                </li>
              );
            })}
          </ol>
        </nav>

        <main className="v2-main">
          {children}
          <footer className="v2-footer">{stateLine}</footer>
        </main>
      </div>
    </div>
  );
}
