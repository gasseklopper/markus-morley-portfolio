/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import PasswordForge from "./index";

describe("Password forge page", () => {
  beforeEach(() => {
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, "writeText").rejects(
        new Error("Clipboard unavailable"),
      );
    });
  });

  it("renders a generated password with the default length", () => {
    cy.mount(<PasswordForge />);

    cy.contains(".hero__badge", "Project 017").should("be.visible");
    cy.contains("h1", "ASCII Password Forge").should("be.visible");
    cy.get(".password-display__value")
      .invoke("text")
      .then((password) => {
        expect(password.trim()).to.have.length(16);
      });
    cy.contains("output", "16").should("be.visible");
  });

  it("keeps at least one character set active", () => {
    cy.mount(<PasswordForge />);

    cy.contains(".control--checkbox", "Uppercase").find("input").uncheck();
    cy.contains(".control--checkbox", "Lowercase").find("input").uncheck();
    cy.contains(".control--checkbox", "Digits").find("input").uncheck();
    cy.contains(".control--checkbox", "Symbols").find("input").uncheck();

    cy.contains(
      "#toggle-warning",
      "Keep at least one character set active.",
    ).should("be.visible");
    cy.contains(".control--checkbox", "Symbols")
      .find("input")
      .should("be.checked");
  });

  it("updates the generated password when the length changes", () => {
    cy.mount(<PasswordForge />);

    cy.get('input[type="range"]').invoke("val", 24).trigger("input");

    cy.contains("output", "24").should("be.visible");
    cy.get(".password-display__value")
      .invoke("text")
      .then((password) => {
        expect(password.trim()).to.have.length(24);
      });
  });

  it("shows manual copy guidance when the clipboard is blocked", () => {
    cy.mount(<PasswordForge />);

    cy.contains("button", "Copy").click();

    cy.contains(
      ".copy-state--error",
      "Clipboard blocked — copy manually.",
    ).should("be.visible");
  });
});
