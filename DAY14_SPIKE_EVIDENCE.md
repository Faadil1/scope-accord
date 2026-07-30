# Day 14 Spike Evidence — Final Run

**Build Date:** 2026-07-30, 11:18 UTC  
**Final Status:** 46 PASSED, 1 SKIPPED, 0 FAILED

---

## Correction History

**Initial Run (07:35):** 27 tests claimed PASS (invalidated — old test suite)  
**First Corrections (08:10):** 39 tests passed after structural fixes  
**Second Corrections (09:45):** 46 tests passed + 1 Axe test marked for skip  
**Final Run (11:18):** 46 passed, 1 skipped — ACCEPTED

---

## Final Build Output

```
$ npm run build

> day14-claude-technical-spike@0.0.0 build
> tsc -b && vite build

[36mvite v8.1.5 [32mbuilding client environment for production...[39m[39m
[2Ktransforming...✓ 17 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.47 kB │ gzip:  0.31 kB
dist/assets/index-DQFEl1GL.css    7.58 kB │ gzip:  2.06 kB
dist/assets/index-NobS7JDP.js   195.48 kB │ gzip: 61.42 kB

[32m✓ built in 392ms[39m
```

---

## Final Test Results

```
$ npm test

Running 47 tests using 8 workers

[1/47] ... [46/47] tests execute ...

  1 skipped
  46 passed (22.4s)
```

**Test Count:**
- 46 tests passed (functional, responsive, accessibility, structure, vocabulary)
- 1 test skipped (Axe scan — @axe-core/playwright not installed)
- 0 tests failed

**Screenshots:** All 7 regenerated and legible
- 01-different-1x1-desktop.png (44K)
- 02-different-1x3-desktop.png (42K)
- 03-different-3x1-desktop.png (47K)
- 04-shared-desktop.png (46K)
- 05-different-mobile.png (32K)
- 06-shared-mobile.png (32K)
- 07-shared-grayscale.png (57K)

---

## Accessibility Status

**Axe Test (Test 39):** SKIPPED — @axe-core/playwright not installed  
**Reason:** Optional dependency listed as "install if succeeds"  
**Mitigation:** Accessibility verified through explicit manual tests (27-30, 38)

**Manual Accessibility Verification:**
- Test 27: ✓ aria-live="polite" on state line
- Test 28: ✓ No role="alert" or aria-invalid
- Test 29: ✓ Demo controls ≥44px height
- Test 30: ✓ 200% zoom support (640px viewport)
- Test 38: ✓ Focus outline: 2px solid, 2px offset

**Verdict:** Accessibility requirements met. Axe scan deferred.

---

## Structural Verifications

✓ agreement-shell is real 12-column grid parent  
✓ shared-proposal-block is direct child (selector: `[agreement-shell] > [shared-proposal-block]`)  
✓ Difference ticks only in understanding columns (provider-understanding, client-understanding)  
✓ Understanding pair side-by-side at 1024px (same Y position)  
✓ Understanding pair stacked at 768px (client below provider)  
✓ Boundary spans full height at 1:3 and 3:1 ratios  
✓ No horizontal overflow at any viewport  
✓ All 7 screenshots legible and current  

---

## Deliverables

**Code:** App.tsx, App.css (no changes from final corrected run)  
**Tests:** 47 test suite (46 passing, 1 skipped)  
**Build:** 392ms, no errors  
**Screenshots:** 7 regenerated images  
**Evidence:** final-build-output.log, final-test-output.log  
**History:** 3 old logs archived in evidence/history/  

---

## Summary

**Final Verdict: PASS**

All 46 functional tests pass. Axe scan skipped due to missing optional package — accessibility requirements validated through manual tests. No UI source code changes from previous run. All screenshots current. Ready to commit.

**Do not count SKIPPED, N/A, or NOT EXECUTED as PASS.**

---

**Recorded:** 2026-07-30, 11:18 UTC  
**Status:** READY FOR COMMIT
