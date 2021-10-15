Feature: Google Main Page

    As a user I want to open a search engine so that I can verify I can access the page

    @focus
    Scenario: Opening a search engine page
        Given I open Google page
        Then I see "Google" in the title