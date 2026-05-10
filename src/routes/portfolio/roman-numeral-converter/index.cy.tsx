/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import RomanNumeralConverter from "./index";

describe("Roman numeral converter page", () => {
  it("previews the default conversion", () => {
    cy.mount(<RomanNumeralConverter />);

    cy.get("#decimal-input").should("have.value", "36");
    cy.contains(".converter-output strong", "XXXVI").should("be.visible");
    cy.get("#decimal-feedback")
      .should("have.attr", "data-state", "valid")
      .and("contain.text", "Ready to save this conversion to your history.");
  });

  it("validates unsupported decimal input", () => {
    cy.mount(<RomanNumeralConverter />);

    cy.get("#decimal-input").clear().type("4000");
    cy.get("#decimal-feedback")
      .should("have.attr", "data-state", "invalid")
      .and(
        "contain.text",
        "Choose a value from 1 to 3,999 — Roman numerals do not extend beyond that range.",
      );
    cy.contains("button", "Save conversion").should("be.disabled");
  });

  it("saves valid conversions to a deduplicated recent history", () => {
    cy.mount(<RomanNumeralConverter />);

    cy.contains("button", "Save conversion").click();
    cy.get("#decimal-input").clear().type("5");
    cy.contains("button", "Save conversion").click();
    cy.get("#decimal-input").clear().type("36");
    cy.contains("button", "Save conversion").click();

    cy.get(".history-item").should("have.length", 2);
    cy.get(".history-item")
      .first()
      .within(() => {
        cy.contains("36").should("be.visible");
        cy.contains("XXXVI").should("be.visible");
      });
    cy.get(".history-item")
      .eq(1)
      .within(() => {
        cy.contains("5").should("be.visible");
        cy.contains("V").should("be.visible");
      });
  });
});
