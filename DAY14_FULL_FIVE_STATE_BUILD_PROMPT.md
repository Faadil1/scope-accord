# DAY 14 — FULL FIVE-STATE PRODUCT BUILD

## Mission

Build the complete Day 14 interactive prototype from the validated technical spike.

Start from the committed spike:

```text
commit: fc138ea
tag: day14-spike-pass
branch: feat/day14-full-build
```

The technical spike is frozen evidence.

Do not rewrite its geometry from scratch.
Do not weaken any verified behaviour.
Do not modify the `day14-spike-pass` tag.

The full build must implement the complete five-state product flow and preserve the validated SAFE — The Structural Grid direction.

---

## Authoritative source order

1. `day14-visual-contract-safe.md`
2. Final semantic patches and locks in this prompt
3. Validated spike commit `fc138ea`
4. Older arbitration or exploration files only where they do not conflict

Do not reopen:

- the problem;
- the event-production context;
- the human moment;
- the mechanism;
- the SAFE direction;
- the core boundary geometry.

Do not hybridise with BOLD or THE THRESHOLD.
Do not add unrelated product features.
Do not add a backend.
Do not name the product yet.

---

## Locked problem

```text
AGREEMENT BOUNDARY DRIFT
```

A client asks an event producer to add a photo booth.

The producer understands the request as an additional service.

The client may:

- understand it as included;
- understand the stated impact;
- decline the addition;
- or not yet express an understanding.

The interface makes those expressed understandings and their relationship visible.

It does not verify:

- truth;
- legality;
- contractual validity;
- consent;
- liability;
- approval.

---

## Locked mechanism

A proposed request remains visibly outside the current agreement until both parties express the same understanding of its impact.

The product must preserve:

- the current agreement;
- the proposed change;
- provider-stated impact;
- uncertainty;
- provider understanding;
- client understanding or response;
- whether the expressions currently match;
- provenance after integration.

---

## Locked stack

Use exactly:

- React
- TypeScript
- Vite
- plain CSS
- CSS Grid
- CSS custom properties
- `useReducer`
- Playwright

Optional only if installation succeeds:

- `@axe-core/playwright`

Do not use:

- Next.js;
- Tailwind;
- Framer Motion;
- GSAP;
- component libraries;
- XState;
- backend services;
- database;
- authentication;
- APIs;
- fake latency;
- toasts;
- modals for the core flow.

---

## Git safety

Before editing:

```bash
git status
git rev-parse --short HEAD
git tag --list
git branch --show-current
```

Expected:

```text
HEAD derived from fc138ea
tag day14-spike-pass exists
branch feat/day14-full-build
```

Create a checkpoint commit before major visual QA:

```bash
git add .
git commit -m "feat(day14): implement five-state agreement flow"
```

Do not rewrite spike history.

---

## Final state model

Use exactly:

```ts
type Day14State =
  | "provider_capture"
  | "client_review_unexpressed"
  | "different_understandings"
  | "shared_understanding"
  | "declined";
```

Use a typed reducer.

Events:

```ts
type Day14Event =
  | { type: "RECORD_PROPOSAL" }
  | { type: "EXPRESS_MATCH" }
  | { type: "EXPRESS_DIFFERENCE" }
  | { type: "DECLINE_CHANGE" }
  | { type: "RESET_DEMO" };
```

Required transitions:

```text
provider_capture
  --RECORD_PROPOSAL-->
client_review_unexpressed

client_review_unexpressed
  --EXPRESS_MATCH-->
shared_understanding

client_review_unexpressed
  --EXPRESS_DIFFERENCE-->
different_understandings

client_review_unexpressed
  --DECLINE_CHANGE-->
declined

different_understandings
  --RESET_DEMO-->
provider_capture

shared_understanding
  --RESET_DEMO-->
provider_capture

declined
  --RESET_DEMO-->
provider_capture
```

Do not simulate asynchronous operations.

---

## Locked copy

### Current agreement

```text
CURRENT AGREEMENT

PROJECT
Corporate launch event

COST
$10,000

DATE
14 March

SCOPE
Core photography
Stage and lighting
Four-hour guest programme
```

