import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    twMerge,
} from "@alphaday/ui-kit";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { EnumLanguageCode } from "src/api/types/language";
import { Logger } from "src/api/utils/logging";
import { ReactComponent as CheckedSVG } from "src/assets/icons/checkmark.svg";

interface IProps {
    onSetLanguageCode: (code: EnumLanguageCode) => void;
    selectedCode: string;
    showModal: boolean;
    onClose?: () => void;
}

const languages = [
    { code: EnumLanguageCode.EN, name: "English", icon: "🇬🇧" },
    { code: EnumLanguageCode.FR, name: "Français", icon: "🇫🇷" },
    { code: EnumLanguageCode.ES, name: "Español", icon: "🇪🇸" },
    { code: EnumLanguageCode.JA, name: "日本語", icon: "🇯🇵" },
    { code: EnumLanguageCode.TR, name: "Turkish", icon: "🇹🇷" },
];

export const LanguageModal: React.FC<IProps> = ({
    onSetLanguageCode,
    selectedCode,
    showModal,
    onClose,
}) => {
    const { t } = useTranslation();

    const handleLanguageSelect = (code: EnumLanguageCode) => {
        i18next
            .changeLanguage(code)
            .then(() => {
                onSetLanguageCode(code);
                onClose?.();
            })
            .catch((e) => {
                Logger.error(
                    "handleLanguageSelect::Error changing language::",
                    e
                );
            });
    };
    return (
        <Modal showModal={showModal} onClose={onClose} size="md">
            <ModalHeader>
                <ModalTitle>{t("language.title")}</ModalTitle>
            </ModalHeader>

            <ModalBody className="flex w-full justify-around">
                {languages.map(({ code, name, icon }) => (
                    <div className="flex flex-col items-center gap-3">
                        <Button
                            key={code}
                            variant="secondary"
                            className={twMerge(
                                "flex flex-col items-center justify-center p-4 w-20 h-20 rounded-full",
                                selectedCode === code &&
                                    "bg-[#FAA202]/-30 border border-accentVariant100"
                            )}
                            onClick={() => {
                                handleLanguageSelect(code);
                            }}
                        >
                            <span className="text-3xl">{icon}</span>
                            <span className="text-xs">{name}</span>
                        </Button>
                        <span className="h-4">
                            <CheckedSVG
                                className="size-5 text-primary [&_path]:!stroke-accentVariant100"
                                style={{
                                    display:
                                        selectedCode === code
                                            ? "block"
                                            : "none",
                                }}
                            />
                        </span>
                    </div>
                ))}
            </ModalBody>
            <ModalFooter>
                <Button className="pt-1.5" onClick={onClose}>
                    {t("language.close_button")}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
