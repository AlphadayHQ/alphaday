Feature: Maintenance Mode

    Scenario: Opening the app on maintenance mode
        Given I opened alphaday when on maintenance
        # technically, it's not an error page, but it's easier to test this way
        Then I should see the "System maintenance" error page
