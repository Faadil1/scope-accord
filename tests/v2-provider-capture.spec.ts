import { test, expect, Page } from "@playwright/test";

const PROVIDER_STATEMENT =
  "Additional service with a $2,000 cost and additional venue-access time.";

async function open(page: Page, width = 1280, height = 720) {
  await page.setViewportSize({ width, height });
  await page.goto("/");
  await expect(
    page.locator('[data-testid="state-provider_capture"]')
  ).toBeVisible();
}

test.describe("Scope Accord V2 — Provider Capture", () => {
  test("P1. Provider Capture renders inside the V2 shell", async ({ page }) => {
    await open(page);
    await expect(page.locator(".v2-shell")).toHaveCount(1);
    await expect(page.locator(".v2-shell h1")).toHaveText("Scope Accord");
    await expect(page.locator('[data-testid="agreement-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="proposal-band"]')).toBeVisible();
  });

  test("P2. Capture band heading reads PROVIDER CAPTURE", async ({ page }) => {
    await open(page);
    const heading = page.locator(".v2-capture h2");
    await expect(heading).toHaveCount(1);
    expect((await heading.textContent())?.trim()).toBe("Provider Capture");
    const style = await heading.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { transform: cs.textTransform, size: parseFloat(cs.fontSize) };
    });
    expect(style.transform).toBe("uppercase");
    expect(style.size).toBeGreaterThanOrEqual(12);
  });

  test("P3. Provenance records the event producer", async ({ page }) => {
    await open(page);
    const items = page.locator(".v2-provenance-item");
    expect(await items.count()).toBeGreaterThanOrEqual(1);
    const first = items.first();
    expect((await first.locator("dt").textContent())?.trim()).toBe("RECORDED BY");
    expect((await first.locator("dd").textContent())?.trim()).toBe(
      "Event producer"
    );
    // Provenance must not be a form label bound to a nonexistent input.
    expect(await page.locator(".v2-capture label").count()).toBe(0);
    expect(await page.locator(".v2-capture input, .v2-capture textarea").count()).toBe(0);
  });

  test("P4. Provider understanding statement is complete", async ({ page }) => {
    await open(page);
    const region = page.locator('[data-testid="provider-understanding"]');
    await expect(region).toBeVisible();
    await expect(region).toContainText("PROVIDER UNDERSTANDING");
    expect((await page.locator(".v2-record-statement").textContent())?.trim()).toBe(
      PROVIDER_STATEMENT
    );
  });

  test("P5. Exactly one Record Proposal control, correctly identified", async ({
    page,
  }) => {
    await open(page);
    const button = page.getByTestId("record-proposal");
    await expect(button).toHaveCount(1);
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    expect(await page.locator(".v2-action").count()).toBe(1);
    const box = (await button.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(48);
    expect((await button.textContent())?.trim().length).toBeGreaterThan(0);
  });

  test("P6. Activation reaches Client Review V2", async ({ page }) => {
    await open(page);
    await page.getByTestId("record-proposal").click();
    await page.waitForTimeout(300);
    await expect(
      page.locator('[data-testid="state-client_review_unexpressed"]')
    ).toBeVisible();
    await expect(page.locator(".v2-comparison h2")).toHaveText(
      "Understanding Status"
    );
  });

  test("P7. Focus moves to the state line after recording", async ({ page }) => {
    await open(page);
    await page.getByTestId("record-proposal").focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(300);
    const active = await page.evaluate(() =>
      document.activeElement?.getAttribute("data-testid")
    );
    expect(active).toBe("state-line");
  });

  test("P8. No client region, no mismatch marker, no unexpressed block", async ({
    page,
  }) => {
    await open(page);
    expect(await page.locator('[data-testid="client-understanding"]').count()).toBe(0);
    expect(await page.locator('[data-testid="understanding-pair"]').count()).toBe(0);
    expect(await page.locator(".v2-annotation-break").count()).toBe(0);
    expect(await page.locator(".difference-tick").count()).toBe(0);
    expect(await page.locator(".v2-unexpressed").count()).toBe(0);
    expect(await page.locator(".understanding-divider.dashed").count()).toBe(0);
  });

  test("P9. Boundary renders in recording mode with locked geometry", async ({
    page,
  }) => {
    await open(page, 1440, 900);
    await expect(page.locator(".v2-rail-recording")).toHaveCount(1);
    expect(await page.locator(".v2-rail-locked").count()).toBe(0);
    expect(await page.locator(".v2-rail-unexpressed").count()).toBe(0);

    const boundary = (await page
      .locator('[data-testid="agreement-boundary"]')
      .boundingBox())!;
    const agreement = (await page
      .locator('[data-testid="agreement-section"]')
      .boundingBox())!;
    const proposal = (await page
      .locator('[data-testid="proposal-band"]')
      .boundingBox())!;
    expect(boundary.width).toBeLessThan(10);
    const taller = Math.max(agreement.height, proposal.height);
    expect(Math.abs(boundary.height - taller)).toBeLessThan(5);
    await expect(page.locator(".v2-rail-label")).toHaveText(
      /outside current agreement/i
    );
  });

  test("P10. One state line carrying the full accessible string", async ({
    page,
  }) => {
    await open(page);
    const line = page.locator('[data-testid="state-line"]');
    await expect(line).toHaveCount(1);
    await expect(line).toHaveAttribute("aria-live", "polite");
    await expect(line).toHaveAttribute("role", "status");
    expect((await line.textContent())?.trim()).toBe(
      "PROVIDER RECORDING PROPOSAL · PROPOSAL REMAINS OUTSIDE THE CURRENT AGREEMENT"
    );
  });

  test("P11. Desktop fits 1440x900 without vertical scrolling", async ({
    page,
  }) => {
    await open(page, 1440, 900);
    await page.waitForTimeout(250);
    const m = await page.evaluate(() => ({
      scrollH: document.documentElement.scrollHeight,
      innerH: window.innerHeight,
      overflowX: document.documentElement.scrollWidth > window.innerWidth,
    }));
    expect(m.overflowX).toBe(false);
    expect(m.scrollH).toBeLessThanOrEqual(m.innerH);
    // Everything required must be on screen.
    for (const sel of [
      ".v2-capture",
      '[data-testid="record-proposal"]',
      '[data-testid="state-line"]',
    ]) {
      const box = (await page.locator(sel).boundingBox())!;
      expect(box.y + box.height).toBeLessThanOrEqual(900);
    }
  });

  test("P12. No horizontal overflow at 390 and 320", async ({ page }) => {
    for (const [w, h] of [
      [390, 844],
      [320, 568],
    ] as [number, number][]) {
      await open(page, w, h);
      await page.waitForTimeout(200);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      );
      expect(overflow).toBe(false);
      const box = (await page.getByTestId("record-proposal").boundingBox())!;
      expect(box.height).toBeGreaterThanOrEqual(48);
      expect(box.x + box.width).toBeLessThanOrEqual(w);
    }
  });
});
