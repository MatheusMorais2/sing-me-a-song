describe("Random recommendation", () => {
  before(() => {
    cy.resetDatabase();
    cy.seedDatabase();
  });

  it("Should display a random recommendation", () => {
    cy.visit("http://localhost:3000/top");

    cy.get(".title-row").should("be.visible");
  });
});
