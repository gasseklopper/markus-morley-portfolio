/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import DripSortArt from "./index";

describe("Drip sort art page", () => {
  it("renders canvas", () => {
    cy.mount(<DripSortArt />);
    cy.get("canvas").should("exist");
  });
});
