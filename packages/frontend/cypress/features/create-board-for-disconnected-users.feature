Feature: Custom Boards for Disconnected Users

    Scenario: Attempting to create a Custom Board while disconnected
        Given I load alphaday url "/b/alpha"
        When I attempt to click on "+ Save as" button in header
        Then "+ Save as" button should be disabled

    Scenario: Attempting to create a Custom Board via Boards Manager "+" while disconnected
        Given I load alphaday url "/b/alpha"
        When I click on "Boards" button in header
        Then the Boards Manager drops down
        And I can see the create board button in the custom boards column
        But create board button is disabled
