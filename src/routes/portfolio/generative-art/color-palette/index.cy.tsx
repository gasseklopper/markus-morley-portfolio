/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import ColorPalette from "./index";

describe("Color palette page", () => {
  it("renders the sketch container", () => {
    cy.mount(<ColorPalette />);
    cy.get("#p5-container").should("exist");
  });
});
