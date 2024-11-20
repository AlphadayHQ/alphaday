import {
    ETutorialTipAlign,
    ETutorialIndicatorType,
    ETutorialTipId,
} from "src/api/types";
import i18n from "src/i18n";

const translate = (key: string) => {
    return i18n.t(`tutorials.${key}`);
};

export const tutorials = [
    {
        id: ETutorialTipId.SwitchView,
        title: translate("switchView_title"),
        text: translate("switchView_text"),
        align: ETutorialTipAlign.Center,
        indicatorType: ETutorialIndicatorType.Rect,
    },
    {
        id: ETutorialTipId.WalletView,
        title: translate("walletView_title"),
        text: translate("walletView_text"),
        align: ETutorialTipAlign.Left,
        indicatorType: ETutorialIndicatorType.Rect,
    },
    {
        id: ETutorialTipId.UseSeachBar,
        title: translate("useSeachBar_title"),
        text: translate("useSeachBar_text"),
        align: ETutorialTipAlign.Center,
        indicatorType: ETutorialIndicatorType.Rect,
    },
    {
        id: ETutorialTipId.ReArrangeWidget,
        title: translate("reArrangeWidget_title"),
        text: translate("reArrangeWidget_text"),
        align: ETutorialTipAlign.Center,
        indicatorType: ETutorialIndicatorType.Rect,
    },
    {
        id: ETutorialTipId.UseWidgetLib,
        title: translate("useWidgetLib_title"),
        text: translate("useWidgetLib_text"),
        align: ETutorialTipAlign.Right,
        indicatorType: ETutorialIndicatorType.Rect,
    },
    {
        id: ETutorialTipId.ComeBack,
        title: undefined,
        text: translate("comeBack_text"),
        align: ETutorialTipAlign.Right,
        indicatorType: ETutorialIndicatorType.Ring,
    },
];
