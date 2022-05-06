import { vote, insertVideo } from "../../support/functions";

describe("Insert recommendation", () => {
  before(() => {
    cy.resetDatabase();
  });
  it("Should insert sucessfully", () => {
    cy.visit("http://localhost:3000");

    insertVideo(
      "Ainda gosto dela",
      "https://www.youtube.com/watch?v=hFYL73n7Ktg"
    );

    cy.contains("Ainda gosto dela").should("be.visible");
  });

  it("Should upvote sucessfully", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Ainda gosto dela").invoke("attr", "id").as("idValue");
    vote("upvote");
    cy.get(".vote").should("have.text", "1");
  });

  it("Should downvote succesfully", () => {
    cy.visit("http://localhost:3000");

    cy.contains("Ainda gosto dela").invoke("attr", "id").as("idValue");
    vote("downvote");
    cy.get(".vote").should("have.text", "0");
  });

  it("Should remove a recommendation given -5 downvotes", () => {
    cy.visit("http://localhost:3000");

    cy.contains("Ainda gosto dela").invoke("attr", "id").as("idValue");

    for (let i = 0; i < 7; i++) {
      vote("downvote");
    }

    cy.contains("No recommendations yet! Create your own :)").should(
      "be.visible"
    );
  });
});
