Feature: Wallet Connection

    Scenario: Disconnected at first load
        Given I load alphaday url "/b/alpha"
        When the default board is visible
        And I have completed the tutorial
        And I have accepted cookies
        Then the wallet address should not be visible

    Scenario: Connect metamask through portfolio
        Given I click on the "Connect Wallet" button in the portfolio widget
        And I click on the metamask option
        And I close the verify wallet pop up
        Then my wallet should be connected
        And the wallet address should not be visible
        And I should see <ENV_TEST_ADDRESS> in the portfolio tabs
        And I should see "Verify Wallet" in the portfolio widget

    Scenario: Verify wallet from portfolio with success
        Given I click on the "Verify Wallet" button in the portfolio widget
        And I confirm the Metamask signature request
        Then the wallet address should match <ENV_TEST_ADDRESS>

    Scenario: Disconnect wallet with success from profile(user options)
        Given I click on the profile dropdown
        And I click on the "Disconnect Wallet" user option
        Then the wallet address should not be visible
