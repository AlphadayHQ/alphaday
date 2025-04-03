import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    twMerge,
} from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import { useAllowedTranslations } from "src/api/hooks/useAllowedTranslations";
import { ELanguageCode } from "src/api/types/language";
import { ReactComponent as CheckedSVG } from "src/assets/icons/checkmark.svg";

interface IProps {
    onSetLanguageCode: (code: ELanguageCode) => void;
    selectedCode: string;
    showModal: boolean;
    onClose: () => void;
}

const languages = [
    { code: ELanguageCode.EN, name: "English", icon: "🇬🇧" },
    { code: ELanguageCode.FR, name: "Français", icon: "🇫🇷" },
    { code: ELanguageCode.ES, name: "Español", icon: "🇪🇸" },
    { code: ELanguageCode.JA, name: "日本語", icon: "🇯🇵" },
    { code: ELanguageCode.TR, name: "Turkish", icon: "🇹🇷" },
    { code: ELanguageCode.ZH, name: "中文", icon: "🇨🇳" },
];

export const LanguageModal: React.FC<IProps> = ({
    onSetLanguageCode,
    selectedCode,
    showModal,
    onClose,
}) => {
    const { t } = useTranslation();

    const { languages: allowedLangs } = useAllowedTranslations();

    const allowedLanguages = languages.filter(
        (lang) => allowedLangs[lang.code]
    );

    const handleLanguageSelect = (code: ELanguageCode) => {
        onSetLanguageCode(code);
        onClose();
    };
    return (
        <Modal
            showModal={showModal}
            onClose={onClose}
            size={allowedLanguages.length >= 3 ? "md" : "sm"}
        >
            <ModalHeader>
                <ModalTitle>{t("language.title")}</ModalTitle>
            </ModalHeader>

            <ModalBody className="flex w-full justify-around">
                {allowedLanguages.map(({ code, name, icon }) => (
                    <div
                        key={name}
                        className="flex flex-col items-center gap-3"
                    >
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
                    {t("language.closeButton")}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
