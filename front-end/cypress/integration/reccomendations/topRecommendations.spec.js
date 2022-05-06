describe("Top recommendations", () => {
  before(() => {
    cy.resetDatabase();
    cy.seedDatabase();
  });

  it("Should display the top rated recommendation first", () => {
    cy.visit("http://localhost:3000/top");

    cy.get(".title-row").first().should("have.text", "Terra");
  });
});
