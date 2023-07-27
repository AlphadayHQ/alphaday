Feature: Filtering by keyword
    Using keywords to filter the content of a board

    Background: Load the board to filter
        Given I load alphaday url "/b/alpha"
        When the default board is visible
        And I have completed the tutorial
        And I have accepted cookies
        Then the header should be displayed

    Scenario: Filtering by a popular keyword (Nft)
        When I search for "nft"
        Then "nft" tags should be in search bar
