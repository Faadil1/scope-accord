import { test, expect, Page } from "@playwright/test";

async function stateLineFocusState(page: Page) {
  return page.evaluate(() => {
    const el = document.querySelector(
      '[data-testid="state-line"]'
    ) as HTMLElement | null;
    if (!el) return { exists: false, isActive: false, focusVisible: false };
    return {
      exists: true,
      isActive: document.activeElement === el,
      focusVisible: el.matches(":focus-visible"),
      activeTag: document.activeElement?.tagName ?? null,
    };
  });
}

async function toClientReview(page: Page) {
  await page.goto("/");
  await page.getByTestId("record-proposal").click();
  await page.waitForTimeout(300);
}

test.describe("Scope Accord V2 — state-line focus contract", () => {
  // A. Initial application load must not steal focus.

  test("F1. Initial load does not focus the state line", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator('[data-testid="state-provider_capture"]')
    ).toBeVisible();
    await page.waitForTimeout(400);

    const s = await stateLineFocusState(page);
    expect(s.exists).toBe(true);
    expect(s.isActive).toBe(false);
    expect(s.focusVisible).toBe(false);
    // Focus stays on the document, not on any product control.
    expect(s.activeTag).toBe("BODY");
  });

  test("F2. Initial load autofocuses no control", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(400);
    const active = await page.evaluate(() =>
      document.activeElement?.getAttribute("data-testid")
    );
    expect(active).toBeNull();
    expect(await page.locator("[autofocus]").count()).toBe(0);
  });

  test("F3. The state line keeps its accessibility contract on load", async ({
    page,
  }) => {
    await page.goto("/");
    const line = page.locator('[data-testid="state-line"]');
    await expect(line).toHaveCount(1);
    await expect(line).toHaveAttribute("aria-live", "polite");
    await expect(line).toHaveAttribute("role", "status");
    await expect(line).toHaveAttribute("tabindex", "-1");
  });

  // B. Record Proposal still restores focus.

  test("F4. Keyboard Record Proposal moves focus to the state line", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByTestId("record-proposal").focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(300);

    await expect(
      page.locator('[data-testid="state-client_review_unexpressed"]')
    ).toBeVisible();
    const s = await stateLineFocusState(page);
    expect(s.isActive).toBe(true);
  });

  // C. Every client branch still restores focus.

  for (const [testId, nextState] of [
    ["match-understanding", "state-shared_understanding"],
    ["different-understanding", "state-different_understandings"],
    ["decline-change", "state-declined"],
  ] as [string, string][]) {
    test(`F5-${testId}. Branch restores focus to the state line`, async ({
      page,
    }) => {
      await toClientReview(page);
      await page.getByTestId(testId).click();
      await page.waitForTimeout(300);

      await expect(page.locator(`[data-testid="${nextState}"]`)).toBeVisible();
      const s = await stateLineFocusState(page);
      expect(s.isActive).toBe(true);
    });
  }

  test("F6. Focus is still restored after a full reload cycle", async ({
    page,
  }) => {
    // A reload resets the guard; the next real transition must still restore.
    await page.goto("/");
    await page.waitForTimeout(300);
    expect((await stateLineFocusState(page)).isActive).toBe(false);

    await page.getByTestId("record-proposal").click();
    await page.waitForTimeout(300);
    expect((await stateLineFocusState(page)).isActive).toBe(true);

    await page.reload();
    await page.waitForTimeout(300);
    expect((await stateLineFocusState(page)).isActive).toBe(false);

    await page.getByTestId("record-proposal").click();
    await page.waitForTimeout(300);
    expect((await stateLineFocusState(page)).isActive).toBe(true);
  });
});
