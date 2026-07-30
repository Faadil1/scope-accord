export type Day14State =
  | "provider_capture"
  | "client_review_unexpressed"
  | "different_understandings"
  | "shared_understanding"
  | "declined";

export type Day14Event =
  | { type: "RECORD_PROPOSAL" }
  | { type: "EXPRESS_MATCH" }
  | { type: "EXPRESS_DIFFERENCE" }
  | { type: "DECLINE_CHANGE" }
  | { type: "RESET_DEMO" }
  | { type: "JUMP_TO_STATE"; payload: Day14State };

export type ContentRatio = "1:1" | "1:3" | "3:1";

export interface Day14ContextType {
  state: Day14State;
  ratio: ContentRatio;
}
