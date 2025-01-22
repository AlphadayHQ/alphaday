import {
    ETutorialTipAlign,
    ETutorialIndicatorType,
    ETutorialTipId,
} from "src/api/types";

export const tutorials = (translate: (key: string) => string) => [
    {
        id: ETutorialTipId.SwitchView,
        title: translate("switchViewTitle"),
        text: translate("switchViewText"),
        align: ETutorialTipAlign.Center,
        indicatorType: ETutorialIndicatorType.Rect,
    },
    {
        id: ETutorialTipId.WalletView,
        title: translate("walletViewTitle"),
        text: translate("walletViewText"),
        align: ETutorialTipAlign.Left,
        indicatorType: ETutorialIndicatorType.Rect,
    },
    {
        id: ETutorialTipId.UseSeachBar,
        title: translate("useSeachBarTitle"),
        text: translate("useSeachBarText"),
        align: ETutorialTipAlign.Center,
        indicatorType: ETutorialIndicatorType.Rect,
    },
    {
        id: ETutorialTipId.ReArrangeWidget,
        title: translate("reArrangeWidgetTitle"),
        text: translate("reArrangeWidgetText"),
        align: ETutorialTipAlign.Center,
        indicatorType: ETutorialIndicatorType.Rect,
    },
    {
        id: ETutorialTipId.UseWidgetLib,
        title: translate("useWidgetLibTitle"),
        text: translate("useWidgetLibText"),
        align: ETutorialTipAlign.Right,
        indicatorType: ETutorialIndicatorType.Rect,
    },
    {
        id: ETutorialTipId.ComeBack,
        title: undefined,
        text: translate("comeBackText"),
        align: ETutorialTipAlign.Right,
        indicatorType: ETutorialIndicatorType.Ring,
    },
];
