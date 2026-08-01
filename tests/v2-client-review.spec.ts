import { test, expect, Page } from "@playwright/test";

async function toClientReview(page: Page) {
  await page.goto("/");
  await page.getByTestId("record-proposal").click();
  await page.waitForTimeout(300);
}

async function toDifferent(page: Page) {
  await toClientReview(page);
  await page.getByTestId("different-understanding").click();
  await page.waitForTimeout(300);
}

test.describe("Scope Accord V2 — Client Review / Not Yet Expressed", () => {
  test("C1. Client review renders inside the V2 shell", async ({ page }) => {
    await toClientReview(page);
    await expect(
      page.locator('[data-testid="state-client_review_unexpressed"]')
    ).toBeVisible();
    await expect(page.locator(".v2-shell")).toHaveCount(1);
    await expect(page.locator(".v2-shell h1")).toHaveText("Scope Accord");
  });

  test("C2. All three response controls are present with real handlers", async ({
    page,
  }) => {
    await toClientReview(page);
    for (const id of [
      "match-understanding",
      "different-understanding",
      "decline-change",
    ]) {
      const button = page.getByTestId(id);
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
      const name = await button.textContent();
      expect(name?.trim().length).toBeGreaterThan(0);
    }
  });

  test("C3. Every response control is at least 44px high", async ({ page }) => {
    await toClientReview(page);
    for (const id of [
      "match-understanding",
      "different-understanding",
      "decline-change",
    ]) {
      const box = await page.getByTestId(id).boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("C4. Response controls stack full width at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await toClientReview(page);

    const boxes = [];
    for (const id of [
      "match-understanding",
      "different-understanding",
      "decline-change",
    ]) {
      boxes.push(await page.getByTestId(id).boundingBox());
    }
    // Stacked: each control begins below the previous one.
    expect(boxes[1]!.y).toBeGreaterThan(boxes[0]!.y + boxes[0]!.height - 5);
    expect(boxes[2]!.y).toBeGreaterThan(boxes[1]!.y + boxes[1]!.height - 5);
    for (const b of boxes) {
      expect(b!.height).toBeGreaterThanOrEqual(44);
      expect(b!.x + b!.width).toBeLessThanOrEqual(390);
    }
  });

  test("C5. Unexpressed boundary rail is present and labelled", async ({
    page,
  }) => {
    await toClientReview(page);
    await expect(page.locator(".v2-rail-unexpressed")).toBeVisible();
    await expect(page.locator('[data-testid="agreement-boundary"]')).toBeVisible();
    await expect(page.locator(".v2-rail-label")).toHaveText(
      /outside current agreement/i
    );
  });

  test("C6. No mismatch marker in client review, present in different", async ({
    page,
  }) => {
    await toClientReview(page);
    expect(await page.locator(".v2-annotation-break").count()).toBe(0);
    expect(await page.locator(".difference-tick").count()).toBe(0);

    await toDifferent(page);
    expect(await page.locator(".v2-annotation-break").count()).toBe(1);
    expect(await page.locator(".difference-tick").count()).toBe(2);
  });

  test("C7. Dashed structural treatment is visible", async ({ page }) => {
    await toClientReview(page);

    const divider = page.locator(".understanding-divider.dashed");
    await expect(divider).toBeVisible();
    const borderStyle = await divider.evaluate(
      (el) => getComputedStyle(el).borderLeftStyle
    );
    expect(borderStyle).toBe("dashed");

    const block = page.locator(".v2-unexpressed");
    await expect(block).toBeVisible();
    const blockStyle = await block.evaluate(
      (el) => getComputedStyle(el).borderTopStyle
    );
    expect(blockStyle).toBe("dashed");
  });

  test("C8. Client region reads exactly NOT YET EXPRESSED", async ({ page }) => {
    await toClientReview(page);
    const client = page.locator('[data-testid="client-understanding"]');
    await expect(client).toContainText("CLIENT UNDERSTANDING");
    await expect(page.locator(".v2-unexpressed-value")).toHaveText(
      "NOT YET EXPRESSED"
    );
  });

  test("C9. Provider and client regions keep equal width", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await toClientReview(page);
    const provider = await page
      .locator('[data-testid="provider-understanding"]')
      .boundingBox();
    const client = await page
      .locator('[data-testid="client-understanding"]')
      .boundingBox();
    expect(Math.abs(provider!.width - client!.width)).toBeLessThan(2);
    expect(Math.abs(provider!.y - client!.y)).toBeLessThan(2);
  });

  test("C10. Exactly one state line with the full accessible string", async ({
    page,
  }) => {
    await toClientReview(page);
    const line = page.locator('[data-testid="state-line"]');
    await expect(line).toHaveCount(1);
    await expect(line).toHaveAttribute("aria-live", "polite");
    await expect(line).toHaveAttribute("role", "status");
    expect((await line.textContent())?.trim()).toBe(
      "CLIENT UNDERSTANDING NOT YET EXPRESSED · PROPOSAL REMAINS OUTSIDE THE CURRENT AGREEMENT"
    );
  });

  test("C11. All three reducer branches still resolve from V2 controls", async ({
    page,
  }) => {
    await toClientReview(page);
    await page.getByTestId("match-understanding").click();
    await page.waitForTimeout(300);
    await expect(
      page.locator('[data-testid="state-shared_understanding"]')
    ).toBeVisible();

    await page.getByTestId("reset-demo").click();
    await page.waitForTimeout(300);
    await toClientReview(page);
    await page.getByTestId("different-understanding").click();
    await page.waitForTimeout(300);
    await expect(
      page.locator('[data-testid="state-different_understandings"]')
    ).toBeVisible();

    await page.getByTestId("reset-demo").click();
    await page.waitForTimeout(300);
    await toClientReview(page);
    await page.getByTestId("decline-change").click();
    await page.waitForTimeout(300);
    await expect(page.locator('[data-testid="state-declined"]')).toBeVisible();
  });

  test("C13. Each variant renders its own section heading", async ({ page }) => {
    await toClientReview(page);
    const crHeading = page.locator(".v2-comparison h2");
    await expect(crHeading).toHaveCount(1);
    expect((await crHeading.textContent())?.trim()).toBe("Understanding Status");
    const size = await crHeading.evaluate((el) =>
      parseFloat(getComputedStyle(el).fontSize)
    );
    expect(size).toBeGreaterThanOrEqual(12);

    await toDifferent(page);
    const duHeading = page.locator(".v2-comparison h2");
    await expect(duHeading).toHaveCount(1);
    expect((await duHeading.textContent())?.trim()).toBe(
      "Expressed Understandings"
    );
  });

  test("C14. Desktop renders three equal action columns on one row", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await toClientReview(page);

    const boxes = [];
    for (const id of [
      "match-understanding",
      "different-understanding",
      "decline-change",
    ]) {
      boxes.push((await page.getByTestId(id).boundingBox())!);
    }
    // Equal widths and heights, all on the same row.
    expect(Math.abs(boxes[0].width - boxes[1].width)).toBeLessThan(2);
    expect(Math.abs(boxes[1].width - boxes[2].width)).toBeLessThan(2);
    for (const b of boxes) {
      expect(b.height).toBeGreaterThanOrEqual(44);
      expect(Math.abs(b.y - boxes[0].y)).toBeLessThan(2);
      expect(Math.abs(b.height - boxes[0].height)).toBeLessThan(2);
    }
    // The row consumes the full content width: no dead area on the right.
    const row = (await page.locator(".v2-action-row").boundingBox())!;
    const lastEdge = boxes[2].x + boxes[2].width;
    expect(Math.abs(lastEdge - (row.x + row.width))).toBeLessThan(2);
  });

  test("C15. Tablet spans the primary and pairs the secondaries", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await toClientReview(page);

    const match = (await page.getByTestId("match-understanding").boundingBox())!;
    const different = (await page
      .getByTestId("different-understanding")
      .boundingBox())!;
    const decline = (await page.getByTestId("decline-change").boundingBox())!;
    const row = (await page.locator(".v2-action-row").boundingBox())!;

    // Primary spans the full row on its own line.
    expect(Math.abs(match.width - row.width)).toBeLessThan(2);
    expect(different.y).toBeGreaterThan(match.y + match.height - 5);

    // Secondaries share the second row at equal width.
    expect(Math.abs(different.width - decline.width)).toBeLessThan(2);
    expect(Math.abs(different.y - decline.y)).toBeLessThan(2);
    expect(different.x + different.width).toBeLessThanOrEqual(decline.x + 1);
    for (const b of [match, different, decline]) {
      expect(b.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("C12. Focus returns to the state line after each control unmounts", async ({
    page,
  }) => {
    for (const id of [
      "match-understanding",
      "different-understanding",
      "decline-change",
    ]) {
      await toClientReview(page);
      await page.getByTestId(id).focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(300);
      const active = await page.evaluate(() =>
        document.activeElement?.getAttribute("data-testid")
      );
      expect(active).toBe("state-line");
    }
  });
});