### Request

```text
REQUEST
Add photo booth
```

### Expected impact

```text
EXPECTED IMPACT

COST
+$2,000

VENUE ACCESS
+90 minutes

DOCUMENTS AFFECTED
Floor-plan revision required
```

### Uncertainty

```text
UNCERTAINTY

VENUE ACCESS STATUS
Not yet confirmed
```

Never use:

```text
VENUE APPROVAL
```

### Provider understanding

```text
PROVIDER UNDERSTANDING

Additional service with a $2,000 cost and additional venue-access time.
```

### Client understanding — difference

```text
CLIENT UNDERSTANDING

Included in the current event-production package.
```

### Client response — decline

```text
CLIENT RESPONSE

I do not want to add this.
```

### Controls

```text
RECORD PROPOSAL

THIS MATCHES MY UNDERSTANDING

I UNDERSTOOD SOMETHING DIFFERENT

I DO NOT WANT TO ADD THIS

RESET DEMO
```

---

# STATE 1 — PROVIDER CAPTURE

## Purpose

The provider records the request and states its expected impact.

## Layout

- Current Agreement remains in columns 1–7.
- Provider Capture occupies the Proposed Change band in columns 8–12.
- Boundary remains vertical on desktop/tablet and horizontal on mobile.
- The proposal remains outside the agreement.
- No modal.
- No floating card.
- No dashboard chrome.

## Required fields

```text
REQUEST
Add photo booth

EXPECTED IMPACT

COST
+$2,000

VENUE ACCESS
+90 minutes

DOCUMENTS AFFECTED
Floor-plan revision required

UNCERTAINTY

VENUE ACCESS STATUS
Not yet confirmed

RECORDED BY
Event producer

RECORDED AT
14 Mar · 10:24
```

## Behaviour

- Fields may be prefilled for the demo.
- Keep semantic labels and inputs.
- `RECORD PROPOSAL` updates local reducer state only.
- No spinner.
- No toast.
- No success banner.
- No server simulation.
- Current Agreement remains visible throughout.

---

# STATE 2 — CLIENT REVIEW UNEXPRESSED

## Purpose

The client sees the provider-stated impact but has not yet expressed an understanding.

## Required structure

Show:

```text
PROVIDER UNDERSTANDING

Additional service with a $2,000 cost and additional venue-access time.
```

Show:

```text
CLIENT UNDERSTANDING

NOT YET EXPRESSED
```

The client area must retain full geometry.

Use:

- one 1px dashed internal edge;
- equal region width;
- neutral copy;
- no `pending`;
- no `missing`;
- no warning;
- no overdue language.

## Response controls

Render three equal-authority buttons:

```text
THIS MATCHES MY UNDERSTANDING

I UNDERSTOOD SOMETHING DIFFERENT

I DO NOT WANT TO ADD THIS
```

Requirements:

- no primary button;
- no recommended option;
- same height;
- same border;
- same typography;
- same contrast;
- logical keyboard order.

State line:

```text
CLIENT UNDERSTANDING NOT YET EXPRESSED ·
PROPOSAL REMAINS OUTSIDE THE CURRENT AGREEMENT
```

---

# STATE 3 — DIFFERENT UNDERSTANDINGS

## Required copy

```text
PROVIDER UNDERSTANDING

Additional service with a $2,000 cost and additional venue-access time.
```

```text
CLIENT UNDERSTANDING

Included in the current event-production package.
```

## Required visual behaviour

- Provider first in DOM and visual order.
- Equal width.
- Equal typography.
- Equal contrast.
- Equal background.
- One difference tick inside the Provider Understanding region.
- One difference tick inside the Client Understanding region.
- No ticks in impact rows.
- Proposal remains outside the agreement.
- Boundary remains present.
- Proposal tint remains present.
- No red.
- No warning.
- No error.
- No conflict badge.

State line:

```text
UNDERSTANDINGS DIFFER ·
PROPOSAL REMAINS OUTSIDE THE CURRENT AGREEMENT
```

---

# STATE 4 — SHARED UNDERSTANDING

## Required real DOM structure

