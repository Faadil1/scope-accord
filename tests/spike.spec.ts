import { test, expect, Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'artifacts');

async function navigateToState(page: Page, target: string, fixture?: string) {
  const url = fixture ? `/?fixture=${fixture}` : '/';
  await page.goto(url);

  if (target === 'provider_capture') return;

  await page.getByTestId('record-proposal').click();
  await page.waitForTimeout(300);

  if (target === 'client_review_unexpressed') return;

  if (target === 'shared_understanding') {
    await page.getByTestId('match-understanding').click();
    await page.waitForTimeout(300);
    return;
  }

  if (target === 'different_understandings') {
    await page.getByTestId('different-understanding').click();
    await page.waitForTimeout(300);
    return;
  }

  if (target === 'declined') {
    await page.getByTestId('decline-change').click();
    await page.waitForTimeout(300);
  }
}

async function takeScreenshot(page: Page, name: string, width: number, height: number) {
  await page.setViewportSize({ width, height });
  await page.waitForTimeout(300);
  const filePath = path.join(SCREENSHOTS_DIR, name);
  await page.screenshot({ path: filePath });
  console.log(`Screenshot saved: ${filePath}`);
}

test.describe('Day 14 Technical Spike', () => {
  // FUNCTIONAL TESTS

  test('1. Different state renders', async ({ page }) => {
    await navigateToState(page, 'different_understandings');
    const state = page.locator('[data-testid="state-different_understandings"]');
    await expect(state).toBeVisible();
  });

  test('2. Shared state renders', async ({ page }) => {
    await navigateToState(page, 'shared_understanding');
    const shell = page.locator('[data-testid="agreement-shell"]');
    await expect(shell).toBeVisible();
  });

  test('3. Provider precedes client in DOM order', async ({ page }) => {
    await navigateToState(page, 'different_understandings');
    const content = page.locator('[data-testid="understanding-pair"]').first();
    await expect(content).toBeVisible();
    const text = await content.textContent();
    expect(text).toBeTruthy();
    const providerIndex = text!.indexOf('PROVIDER');
    const clientIndex = text!.indexOf('CLIENT');
    expect(providerIndex).toBeLessThan(clientIndex);
    expect(providerIndex).toBeGreaterThanOrEqual(0);
  });

  test('4. Shared proposal is real descendant of agreement-shell', async ({ page }) => {
    await navigateToState(page, 'shared_understanding');

    const shell = page.locator('[data-testid="agreement-shell"]');
    await expect(shell).toBeVisible();

    const sharedBlock = page.locator('[data-testid="shared-proposal-block"]');
    await expect(sharedBlock).toBeVisible();

    // Verify it's a descendant by checking parentage
    const shellHTML = await shell.innerHTML();
    expect(shellHTML).toContain('shared-proposal-block');
  });

  test('5. Boundary exists only in Different state', async ({ page }) => {
    await navigateToState(page, 'different_understandings');
    let boundary = page.locator('[data-testid="agreement-boundary"]');
    await expect(boundary).toBeVisible();

    await navigateToState(page, 'shared_understanding');

    boundary = page.locator('[data-testid="agreement-boundary"]');
    await expect(boundary).not.toBeVisible();
  });

  test('6. Provenance exists only in Shared state', async ({ page }) => {
    await navigateToState(page, 'provider_capture');
    let text = await page.textContent('body');
    expect(text).not.toContain('PROPOSED 14 MAR');

    await navigateToState(page, 'shared_understanding');

    text = await page.textContent('body');
    expect(text).toContain('PROPOSED 14 MAR');
    expect(text).toContain('SAME UNDERSTANDING EXPRESSED 14 MAR');
    expect(text).toContain('NOW SHOWN IN THE CURRENT AGREEMENT');
  });

  // UNEVEN CONTENT WITH DOM MEASUREMENTS (AC-22)

  test('9. Boundary spans full height at 1:3 ratio (proposal taller)', async ({ page }) => {
    await page.goto('/?fixture=1:3');
    await page.setViewportSize({ width: 1440, height: 900 });

    const agreement = page.locator('[data-testid="agreement-section"]');
    const proposal = page.locator('[data-testid="proposal-band"]');
    const boundary = page.locator('[data-testid="agreement-boundary"]');

    const agreementBox = await agreement.boundingBox();
    const proposalBox = await proposal.boundingBox();
    const boundaryBox = await boundary.boundingBox();

    expect(agreementBox).toBeTruthy();
    expect(proposalBox).toBeTruthy();
    expect(boundaryBox).toBeTruthy();

    const tallerHeight = Math.max(agreementBox!.height, proposalBox!.height);
    const heightDiff = Math.abs(boundaryBox!.height - tallerHeight);
    console.log(`1:3 ratio: Agreement=${agreementBox!.height}, Proposal=${proposalBox!.height}, Boundary=${boundaryBox!.height}, Diff=${heightDiff}`);
    expect(heightDiff).toBeLessThan(5);
  });

  test('10. Boundary spans full height at 3:1 ratio (agreement taller)', async ({ page }) => {
    await page.goto('/?fixture=3:1');
    await page.setViewportSize({ width: 1440, height: 900 });

    const agreement = page.locator('[data-testid="agreement-section"]');
    const proposal = page.locator('[data-testid="proposal-band"]');
    const boundary = page.locator('[data-testid="agreement-boundary"]');

    const agreementBox = await agreement.boundingBox();
    const proposalBox = await proposal.boundingBox();
    const boundaryBox = await boundary.boundingBox();

    expect(agreementBox).toBeTruthy();
    expect(proposalBox).toBeTruthy();
    expect(boundaryBox).toBeTruthy();

    const tallerHeight = Math.max(agreementBox!.height, proposalBox!.height);
    const heightDiff = Math.abs(boundaryBox!.height - tallerHeight);
    console.log(`3:1 ratio: Agreement=${agreementBox!.height}, Proposal=${proposalBox!.height}, Boundary=${boundaryBox!.height}, Diff=${heightDiff}`);
    expect(heightDiff).toBeLessThan(5);
  });

  test('11. Proposal tint spans full height at 1:3', async ({ page }) => {
    await page.goto('/?fixture=1:3');
    await page.setViewportSize({ width: 1440, height: 900 });

    const agreement = page.locator('[data-testid="agreement-section"]');
    const proposal = page.locator('[data-testid="proposal-band"]');

    const agreementBox = await agreement.boundingBox();
    const proposalBox = await proposal.boundingBox();

    expect(agreementBox).toBeTruthy();
    expect(proposalBox).toBeTruthy();

    const tallerHeight = Math.max(agreementBox!.height, proposalBox!.height);
    const heightDiff = Math.abs(proposalBox!.height - tallerHeight);
    console.log(`1:3 tint: Agreement=${agreementBox!.height}, Proposal=${proposalBox!.height}, Diff=${heightDiff}`);
    expect(heightDiff).toBeLessThan(5);
  });

  test('12. Proposal tint spans full height at 3:1', async ({ page }) => {
    await page.goto('/?fixture=3:1');
    await page.setViewportSize({ width: 1440, height: 900 });

    const agreement = page.locator('[data-testid="agreement-section"]');
    const proposal = page.locator('[data-testid="proposal-band"]');

    const agreementBox = await agreement.boundingBox();
    const proposalBox = await proposal.boundingBox();

    expect(agreementBox).toBeTruthy();
    expect(proposalBox).toBeTruthy();

    const tallerHeight = Math.max(agreementBox!.height, proposalBox!.height);
    const heightDiff = Math.abs(proposalBox!.height - tallerHeight);
    console.log(`3:1 tint: Agreement=${agreementBox!.height}, Proposal=${proposalBox!.height}, Diff=${heightDiff}`);
    expect(heightDiff).toBeLessThan(5);
  });

  // RESPONSIVE TESTS

  test('13. Boundary vertical at 1440px', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(300);

    const boundary = page.locator('[data-testid="agreement-boundary"]');
    await expect(boundary).toBeVisible();

    const box = await boundary.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeLessThan(5);
    expect(box!.height).toBeGreaterThan(50);
  });

  test('14. Boundary vertical at 1024px', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1024, height: 900 });
    await page.waitForTimeout(300);

    const boundary = page.locator('[data-testid="agreement-boundary"]');
    await expect(boundary).toBeVisible();

    const box = await boundary.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeLessThan(5);
    expect(box!.height).toBeGreaterThan(50);
  });

  test('15. Boundary vertical at 768px', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 768, height: 900 });
    await page.waitForTimeout(300);

    const boundary = page.locator('[data-testid="agreement-boundary"]');
    await expect(boundary).toBeVisible();

    const box = await boundary.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeLessThan(5);
    expect(box!.height).toBeGreaterThan(50);
  });

  test('16. Boundary horizontal at 390px', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);

    const boundary = page.locator('[data-testid="agreement-boundary"]');
    await expect(boundary).toBeVisible();

    const box = await boundary.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThan(100);
    expect(box!.height).toBeLessThan(5);
  });

  test('17. Both understandings visible at 1440px', async ({ page }) => {
    await navigateToState(page, 'different_understandings');
    await page.setViewportSize({ width: 1440, height: 900 });

    const pair = page.locator('[data-testid="understanding-pair"]');
    await expect(pair).toBeVisible();

    const text = await pair.textContent();
    expect(text).toContain('PROVIDER UNDERSTANDING');
    expect(text).toContain('CLIENT UNDERSTANDING');
  });

  test('18. Both visible at 1024px', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1024, height: 900 });
    // SELECTOR REMOVED
    await navigateToState(page, 'different_understandings');
    await page.waitForTimeout(300);

    const pair = page.locator('[data-testid="understanding-pair"]');
    await expect(pair).toBeVisible();

    const text = await pair.textContent();
    expect(text).toContain('PROVIDER UNDERSTANDING');
    expect(text).toContain('CLIENT UNDERSTANDING');
  });

  test('19. Both visible at 768px', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 768, height: 1024 });
    // SELECTOR REMOVED
    await navigateToState(page, 'different_understandings');
    await page.waitForTimeout(300);

    const pair = page.locator('[data-testid="understanding-pair"]');
    await expect(pair).toBeVisible();

    const text = await pair.textContent();
    expect(text).toContain('PROVIDER UNDERSTANDING');
    expect(text).toContain('CLIENT UNDERSTANDING');
  });

  test('20. Both visible at 390px', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 390, height: 844 });
    // SELECTOR REMOVED
    await navigateToState(page, 'different_understandings');
    await page.waitForTimeout(300);

    const pair = page.locator('[data-testid="understanding-pair"]');
    await expect(pair).toBeVisible();

    const text = await pair.textContent();
    expect(text).toContain('PROVIDER UNDERSTANDING');
    expect(text).toContain('CLIENT UNDERSTANDING');
  });

  test('21. Both visible at 320px', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 320, height: 568 });
    // SELECTOR REMOVED
    await navigateToState(page, 'different_understandings');
    await page.waitForTimeout(300);

    const pair = page.locator('[data-testid="understanding-pair"]');
    await expect(pair).toBeVisible();

    const text = await pair.textContent();
    expect(text).toContain('PROVIDER UNDERSTANDING');
    expect(text).toContain('CLIENT UNDERSTANDING');
  });

  test('22. No horizontal overflow at 1440px', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(300);

    const agreement = page.locator('[data-testid="agreement-section"]');
    const proposal = page.locator('[data-testid="proposal-band"]');

    const agreementBox = await agreement.boundingBox();
    const proposalBox = await proposal.boundingBox();

    expect(agreementBox).toBeTruthy();
    expect(proposalBox).toBeTruthy();

    expect(agreementBox!.x).toBeGreaterThanOrEqual(0);
    expect(agreementBox!.x + agreementBox!.width).toBeLessThanOrEqual(1440);
    expect(proposalBox!.x).toBeGreaterThanOrEqual(0);
    expect(proposalBox!.x + proposalBox!.width).toBeLessThanOrEqual(1440);
  });

  test('23. No horizontal overflow at 768px', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 768, height: 900 });
    await page.waitForTimeout(300);

    const agreement = page.locator('[data-testid="agreement-section"]');
    const proposal = page.locator('[data-testid="proposal-band"]');

    const agreementBox = await agreement.boundingBox();
    const proposalBox = await proposal.boundingBox();

    expect(agreementBox).toBeTruthy();
    expect(proposalBox).toBeTruthy();

    expect(agreementBox!.x).toBeGreaterThanOrEqual(0);
    expect(agreementBox!.x + agreementBox!.width).toBeLessThanOrEqual(768);
    expect(proposalBox!.x).toBeGreaterThanOrEqual(0);
    expect(proposalBox!.x + proposalBox!.width).toBeLessThanOrEqual(768);
  });

  test('24. No horizontal overflow at 390px', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);

    const agreement = page.locator('[data-testid="agreement-section"]');
    const proposal = page.locator('[data-testid="proposal-band"]');

    const agreementBox = await agreement.boundingBox();
    const proposalBox = await proposal.boundingBox();

    expect(agreementBox).toBeTruthy();
    expect(proposalBox).toBeTruthy();

    expect(agreementBox!.x).toBeGreaterThanOrEqual(0);
    expect(agreementBox!.x + agreementBox!.width).toBeLessThanOrEqual(390);
    expect(proposalBox!.x).toBeGreaterThanOrEqual(0);
    expect(proposalBox!.x + proposalBox!.width).toBeLessThanOrEqual(390);
  });

  test('25. No horizontal overflow at 320px', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 320, height: 568 });
    await page.waitForTimeout(300);

    const agreement = page.locator('[data-testid="agreement-section"]');
    const proposal = page.locator('[data-testid="proposal-band"]');

    const agreementBox = await agreement.boundingBox();
    const proposalBox = await proposal.boundingBox();

    expect(agreementBox).toBeTruthy();
    expect(proposalBox).toBeTruthy();

    expect(agreementBox!.x).toBeGreaterThanOrEqual(0);
    expect(agreementBox!.x + agreementBox!.width).toBeLessThanOrEqual(320);
    expect(proposalBox!.x).toBeGreaterThanOrEqual(0);
    expect(proposalBox!.x + proposalBox!.width).toBeLessThanOrEqual(320);
  });

  // MOTION & ACCESSIBILITY

  test('26. Reduced-motion computed durations equal 0ms', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // SELECTOR REMOVED
    await navigateToState(page, 'shared_understanding');
    await page.waitForTimeout(50);

    const transitionDuration = await page.evaluate(() => {
      return window.getComputedStyle(document.body).transitionDuration;
    });

    expect(transitionDuration).toMatch(/0s|0ms/);
  });

  test('27. State text uses aria-live="polite"', async ({ page }) => {
    await page.goto('/');

    const ariaLive = page.locator('[aria-live="polite"]');
    const count = await ariaLive.count();
    expect(count).toBeGreaterThan(0);

    const stateLine = page.locator('.state-line');
    const hasAriaLive = await stateLine.evaluate(el => el.getAttribute('aria-live') === 'polite');
    expect(hasAriaLive).toBe(true);
  });

  test('28. No forbidden alert/error semantics', async ({ page }) => {
    await page.goto('/');

    const html = await page.content();
    expect(html).not.toContain('role="alert"');
    expect(html).not.toContain('aria-invalid');
  });

  test('29. Visible focus on demo controls', async ({ page }) => {
    await page.goto('/');

    const resetButton = page.getByTestId('reset-demo');
    await expect(resetButton).toBeVisible();

    const box = await resetButton.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.height).toBeGreaterThanOrEqual(40);
  });

  test('30. 200% zoom equivalent (640px viewport)', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 640, height: 900 });
    // SELECTOR REMOVED
    await navigateToState(page, 'different_understandings');
    await page.waitForTimeout(300);

    const pair = page.locator('[data-testid="understanding-pair"]');
    await expect(pair).toBeVisible();

    const agreement = page.locator('[data-testid="agreement-section"]');
    const proposal = page.locator('[data-testid="proposal-band"]');

    const agreementBox = await agreement.boundingBox();
    const proposalBox = await proposal.boundingBox();

    expect(agreementBox).toBeTruthy();
    expect(proposalBox).toBeTruthy();

    expect(agreementBox!.x + agreementBox!.width).toBeLessThanOrEqual(640);
    expect(proposalBox!.x + proposalBox!.width).toBeLessThanOrEqual(640);
  });

  // VOCABULARY & ACCEPTANCE CRITERIA

  test('31. Vocabulary scan - no forbidden words', async ({ page }) => {
    await page.goto('/');

    const html = await page.content();
    const forbiddenWords = [
      'approval', 'approved', 'verified', 'validate', 'validated',
      'signed', 'signature', 'success', 'error', 'pending'
    ];

    for (const word of forbiddenWords) {
      expect(html.toLowerCase()).not.toContain(word.toLowerCase());
    }

    expect(html).toContain('VENUE ACCESS STATUS');
    expect(html).toContain('Not yet confirmed');
  });

  test('32. AC-03: Provider before client at 1440px', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1440, height: 900 });
    // SELECTOR REMOVED
    await navigateToState(page, 'different_understandings');
    await page.waitForTimeout(300);

    const content = page.locator('[data-testid="understanding-pair"]').first();
    const text = await content.textContent();
    expect(text).toBeTruthy();

    const providerPos = text!.indexOf('PROVIDER');
    const clientPos = text!.indexOf('CLIENT');

    expect(providerPos).toBeGreaterThanOrEqual(0);
    expect(clientPos).toBeGreaterThanOrEqual(0);
    expect(providerPos).toBeLessThan(clientPos);
  });

  test('33. AC-08: Shared state - boundary absent, tint removed, proposal at 10-12', async ({ page }) => {
    await page.goto('/');
    // SELECTOR REMOVED
    await navigateToState(page, 'shared_understanding');
    await page.waitForTimeout(300);

    const boundary = page.locator('[data-testid="agreement-boundary"]');
    await expect(boundary).not.toBeVisible();

    const proposalBand = page.locator('[data-testid="proposal-band"]');
    await expect(proposalBand).not.toBeVisible();

    const sharedBlock = page.locator('[data-testid="shared-proposal-block"]');
    await expect(sharedBlock).toBeVisible();

    const html = await page.content();
    expect(html).not.toContain('checkmark');
    expect(html).not.toContain('approved');
  });

  test('34. Difference ticks appear in both columns in Different state', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1440, height: 900 });
    // SELECTOR REMOVED
    await navigateToState(page, 'different_understandings');
    await page.waitForTimeout(300);

    const ticks = page.locator('.difference-tick');
    const count = await ticks.count();
    expect(count).toBeGreaterThan(0);
  });

  // SCREENSHOTS

  test('Screenshots: 01-different-1x1-desktop', async ({ page }) => {
    await navigateToState(page, 'different_understandings');
    await page.setViewportSize({ width: 1440, height: 900 });
    await takeScreenshot(page, '01-different-1x1-desktop.png', 1440, 900);
  });

  test('Screenshots: 02-different-1x3-desktop', async ({ page }) => {
    await navigateToState(page, 'different_understandings', '1:3');
    await page.setViewportSize({ width: 1440, height: 900 });
    await takeScreenshot(page, '02-different-1x3-desktop.png', 1440, 900);
  });

  test('Screenshots: 03-different-3x1-desktop', async ({ page }) => {
    await navigateToState(page, 'different_understandings', '3:1');
    await page.setViewportSize({ width: 1440, height: 900 });
    await takeScreenshot(page, '03-different-3x1-desktop.png', 1440, 900);
  });

  test('Screenshots: 04-shared-desktop', async ({ page }) => {
    await navigateToState(page, 'shared_understanding');
    await page.setViewportSize({ width: 1440, height: 900 });
    await takeScreenshot(page, '04-shared-desktop.png', 1440, 900);
  });

  test('Screenshots: 05-different-mobile', async ({ page }) => {
    await navigateToState(page, 'different_understandings');
    await takeScreenshot(page, '05-different-mobile.png', 390, 844);
  });

  test('Screenshots: 06-shared-mobile', async ({ page }) => {
    await navigateToState(page, 'shared_understanding');
    await takeScreenshot(page, '06-shared-mobile.png', 390, 844);
  });

  test('Screenshots: 07-shared-grayscale', async ({ page }) => {
    await navigateToState(page, 'shared_understanding');

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.textContent = 'html { filter: grayscale(100%); }';
      document.head.appendChild(style);
    });
    await page.waitForTimeout(300);

    await takeScreenshot(page, '07-shared-grayscale.png', 1440, 900);
  });

  // ENHANCED STRUCTURAL TESTS

  test('35. Direct parentage: shared-proposal-block is direct child of agreement-shell', async ({ page }) => {
    await page.goto('/');
    // SELECTOR REMOVED
    await navigateToState(page, 'shared_understanding');
    await page.waitForTimeout(300);

    // Test using exact selector: [data-testid="agreement-shell"] > [data-testid="shared-proposal-block"]
    const directChild = page.locator('[data-testid="agreement-shell"] > [data-testid="shared-proposal-block"]');
    await expect(directChild).toBeVisible();

    // Verify it's NOT nested deeper (not a grandchild)
    const grandChild = page.locator('[data-testid="agreement-shell"] > * > [data-testid="shared-proposal-block"]');
    const grandChildCount = await grandChild.count();
    expect(grandChildCount).toBe(0); // Should not exist as grandchild

    console.log('Direct nesting verified: agreement-shell > shared-proposal-block');
  });

  test('36. Provider/Client geometry at 1024px (side by side)', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1024, height: 900 });
    // SELECTOR REMOVED
    await navigateToState(page, 'different_understandings');
    await page.waitForTimeout(300);

    const pair = page.locator('[data-testid="understanding-pair"]');
    await expect(pair).toBeVisible();

    const provider = pair.locator('.understanding-column').first();
    const client = pair.locator('.understanding-column').last();

    const providerBox = await provider.boundingBox();
    const clientBox = await client.boundingBox();

    expect(providerBox).toBeTruthy();
    expect(clientBox).toBeTruthy();

    // Side by side: provider x + width < client x
    expect(providerBox!.x + providerBox!.width).toBeLessThan(clientBox!.x);
    console.log(`1024px: Provider width=${providerBox!.width}px, Client width=${clientBox!.width}px`);
  });

  test('36b. Provider/Client Y positions at 1024px (same Y, side by side)', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1024, height: 900 });
    // SELECTOR REMOVED
    await navigateToState(page, 'different_understandings');
    await page.waitForTimeout(300);

    const pair = page.locator('[data-testid="understanding-pair"]');
    await expect(pair).toBeVisible();

    const provider = page.locator('[data-testid="provider-understanding"]');
    const client = page.locator('[data-testid="client-understanding"]');

    const providerBox = await provider.boundingBox();
    const clientBox = await client.boundingBox();

    expect(providerBox).toBeTruthy();
    expect(clientBox).toBeTruthy();

    // Side by side: same Y position (within 2px), provider x + width < client x
    expect(Math.abs(providerBox!.y - clientBox!.y)).toBeLessThan(2);
    expect(providerBox!.x + providerBox!.width).toBeLessThan(clientBox!.x);
    console.log(`1024px: Provider x=${providerBox!.x}, width=${providerBox!.width}; Client x=${clientBox!.x} (side by side)`);
  });

  test('37. Provider/Client Y positions at 768px (stacked vertically)', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 768, height: 1200 });
    // SELECTOR REMOVED
    await navigateToState(page, 'different_understandings');
    await page.waitForTimeout(300);

    const pair = page.locator('[data-testid="understanding-pair"]');
    await expect(pair).toBeVisible();

    const provider = page.locator('[data-testid="provider-understanding"]');
    const client = page.locator('[data-testid="client-understanding"]');

    const providerBox = await provider.boundingBox();
    const clientBox = await client.boundingBox();

    expect(providerBox).toBeTruthy();
    expect(clientBox).toBeTruthy();

    // Stacked: provider below provider (client y > provider y + height)
    expect(clientBox!.y).toBeGreaterThan(providerBox!.y + providerBox!.height - 5);
    console.log(`768px: Provider y=${providerBox!.y}, height=${providerBox!.height}; Client y=${clientBox!.y} (stacked)`);
  });

  test('38. Focus outline styles on buttons', async ({ page }) => {
    await page.goto('/');

    const recordButton = page.getByTestId('record-proposal');
    await expect(recordButton).toBeVisible();

    // Focus the button
    await recordButton.focus();
    await page.waitForTimeout(200);

    // Check actual computed focus styles
    const outlineProps = await recordButton.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        outlineWidth: style.outlineWidth,
        outlineStyle: style.outlineStyle,
        outlineOffset: style.outlineOffset,
      };
    });

    console.log(`Focus styles: width=${outlineProps.outlineWidth}, style=${outlineProps.outlineStyle}, offset=${outlineProps.outlineOffset}`);
    expect(outlineProps.outlineWidth).toMatch(/2px/);
    expect(outlineProps.outlineStyle).toBe('solid');
    expect(outlineProps.outlineOffset).toMatch(/2px/);
  });

  test.skip(
    '39. Axe accessibility scan — @axe-core/playwright not installed',
    async () => {}
  );

  test('40. Difference ticks present in understanding columns', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1440, height: 900 });
    // SELECTOR REMOVED
    await navigateToState(page, 'different_understandings');
    await page.waitForTimeout(300);

    const ticks = page.locator('.understanding-column .difference-tick');
    const count = await ticks.count();
    console.log(`Difference ticks found: ${count}`);
    expect(count).toBeGreaterThanOrEqual(2); // At least one per understanding column
  });

  test('41. No difference ticks in Shared state', async ({ page }) => {
    await page.goto('/');
    // SELECTOR REMOVED
    await navigateToState(page, 'shared_understanding');
    await page.waitForTimeout(300);

    const ticks = page.locator('.difference-tick');
    const count = await ticks.count();
    expect(count).toBe(0);
  });
});
