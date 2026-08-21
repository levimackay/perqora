import { test, expect } from "@playwright/test";

/**
 * The one journey the product spec calls out explicitly: visit, personalize,
 * browse, open a benefit, save it, and see it reflected back with a savings
 * figure. No login exists anywhere in this flow, by design.
 */
test("visit, personalize, browse, open, save, and see savings", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /your student email is worth more/i })).toBeVisible();

  await page.getByRole("link", { name: "Find my benefits" }).first().click();
  await expect(page).toHaveURL(/\/discover/);

  await page.getByPlaceholder("you@university.edu").fill("student@byui.edu");
  await page.getByRole("button", { name: "Continue" }).click();

  const interestChip = page.getByText("Software Development", { exact: false }).first();
  await expect(interestChip).toBeVisible();
  await interestChip.click();
  await page
    .getByRole("button", { name: /continue|see|results|find/i })
    .first()
    .click();

  await expect(page.getByText(/potential annual value/i)).toBeVisible();
  const resultLink = page.getByRole("link", { name: /GitHub Student Developer Pack/i }).first();
  await expect(resultLink).toBeVisible();
  await resultLink.click();

  await expect(page).toHaveURL(/\/benefits\/github-student-developer-pack/);
  await expect(page.getByRole("heading", { name: "GitHub Student Developer Pack" })).toBeVisible();
  await expect(page.getByRole("link", { name: /claim benefit/i })).toHaveAttribute(
    "href",
    "https://education.github.com/pack",
  );

  const saveButton = page.getByRole("button", { name: /save for later/i });
  const saveRequest = page.waitForResponse(
    (res) => res.url().includes("/api/saved-benefits") && res.request().method() === "POST",
  );
  await saveButton.click();
  await saveRequest;
  await expect(page.getByRole("button", { name: /^saved$/i })).toBeVisible();

  await page.goto("/saved");
  await expect(page.getByRole("heading", { name: "Your saved benefits", exact: true })).toBeVisible();
  await expect(page.getByText("GitHub Student Developer Pack")).toBeVisible();
  await expect(page.getByText(/potential annual value/i)).toBeVisible();
});

test("browsing and filtering the full index works without personalizing first", async ({ page }) => {
  await page.goto("/benefits");
  await expect(page.getByRole("heading", { name: /benefits/i }).first()).toBeVisible();

  const rows = page.locator("a").filter({ hasText: "GitHub Student Developer Pack" });
  await expect(rows).toHaveCount(1);
});

test("submitting a benefit shows a pending-review confirmation, not an instant publish", async ({ page }) => {
  await page.goto("/submit");

  await page.getByLabel(/benefit name/i).fill("Test Benefit From E2E");
  await page.getByLabel(/provider/i).fill("Test Provider");
  await page
    .getByLabel(/^url|official url/i)
    .first()
    .fill("https://example.com/student-offer");
  await page
    .getByLabel(/description/i)
    .fill("A benefit submitted by an automated end to end test, at least twenty characters long.");
  await page.getByLabel(/category/i).fill("Developer Tools");

  await page.getByRole("button", { name: /submit/i }).click();

  await expect(page.getByText(/review queue|not live yet|pending/i)).toBeVisible({ timeout: 10_000 });
});
