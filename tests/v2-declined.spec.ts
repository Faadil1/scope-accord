import { test, expect, Page } from "@playwright/test";

const PROVIDER_STATEMENT =
  "Additional service with a $2,000 cost and additional venue-access time.";
const CLIENT_RESPONSE = "I do not want to add this.";
const CONCLUSION =
  "CLIENT DOES NOT WANT TO ADD THIS · PROPOSAL REMAINS OUTSIDE THE CURRENT AGREEMENT";

async function toDeclined(page: Page, width = 1280, height = 720) {
  await page.setViewportSize({ width, height });
  await page.goto("/");
  await page.getByTestId("record-proposal").click();
  await page.waitForTimeout(300);
  await page.getByTestId("decline-change").click();
  await page.waitForTimeout(320);
  await expect(page.locator('[data-testid="state-declined"]')).toBeVisible();
}

test.describe("Scope Accord V2 — Declined", () => {
  test("D1. Declined renders inside the V2 shell", async ({ page }) => {
    await toDeclined(page);
    await expect(page.locator(".v2-shell")).toHaveCount(1);
    await expect(page.locator(".v2-shell h1")).toHaveText("Scope Accord");
    await expect(page.locator('[data-testid="agreement-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="proposal-band"]')).toBeVisible();
  });

  test("D2. Band heading reads CHANGE RESPONSE", async ({ page }) => {
    await toDeclined(page);
    const heading = page.locator(".v2-response h2");
    await expect(heading).toHaveCount(1);
    expect((await heading.textContent())?.trim()).toBe("Change Response");
    const style = await heading.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { transform: cs.textTransform, size: parseFloat(cs.fontSize) };
    });
    expect(style.transform).toBe("uppercase");
    expect(style.size).toBeGreaterThanOrEqual(12);
  });

  test("D3. Provider statement is complete", async ({ page }) => {
    await toDeclined(page);
    const region = page.locator('[data-testid="provider-understanding"]');
    await expect(region).toBeVisible();
    await expect(region).toContainText("PROVIDER UNDERSTANDING");
    expect(
      (await page.locator(".v2-response-statement").textContent())?.trim()
    ).toBe(PROVIDER_STATEMENT);
  });

  test("D4. Client response is exact and prominent", async ({ page }) => {
    await toDeclined(page);
    const region = page.locator('[data-testid="client-response"]');
    await expect(region).toBeVisible();
    await expect(region).toContainText("CLIENT RESPONSE");
    const statement = region.locator(".v2-response-emphasis");
    expect((await statement.textContent())?.trim()).toBe(CLIENT_RESPONSE);
    // Exactly one sentence — no second explanatory line.
    expect(await region.locator("p").count()).toBe(1);
  });

  test("D5. No mismatch, unexpressed or approval markers", async ({ page }) => {
    await toDeclined(page);
    expect(await page.locator(".v2-annotation-break").count()).toBe(0);
    expect(await page.locator(".difference-tick").count()).toBe(0);
    expect(await page.locator(".v2-unexpressed").count()).toBe(0);
    expect(await page.locator(".understanding-divider.dashed").count()).toBe(0);
    expect(await page.locator('[data-testid="client-understanding"]').count()).toBe(0);

    const body = (await page.textContent("body"))!.toLowerCase();
    for (const word of [
      "rejected",
      "cancelled",
      "denied",
      "failed",
      "closed",
      "invalid",
      "disagreement",
    ]) {
      expect(body).not.toContain(word);
    }
  });

  test("D6. Terminal branch: only Reset demo is actionable", async ({ page }) => {
    await toDeclined(page);
    for (const id of [
      "match-understanding",
      "different-understanding",
      "decline-change",
      "record-proposal",
    ]) {
      expect(await page.getByTestId(id).count()).toBe(0);
    }
    await expect(page.getByTestId("reset-demo")).toHaveCount(1);
    // No dead controls: every button present is the reset control.
    const buttons = page.locator("button");
    expect(await buttons.count()).toBe(1);
    await expect(buttons.first()).toHaveAttribute("data-testid", "reset-demo");
  });

  test("D7. Boundary renders in declined mode at 2px, spanning the canvas", async ({
    page,
  }) => {
    await toDeclined(page, 1440, 900);
    await expect(page.locator(".v2-rail-declined")).toHaveCount(1);
    for (const other of ["locked", "unexpressed", "recording"]) {
      expect(await page.locator(`.v2-rail-${other}`).count()).toBe(0);
    }
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
    expect(
      Math.abs(boundary.height - Math.max(agreement.height, proposal.height))
    ).toBeLessThan(5);
    await expect(page.locator(".v2-rail-label")).toHaveText(
      /outside current agreement/i
    );
  });

  test("D8. One state line carrying the exact conclusion", async ({ page }) => {
    await toDeclined(page);
    const line = page.locator('[data-testid="state-line"]');
    await expect(line).toHaveCount(1);
    await expect(line).toHaveAttribute("aria-live", "polite");
    await expect(line).toHaveAttribute("role", "status");
    await expect(line).toHaveAttribute("tabindex", "-1");
    expect((await line.textContent())?.trim()).toBe(CONCLUSION);
  });

  test("D9. Focus reaches the state line after DECLINE_CHANGE", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForTimeout(300);
    // No focus steal on the landing screen.
    expect(
      await page.evaluate(
        () =>
          document.activeElement ===
          document.querySelector('[data-testid="state-line"]')
      )
    ).toBe(false);

    await page.getByTestId("record-proposal").click();
    await page.waitForTimeout(300);
    await page.getByTestId("decline-change").click();
    await page.waitForTimeout(300);

    const active = await page.evaluate(() =>
      document.activeElement?.getAttribute("data-testid")
    );
    expect(active).toBe("state-line");
  });

  test("D10. Provider and client regions share equal authority", async ({
    page,
  }) => {
    await toDeclined(page, 1440, 900);
    const provider = (await page
      .locator('[data-testid="provider-understanding"]')
      .boundingBox())!;
    const client = (await page
      .locator('[data-testid="client-response"]')
      .boundingBox())!;
    expect(Math.abs(provider.width - client.width)).toBeLessThan(2);
    expect(Math.abs(provider.y - client.y)).toBeLessThan(2);

    // Same label treatment on both sides.
    const sizes = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".v2-response-label")).map((el) => {
        const cs = getComputedStyle(el);
        return `${cs.fontSize}/${cs.letterSpacing}/${cs.color}`;
      })
    );
    expect(sizes.length).toBe(2);
    expect(sizes[0]).toBe(sizes[1]);
  });

  test("D11. Desktop fits 1440x900 without vertical scrolling", async ({
    page,
  }) => {
    await toDeclined(page, 1440, 900);
    await page.waitForTimeout(250);
    const m = await page.evaluate(() => ({
      scrollH: document.documentElement.scrollHeight,
      innerH: window.innerHeight,
      overflowX: document.documentElement.scrollWidth > window.innerWidth,
    }));
    expect(m.overflowX).toBe(false);
    expect(m.scrollH).toBeLessThanOrEqual(m.innerH);
    for (const sel of [".v2-response", '[data-testid="state-line"]']) {
      const box = (await page.locator(sel).boundingBox())!;
      expect(box.y + box.height).toBeLessThanOrEqual(900);
    }
  });

  test("D12. No horizontal overflow at 390 and 320", async ({ page }) => {
    for (const [w, h] of [
      [390, 844],
      [320, 568],
    ] as [number, number][]) {
      await toDeclined(page, w, h);
      await page.waitForTimeout(200);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      );
      expect(overflow).toBe(false);
      // Provider stacks above client on narrow viewports.
      const provider = (await page
        .locator('[data-testid="provider-understanding"]')
        .boundingBox())!;
      const client = (await page
        .locator('[data-testid="client-response"]')
        .boundingBox())!;
      expect(client.y).toBeGreaterThan(provider.y + provider.height - 5);
    }
  });
});
