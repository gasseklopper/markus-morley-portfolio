/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import ShoppingLedger from "./index";

describe("Shopping ledger page", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.removeItem("mm-shopping-ledger-v1");
    });
  });

  it("renders seeded list totals and the active grocery mission", () => {
    cy.mount(<ShoppingLedger />);

    cy.contains(".lab-hero__meta dd", "02").should("be.visible");
    cy.contains(".lab-hero__meta dd", "05").should("be.visible");
    cy.contains(".lab-list__title", "Neo Market Ritual").should("be.visible");
    cy.contains(".lab-canvas__header h3", "Neo Market Ritual").should(
      "be.visible",
    );
    cy.contains(".lab-item__label", "Chromatic citrus").should("be.visible");
  });

  it("creates a list, adds an item, and stores the active list snapshot", () => {
    cy.mount(<ShoppingLedger />);

    cy.get("#list-name").type("Weekend refill");
    cy.contains("button", "Create List").click();
    cy.contains(".lab-canvas__header h3", "Weekend refill").should(
      "be.visible",
    );

    cy.get("#item-name").type("Fresh basil");
    cy.contains("button", "Add to list").click();

    cy.contains(".lab-item__label", "Fresh basil").should("be.visible");
    cy.window()
      .its("localStorage.mm-shopping-ledger-v1")
      .should((snapshot) => {
        const parsed = JSON.parse(snapshot);
        expect(parsed.activeListId).to.equal(parsed.lists[0].id);
        expect(parsed.lists[0].name).to.equal("Weekend refill");
        expect(parsed.lists[0].items[0].label).to.equal("Fresh basil");
        expect(parsed.ledger[0].label).to.equal("Fresh basil");
      });
  });

  it("cycles item status through collected, missing, and idle", () => {
    cy.mount(<ShoppingLedger />);

    cy.contains(".lab-item", "Chromatic citrus").as("item");
    cy.get("@item").should("have.attr", "data-state", "idle");
    cy.get("@item").find(".lab-item__toggle").click();
    cy.get("@item").should("have.attr", "data-state", "complete");
    cy.get("@item").find(".lab-item__toggle").click();
    cy.get("@item").should("have.attr", "data-state", "skip");
    cy.get("@item").find(".lab-item__toggle").click();
    cy.get("@item").should("have.attr", "data-state", "idle");
  });

  it("uses the frequency window to hide older suggestions", () => {
    const now = new Date();
    const stale = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10);

    cy.window().then((win) => {
      win.localStorage.setItem(
        "mm-shopping-ledger-v1",
        JSON.stringify({
          version: 1,
          lists: [
            {
              id: "weekly",
              name: "Weekly pantry",
              createdAt: now.toISOString(),
              items: [],
            },
          ],
          ledger: [
            {
              id: "recent-oats",
              label: "Oat milk",
              timestamp: now.toISOString(),
            },
            {
              id: "stale-lemons",
              label: "Preserved lemons",
              timestamp: stale.toISOString(),
            },
          ],
          settings: {
            windowDays: 30,
          },
          activeListId: "weekly",
        }),
      );
    });

    cy.mount(<ShoppingLedger />);

    cy.contains(".lab-chip", "Preserved lemons").should("be.visible");
    cy.contains("button", "Adjust settings").click();
    cy.get('.lab-settings input[type="number"]').clear().type("7");

    cy.contains(".lab-chip", "Preserved lemons").should("not.exist");
    cy.contains(".lab-chip", "Oat milk").should("be.visible");
  });
});
