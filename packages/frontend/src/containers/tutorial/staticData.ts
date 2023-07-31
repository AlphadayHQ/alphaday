import {
    ETutorialTipAlign,
    ETutorialIndicatorType,
    ETutorialTipId,
} from "src/api/types";

export const tutorials = [
    {
        id: ETutorialTipId.SwitchView,
        title: "Switch between boards",
        text: "Optimize your workflow by using different boards curated with various widgets, or create your own.",
        align: ETutorialTipAlign.Center,
        indicatorType: ETutorialIndicatorType.Rect,
        indicatorAnimationScale: 1.1,
    },
    {
        id: ETutorialTipId.WalletView,
        title: "Create a Wallet board",
        text: "Keep track of all information on alphaday regarding assets in your wallet.",
        align: ETutorialTipAlign.Left,
        indicatorType: ETutorialIndicatorType.Rect,
        indicatorAnimationScale: 1.1,
    },
    {
        id: ETutorialTipId.UseSeachBar,
        title: "Search Bar",
        text: "Search for your favorite tokens, projects, or topics to filter the content inside the widgets.",
        align: ETutorialTipAlign.Center,
        indicatorType: ETutorialIndicatorType.Rect,
        indicatorAnimationScale: 1.04,
    },
    {
        id: ETutorialTipId.ReArrangeWidget,
        title: "Re-arrange widgets",
        text: "Click and drag widgets by the top bar to change their position in the dashboard, or click once to minimize.",
        align: ETutorialTipAlign.Center,
        indicatorType: ETutorialIndicatorType.Rect,
        indicatorAnimationScale: 1.03,
    },
    // {
    //     id: ETutorialTipId.ResizeWidget,
    //     title: "Widget resizing",
    //     text:
    //         "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    //     align: ETutorialTipAlign.Center,indicatorType: ETutorialIndicatorType.Ring,
    // },
    // {
    //     id: ETutorialTipId.MaximizeWidget,
    //     title: "Maximize widgets",
    //     text:
    //         "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    //     align: ETutorialTipAlign.Center,indicatorType: ETutorialIndicatorType.Ring,
    // },
    {
        id: ETutorialTipId.UseWidgetLib,
        title: "Widgets Library",
        text: "There are dozens of useful widgets available for you in the Widgets Library to pick and choose from.",
        align: ETutorialTipAlign.Right,
        indicatorType: ETutorialIndicatorType.Rect,
        indicatorAnimationScale: 1.09,
    },
    {
        id: ETutorialTipId.ComeBack,
        title: undefined,
        text: "Come back to the walk-through at any time in the user menu.",
        align: ETutorialTipAlign.Right,
        indicatorType: ETutorialIndicatorType.Ring,
        indicatorAnimationScale: 1.15,
    },
];
