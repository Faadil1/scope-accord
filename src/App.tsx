import { useReducer, useMemo, useRef, useEffect } from "react";
import "./App.css";
import {
  day14Reducer,
  day14InitialState,
} from "./day14Reducer";
import type { Day14State } from "./day14Types";
import { DifferentUnderstandingsV2 } from "./v2/DifferentUnderstandingsV2";
import { ClientReviewUnexpressedV2 } from "./v2/ClientReviewUnexpressedV2";
import { ProviderCaptureV2 } from "./v2/ProviderCaptureV2";
import { DeclinedV2 } from "./v2/DeclinedV2";
import { SharedUnderstandingV2 } from "./v2/SharedUnderstandingV2";

type ContentRatio = "1:1" | "1:3" | "3:1";

function App() {
  const [state, dispatch] = useReducer(day14Reducer, day14InitialState);
  const stateLineRef = useRef<HTMLDivElement>(null);

  // Focus management: restore focus to the state line when a real transition
  // removes the control that had it.
  //
  // The guard tracks the previous state rather than a "has mounted" flag so it
  // stays correct under StrictMode, which invokes effects twice on mount: a
  // boolean flag would be consumed by the first invocation and let the second
  // one steal focus on the landing screen.
  const previousStateRef = useRef<Day14State | null>(null);

  useEffect(() => {
    const previousState = previousStateRef.current;
    previousStateRef.current = state;

    // No transition has happened yet, so there is nothing to restore.
    if (previousState === null || previousState === state) {
      return;
    }

    const activeEl = document.activeElement as HTMLElement | null;
    if (
      activeEl === document.body ||
      (activeEl && !activeEl.isConnected)
    ) {
      stateLineRef.current?.focus({ preventScroll: true });
    }
  }, [state]);

  // Dev-only fixture handling via query parameter
  const ratio = useMemo(() => {
    if (typeof window === "undefined") return "1:1";
    if (!import.meta.env.DEV) return "1:1"; // Production always uses 1:1

    const params = new URLSearchParams(window.location.search);
    const fixture = params.get("fixture") as ContentRatio | null;
    return (fixture && ["1:1", "1:3", "3:1"].includes(fixture)) ? fixture : "1:1";
  }, []);

  const getStateText = (): string => {
    switch (state) {
      case "provider_capture":
        return "PROVIDER RECORDING PROPOSAL · PROPOSAL REMAINS OUTSIDE THE CURRENT AGREEMENT";
      case "client_review_unexpressed":
        return "CLIENT UNDERSTANDING NOT YET EXPRESSED · PROPOSAL REMAINS OUTSIDE THE CURRENT AGREEMENT";
      case "different_understandings":
        return "UNDERSTANDINGS DIFFER · PROPOSAL REMAINS OUTSIDE THE CURRENT AGREEMENT";
      case "shared_understanding":
        return "PROPOSED 14 MAR · SAME UNDERSTANDING EXPRESSED 14 MAR · NOW SHOWN IN THE CURRENT AGREEMENT";
      case "declined":
        return "CLIENT DOES NOT WANT TO ADD THIS · PROPOSAL REMAINS OUTSIDE THE CURRENT AGREEMENT";
      default:
        return "";
    }
  };

  // The status text carries two clauses joined by a separator. Splitting it
  // into spans lets the conclusion present them on separate lines while the
  // rendered string stays byte-identical to getStateText().
  const [primaryClause, ...restClauses] = getStateText().split(" · ");
  const secondaryClause = restClauses.join(" · ");

  // Single state-line instance so the focus ref and aria-live contract hold
  // in every state, including the V2 composition.
  const stateLine = (
    <div
      ref={stateLineRef}
      className="state-line"
      data-testid="state-line"
      aria-live="polite"
      role="status"
      tabIndex={-1}
    >
      <span className="state-tick" />
      <span className="state-line-text">
        <span className="state-clause-primary">{primaryClause}</span>
        {secondaryClause && (
          <>
            <span className="state-clause-separator"> · </span>
            <span className="state-clause-secondary">{secondaryClause}</span>
          </>
        )}
      </span>
    </div>
  );

  if (state === "shared_understanding") {
    return (
      <SharedUnderstandingV2
        ratio={ratio}
        stateLine={stateLine}
        onReset={() => dispatch({ type: "RESET_DEMO" })}
      />
    );
  }

  if (state === "provider_capture") {
    return (
      <ProviderCaptureV2
        ratio={ratio}
        stateLine={stateLine}
        onReset={() => dispatch({ type: "RESET_DEMO" })}
        onRecordProposal={() => dispatch({ type: "RECORD_PROPOSAL" })}
      />
    );
  }

  if (state === "declined") {
    return (
      <DeclinedV2
        ratio={ratio}
        stateLine={stateLine}
        onReset={() => dispatch({ type: "RESET_DEMO" })}
      />
    );
  }

  if (state === "different_understandings") {
    return (
      <DifferentUnderstandingsV2
        ratio={ratio}
        stateLine={stateLine}
        onReset={() => dispatch({ type: "RESET_DEMO" })}
      />
    );
  }

  if (state === "client_review_unexpressed") {
    return (
      <ClientReviewUnexpressedV2
        ratio={ratio}
        stateLine={stateLine}
        onReset={() => dispatch({ type: "RESET_DEMO" })}
        onMatch={() => dispatch({ type: "EXPRESS_MATCH" })}
        onDifferent={() => dispatch({ type: "EXPRESS_DIFFERENCE" })}
        onDecline={() => dispatch({ type: "DECLINE_CHANGE" })}
      />
    );
  }

  // Every product state routes through the V2 system above.
  return null;
}

export default App;
