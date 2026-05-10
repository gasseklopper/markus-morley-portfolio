/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import Index from "./index";

describe("Root page", () => {
  it("renders portfolio hero text", () => {
    cy.mount(<Index />);
    cy.contains("Brutalist design & code for fearless brands.").should(
      "be.visible",
    );
  });
});