```text
agreement-shell
├── existing-agreement
└── shared-proposal-block
```

The `shared-proposal-block` must be a real direct child of `agreement-shell`.

Do not simulate nesting with:

- absolute positioning;
- overlay;
- portal;
- transform;
- duplicate hidden content.

## Desktop

`agreement-shell` is the actual 12-column grid parent.

- Existing Agreement: columns 1–9.
- Integrated Proposal: columns 10–12.
- No main agreement boundary separating them.
- No proposal tint.
- Both expressed understandings remain visible.
- Provenance appears only in this state.

## Provenance

```text
PROPOSED 14 MAR ·
SAME UNDERSTANDING EXPRESSED 14 MAR ·
NOW SHOWN IN THE CURRENT AGREEMENT
```

Use a restrained double-rule history treatment.

Do not use:

- approved;
- verified;
- executed;
- validated;
- signed;
- confirmed by the system;
- success;
- checkmark;
- green state;
- celebration.

## Screen-reader announcement

```text
The photo booth proposal is now shown inside the current agreement because both expressed understandings match.
```

## State line

```text
SAME UNDERSTANDING EXPRESSED ·
PROPOSAL NOW SHOWN IN THE CURRENT AGREEMENT
```

Do not truncate the provenance in the publication-ready layout.

It may wrap naturally.
It must not become a vertical word column.
It must not use ellipsis in the final product UI.

---

# STATE 5 — DECLINED

A decline is not a disagreement in understanding.

## Required content

```text
PROVIDER UNDERSTANDING

Additional service with a $2,000 cost and additional venue-access time.
```

```text
CLIENT RESPONSE

I do not want to add this.
```

## Required visual behaviour

- Proposal remains outside the agreement.
- Boundary remains.
- Proposal tint remains.
- No difference ticks.
- No provenance marker.
- No error styling.
- Do not claim that understandings differ.
- Do not integrate the proposal.

State line:

```text
CLIENT DOES NOT WANT TO ADD THIS ·
PROPOSAL REMAINS OUTSIDE THE CURRENT AGREEMENT
```

---

## Demo control

The product flow must work through the actual controls.

Provide one developer-only reset control outside the composition.

Label exactly:

```text
DEMO CONTROL — NOT PRODUCT UI
```

Normal flow:

```text
Provider Capture
→ Record Proposal
→ Client Review

Match
→ Shared Understanding

Different
→ Different Understandings

Decline
→ Declined
```

The publication version must not display a direct state switcher.

The development version may include:

```text
RESET DEMO
```

No direct production-facing state dropdown.

---

## Responsive lock

### Desktop ≥1280px

- 12-column structure;
- approximately 58/42 external state composition;
- vertical 2px boundary;
- Provider and Client side by side;
- Shared agreement shell spans full width.

### Tablet 1024–1279px

- vertical agreement boundary;
- Current and Proposed remain side by side;
- Provider and Client side by side.

### Tablet 768–1023px

- vertical agreement boundary;
- Current and Proposed remain side by side;
- Provider and Client stack vertically inside the proposal region;
- both remain visible.

### Mobile 320–767px

- Current Agreement first;
- horizontal 2px boundary;
- Proposed Change second;
- Provider first;
- Client second;
- no hidden information;
- no tabs;
- no accordion;
- no modal;
- no carousel;
- no horizontal scrolling.

### Shared mobile

Inside `agreement-shell`:

```text
CURRENT AGREEMENT
→ INTEGRATED PROPOSAL
→ EXPRESSIONS
→ PROVENANCE
```

Maintain coherent reading order.

---

## Visual tokens

Preserve the validated spike tokens unless an implementation defect requires a documented correction.

```css
--bg: #ffffff;
--field-outside: #f5f5f5;
--ink: #1a1a1a;
--ink-quiet: #6b6b6b;
--line-strong: #1a1a1a;
--line-quiet: rgba(26, 26, 26, 0.32);
--signal: #8a5a00;
```

Line system:

```text
1px solid   quiet rows
2px solid   agreement boundary
2px solid   understanding divider
1px dashed  not-yet-expressed state
2px ticks   both differing understanding regions
2px double  provenance in shared state only
2px focus ring with 2px offset
```

