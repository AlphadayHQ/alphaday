import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";

interface IProps {
    showModal: boolean;
    onClose?: () => void;
}

export const AboutUsModal: React.FC<IProps> = ({ showModal, onClose }) => {
    const { t } = useTranslation();
    return (
        <Modal showModal={showModal} onClose={onClose} size="md">
            <ModalHeader>
                <ModalTitle>{t("about_us.title")}</ModalTitle>
            </ModalHeader>

            <ModalBody className="[&_a]:text-secondaryOrange [&_a]:focus:outline-none">
                <h6>{t("about_us.company_overview.title")}</h6>
                <p>
                    {t("about_us.company_overview.registered_name")}
                    <br />
                    {t("about_us.company_overview.registration_number")}
                    <br />
                    {t("about_us.company_overview.registered_office")}
                </p>

                <h6>{t("about_us.contact_info.title")}</h6>
                <p>
                    {t("about_us.contact_info.email")}{" "}
                    <a href="mailto:hello@alphaday.com">hello@alphaday.com</a>
                    <br />
                    {t("about_us.contact_info.xcom")}{" "}
                    <a
                        href="https://x.com/AlphadayHQ"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        https://x.com/AlphadayHQ
                    </a>
                </p>

                <h6>{t("about_us.legal_info.title")}</h6>
                <p>
                    {t("about_us.legal_info.terms")}{" "}
                    <a
                        href="https://alphaday.com/terms"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        https://alphaday.com/terms
                    </a>
                    <br />
                    {t("about_us.legal_info.privacy")}{" "}
                    <a
                        href="https://alphaday.com/privacy"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        https://alphaday.com/privacy
                    </a>
                </p>

                <h6>{t("about_us.additional_resources.title")}</h6>
                <p>
                    {t("about_us.additional_resources.faqs")}{" "}
                    <a
                        href="https://alphaday.com/"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        alphaday.com
                    </a>
                    <br />
                    {t("about_us.additional_resources.feedback")}{" "}
                    <a
                        href="https://forms.gle/RbrrLGdFPAeuNJhk9"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        https://forms.gle/RbrrLGdFPAeuNJhk9
                    </a>
                </p>
                <p>{t("about_us.mission")}</p>
            </ModalBody>
            <ModalFooter>
                <Button className="pt-1.5" onClick={onClose}>
                    {t("about_us.close_button")}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
