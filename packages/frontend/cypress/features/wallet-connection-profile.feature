Feature: Wallet Connection

    Scenario: Disconnected at first load
        Given I load alphaday url "/b/alpha"
        When the default board is visible
        And I have completed the tutorial
        And I have accepted cookies
        Then the wallet address should not be visible

    Scenario: Connect wallet from profile(user options) with success
        # the dropdown is still open from the previous scenario
        Given I click on the "Connect Wallet" user option
        And I click on the metamask option
        And I accept Metamask access
        Then the wallet address should not be visible
        Then I should see the verify wallet pop up

    Scenario: Verify wallet from profile(user options) with success
        Given I close the verify wallet pop up
        And I click on the profile dropdown
        And I click on the "Verify Your Wallet" user option
        And I confirm the Metamask signature request
        Then the wallet address should match <ENV_TEST_ADDRESS>

    Scenario: Disconnect wallet with success from profile(user options)
        Given I click on the profile dropdown
        And I click on the "Disconnect Wallet" user option
        Then the wallet address should not be visible
