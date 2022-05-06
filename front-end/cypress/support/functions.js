export function insertVideo(title, url) {
  cy.get("#recommendation-title").type(title);
  cy.get("#recommendation-url").type(url);
  cy.intercept("POST", "/recommendations").as("postRecommendation");
  cy.get("#recommendation-send").click();
  cy.wait("@postRecommendation");
}

export function vote(UpOrDown) {
  cy.get("@idValue").then((idValue) =>
    cy.intercept("POST", `/recommendations/${idValue}/${UpOrDown}`).as(UpOrDown)
  );
  cy.get(`.${UpOrDown}`).first().click();
  cy.wait(`@${UpOrDown}`);
}
