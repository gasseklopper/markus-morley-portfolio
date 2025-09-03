/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import ColorPalette from "./index";

describe("Color palette page", () => {
  it("renders canvas", () => {
    cy.mount(<ColorPalette />);
    cy.get("canvas").should("exist");
  });
});
