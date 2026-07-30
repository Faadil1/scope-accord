import type { Day14State, Day14Event } from "./day14Types";

export const day14InitialState: Day14State = "provider_capture";

export function day14Reducer(state: Day14State, event: Day14Event): Day14State {
  switch (state) {
    case "provider_capture":
      if (event.type === "RECORD_PROPOSAL") {
        return "client_review_unexpressed";
      }
      return state;

    case "client_review_unexpressed":
      if (event.type === "EXPRESS_MATCH") {
        return "shared_understanding";
      }
      if (event.type === "EXPRESS_DIFFERENCE") {
        return "different_understandings";
      }
      if (event.type === "DECLINE_CHANGE") {
        return "declined";
      }
      return state;

    case "different_understandings":
      if (event.type === "RESET_DEMO") {
        return "provider_capture";
      }
      return state;

    case "shared_understanding":
      if (event.type === "RESET_DEMO") {
        return "provider_capture";
      }
      return state;

    case "declined":
      if (event.type === "RESET_DEMO") {
        return "provider_capture";
      }
      return state;

    default:
      return state;
  }
}
