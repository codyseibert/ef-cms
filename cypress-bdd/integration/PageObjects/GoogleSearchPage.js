const SEARCH_FIELD = 'input[type=text]';
const SEARCH_BUTTON = 'input[type=submit]';
const SEARCH_TEXT = 'Buscar';

export class GoogleSearchPage {
  static visit = url => {
    cy.visit(url);
  };

  static type = query => {
    cy.get(SEARCH_FIELD) // 2 seconds
      .type(query);
  };

  static pressSearch = () => {
    cy.get(SEARCH_BUTTON).contains(SEARCH_TEXT).click();
  };
}
