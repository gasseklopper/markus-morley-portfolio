/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import Index from "./index";

describe("Root page", () => {
  it("renders welcome text", () => {
    cy.mount(<Index />);
    cy.contains("Can't wait to see what you build with qwik!").should(
      "be.visible",
    );
  });
});