Typography:

- neutral sans for labels and prose;
- monospace only for quantities, durations and timestamps;
- body minimum 16px;
- labels minimum 12px;
- no monospace prose;
- no text below 12px.

Do not add:

- shadows;
- radii;
- gradients;
- elevated cards;
- glass;
- pills;
- decorative icons;
- progress meters;
- dashboard navigation.

---

## Motion

Maximum:

```text
200ms
cubic-bezier(0.4, 0, 0.2, 1)
```

Allowed:

- opacity;
- supported grid reallocation.

Forbidden:

- translate;
- transform movement;
- scale;
- rotation;
- height animation;
- spring;
- bounce;
- entrance animation;
- celebration.

Under `prefers-reduced-motion: reduce`:

- all durations become 0ms;
- final geometry renders directly.

---

## Accessibility

Implement:

- semantic headings and regions;
- semantic inputs and buttons;
- 44px minimum controls;
- visible focus;
- Provider before Client in DOM order;
- `aria-live="polite"` on the state-line element only;
- no `role="alert"` for disagreement;
- no `aria-invalid` for disagreement;
- no forced focus movement except to prevent focus loss after a removed control;
- explicit textual states;
- grayscale-safe structure;
- no colour-only meaning;
- 200% zoom support;
- no horizontal overflow.

When a clicked response button disappears after transition:

- move focus only when needed;
- focus the nearest preceding state heading;
- use `tabIndex="-1"` on that heading;
- do not scroll unexpectedly.

Axe:

- install `@axe-core/playwright` if possible;
- if not installed, use an explicit skipped test;
- never count NOT EXECUTED as PASS.

---

## Component architecture

Use a clean component structure such as:

```text
src/
├── app/
│   ├── day14Reducer.ts
│   ├── day14Types.ts
│   └── day14Data.ts
├── components/
│   ├── AgreementCanvas.tsx
│   ├── CurrentAgreement.tsx
│   ├── AgreementBoundary.tsx
│   ├── ProposalRegion.tsx
│   ├── ProviderCapture.tsx
│   ├── ImpactGroup.tsx
│   ├── UncertaintyGroup.tsx
│   ├── UnderstandingPair.tsx
│   ├── UnderstandingRegion.tsx
│   ├── ClientResponseGroup.tsx
│   ├── ProvenanceBlock.tsx
│   ├── StateLine.tsx
│   └── DemoReset.tsx
├── styles/
│   ├── tokens.css
│   ├── layout.css
│   ├── components.css
│   ├── responsive.css
│   └── reduced-motion.css
└── App.tsx
```

Do not create abstraction for abstraction’s sake.

Preserve clear test IDs for structural verification.

---

## Required test IDs

Use at minimum:

```text
state-provider_capture
state-client_review_unexpressed
state-different_understandings
state-shared_understanding
state-declined

agreement-shell
existing-agreement
agreement-section
agreement-boundary
proposal-band
shared-proposal-block

provider-understanding
client-understanding
client-response
understanding-pair

provenance-block
state-line
record-proposal
match-understanding
different-understanding
decline-change
reset-demo
```

---

## Playwright tests

Create real tests for:

### Flow

1. Provider Capture renders.
2. Record Proposal moves to Client Review.
3. Match flow reaches Shared.
4. Difference flow reaches Different.
5. Decline flow reaches Declined.
6. Reset returns to Provider Capture.
7. No direct product-facing state switcher exists.

### Semantics

8. Provider precedes Client in DOM order.
9. Client Review shows explicit `NOT YET EXPRESSED`.
10. Unknown state has dashed internal edge.
11. Decline does not claim understandings differ.
12. Different state contains exactly two difference ticks.
13. Declined contains zero difference ticks.
14. Shared contains zero difference ticks.
15. Provenance absent before Shared.
16. Provenance present only in Shared.
17. Shared proposal is a direct child of agreement-shell.
18. Proposal tint absent in Shared.
19. Boundary absent in Shared.
20. Boundary present in Provider Capture, Client Review, Different and Declined.
21. Uncertainty is separate from Expected Impact.
22. Forbidden vocabulary scan across all states.

