Feature: Navigation for disconnected users

    Scenario: Navigating to a default board
        # This is same as opening the app
        Given I load alphaday url "/b/alpha"
        When the default board is visible
        And I have completed the tutorial
        And I have accepted cookies
        Then the header should be displayed

    Scenario: Navigating to a non-existing board
        Given I load alphaday url "/b/non-existing-board"
        Then I should see the "404" error page
        And a "Back to Home" button appears

    Scenario: Navigating back from non-existing board
        Given I am on "/b/non-existing-board" page
        And I click on "Back to Home" button
        Then I should revert back to home
