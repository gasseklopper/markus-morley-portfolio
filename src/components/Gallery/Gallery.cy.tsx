import { jsx } from "@builder.io/qwik";
import { Gallery } from "./Gallery";

it("updates gallery bounds on window resize without leaving empty slides", () => {
  cy.viewport(767, 800);
  cy.mount(jsx(Gallery, {}));
  cy.get(".gallery__meta").should("have.text", "01/05");
  for (let index = 0; index < 4; index++) {
    cy.get('[aria-label="Next images"]').click();
  }
  cy.get(".gallery__meta").should("have.text", "05/05");
  cy.viewport(768, 800);
  cy.get(".gallery__meta").should("have.text", "03/03");
  cy.get('[aria-label="Next images"]').should("be.disabled");
  cy.get('[aria-label="Previous images"]').click();
  cy.get(".gallery__meta").should("have.text", "02/03");
  cy.viewport(767, 800);
  cy.get(".gallery__meta").should("have.text", "02/05");
  cy.get('[aria-label="Next images"]').click();
  cy.get(".gallery__meta").should("have.text", "03/05");
});