### Responsive

Test at:

```text
1440 × 900
1024 × 900
768 × 1024
390 × 844
320 × 568
640 × 900
```

Verify:

23. Boundary vertical at 1440, 1024 and 768.
24. Boundary horizontal at 390 and 320.
25. Current and Proposed side by side at 1440, 1024 and 768.
26. Provider/Client same Y at 1024.
27. Provider/Client stacked at 768.
28. Current above Proposed at 390 and 320.
29. Provider before Client on mobile.
30. Shared mobile order is Current → Proposal → Expressions → Provenance.
31. No horizontal overflow at every viewport.
32. 200% zoom equivalent works at 640px.
33. All principal bounding boxes remain within viewport.

### Geometry

34. Boundary spans taller content at 1:3.
35. Boundary spans taller content at 3:1.
36. Proposal tint spans taller content at 1:3.
37. Proposal tint spans taller content at 3:1.
38. Shared shell spans full composition width.
39. Shared proposal occupies a readable non-collapsed region.
40. Provenance does not form a vertical word column.
41. Provenance is not truncated with ellipsis.

### Interaction and accessibility

42. All controls keyboard operable.
43. Enter and Space activate buttons.
44. Focus ring is 2px solid with 2px offset.
45. All interactive controls are at least 44px high.
46. `aria-live="polite"` exists on state line.
47. No alert or invalid semantics.
48. Focus does not disappear after response transition.
49. Reduced-motion durations are 0ms.
50. Grayscale states remain distinguishable.
51. Axe scan passes if package installed; otherwise explicit skip.

No conditional assertions that silently pass.

A missing locator or bounding box must fail the test.

---

## Screenshots

Generate:

```text
01-provider-capture-desktop.png
02-client-review-desktop.png
03-different-desktop.png
04-shared-desktop.png
05-declined-desktop.png

06-provider-capture-mobile.png
07-client-review-mobile.png
08-different-mobile.png
09-shared-mobile.png
10-declined-mobile.png

11-different-1x3.png
12-different-3x1.png
13-shared-grayscale.png
```

Desktop:

```text
1440 × 900
```

Mobile:

```text
390 × 844
```

All screenshots must be regenerated after the final code change.

---

## Evidence Ledger

Create:

```text
DAY14_FULL_BUILD_EVIDENCE.md
```

Columns:

```text
ID
Date
Phase
Requirement
Command or test
Expected result
Observed result
Status PASS / FAIL / SKIPPED
Artefact
Impact
```

Include:

- starting commit;
- branch;
- install output;
- build output;
- test output;
- screenshot paths;
- accessibility result;
- all discovered defects;
- all corrections;
- final commit;
- deviations from Visual Contract;
- final gate verdict.

Do not hide failed runs.

Keep historical failed logs in:

```text
evidence/history/
```

Keep final logs in:

```text
evidence/final-build-output.log
evidence/final-test-output.log
```

Never count SKIPPED as PASS.

---

## Deliverables

Return:

```text
day14-full-build/
├── src/
├── tests/
├── artifacts/
├── evidence/
├── dist/
├── package.json
├── package-lock.json
├── playwright.config.ts
├── README.md
├── DAY14_FULL_BUILD_EVIDENCE.md
├── DAY14_FULL_BUILD_REPORT.md
└── DEVIATIONS.md
```

Also create:

```text
day14-full-build.zip
```

Commit:

```bash
git add .
git commit -m "feat(day14): implement five-state agreement flow"
```

---

## Final gate

End with exactly one:

```text
DAY 14 FULL BUILD PASS — READY FOR VISUAL QA
```

or:

```text
DAY 14 FULL BUILD FAIL — CORRECTIONS REQUIRED
```

A PASS is forbidden unless:

- all five states exist;
- all three branches work;
- validated spike geometry has not regressed;
- production build succeeds;
- Playwright tests execute;
- zero tests fail;
- skipped tests are reported honestly;
- thirteen screenshots exist;
- evidence ledger contains exact outputs;
- final commit exists.
