describe("Homepage animation and navigation", () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem("theme-motion-preference", "normal");
      },
    });
  });

  it("plays the intro and reveals the pinned statement while scrolling", () => {
    cy.get("[data-title-char]", { timeout: 15000 }).should(
      "have.css",
      "opacity",
      "1",
    );
    cy.get("[data-test-codex]").should("have.css", "overflow-x", "clip");
    cy.get("[data-statement]").then(($statement) => {
      const top = $statement.offset()!.top;
      cy.scrollTo(0, top + 700, { duration: 300 });
    });
    cy.get("[data-statement-group]")
      .first()
      .should("have.css", "visibility", "visible");
    cy.get("[data-statement-phrase]").first().should("be.visible");
  });

  it("opens the menu and closes it with Escape", () => {
    cy.get('[aria-controls="site-menu"]').click();
    cy.get('[aria-controls="site-menu"]').should(
      "have.attr",
      "aria-expanded",
      "true",
    );
    cy.get("#site-menu").should("have.attr", "aria-hidden", "false");
    cy.get('[aria-controls="site-menu"]').trigger("keydown", { key: "Escape" });
    cy.get('[aria-controls="site-menu"]').should(
      "have.attr",
      "aria-expanded",
      "false",
    );
    cy.get("#site-menu").should("have.attr", "inert");
  });

  it("reinitializes the homepage after navigating away and back", () => {
    cy.get('[aria-controls="site-menu"]').click();
    cy.get('#site-menu .menu__col-links a[href="/about"]').click();
    cy.location("pathname").should("match", /\/about\/?$/);
    cy.get('[aria-controls="site-menu"]').should(
      "have.attr",
      "aria-expanded",
      "false",
    );
    cy.get('.navigation__logo a[href="/"]').click();
    cy.location("pathname").should("eq", "/");
    cy.get("[data-title-char]", { timeout: 15000 }).should(
      "have.css",
      "opacity",
      "1",
    );
    cy.get(".page-transition").should("have.css", "display", "none");
  });
});
