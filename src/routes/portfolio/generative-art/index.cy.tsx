/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import GenerativeArt from "./index";

describe("Generative art page", () => {
  it("renders p5 canvas", () => {
    cy.mount(<GenerativeArt />);
    cy.get("canvas").should("exist");
  });
});
