/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import ConnectedAgents from "./index";

describe("Connected Agents page", () => {
  it("renders canvas", () => {
    cy.mount(<ConnectedAgents />);
    cy.get("canvas").should("exist");
  });
});
