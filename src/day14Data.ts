import type { ContentRatio } from "./day14Types";

export const AGREEMENT_ITEMS_BY_RATIO: Record<ContentRatio, string[]> = {
  "1:1": ["COST", "DATE", "SCOPE"],
  "1:3": ["COST"],
  "3:1": ["COST", "DATE", "SCOPE", "VENUE"],
};

export const PROPOSAL_ITEMS_BY_RATIO: Record<ContentRatio, number> = {
  "1:1": 1,
  "1:3": 4,
  "3:1": 1,
};

export const CURRENT_AGREEMENT = {
  heading: "CURRENT AGREEMENT",
  project: "Corporate launch event",
  cost: "$10,000",
  date: "14 March",
  scope: "Core photography, Stage and lighting, Four-hour guest programme",
  venue: "Downtown Convention Center",
};

export const REQUEST = {
  heading: "REQUEST",
  title: "Add photo booth",
};

export const EXPECTED_IMPACT = {
  heading: "EXPECTED IMPACT",
  cost: "+$2,000",
  venueAccess: "+90 minutes",
  documentsAffected: "Floor-plan revision required",
};

export const UNCERTAINTY = {
  heading: "UNCERTAINTY",
  venueAccessStatus: "Not yet confirmed",
};

export const RECORDED_BY = {
  heading: "RECORDED BY",
  value: "Event producer",
};

export const RECORDED_AT = {
  heading: "RECORDED AT",
  value: "14 Mar · 10:24",
};

export const PROVIDER_UNDERSTANDING = {
  heading: "PROVIDER UNDERSTANDING",
  text: "Additional service with a $2,000 cost and additional venue-access time.",
};

export const CLIENT_UNDERSTANDING_DIFFERENT = {
  text: "Included in the current event-production package.",
};

export const CLIENT_UNDERSTANDING_MATCH = {
  text: "Additional service with a $2,000 cost and additional venue-access time.",
};

export const CLIENT_UNDERSTANDING_UNEXPRESSED = {
  text: "NOT YET EXPRESSED",
};

export const CLIENT_RESPONSE_DECLINE = {
  heading: "CLIENT RESPONSE",
  text: "I do not want to add this.",
};

export const PROVENANCE = {
  text: "PROPOSED 14 MAR · SAME UNDERSTANDING EXPRESSED 14 MAR · NOW SHOWN IN THE CURRENT AGREEMENT",
};
