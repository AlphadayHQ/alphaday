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
                <ModalTitle>{t("aboutUs.title")}</ModalTitle>
            </ModalHeader>

            <ModalBody className="[&_a]:text-secondaryOrange [&_a]:focus:outline-none">
                <h6>{t("aboutUs.companyOverview.title")}</h6>
                <p>
                    {t("aboutUs.companyOverview.registeredName")}
                    <br />
                    {t("aboutUs.companyOverview.registrationNumber")}
                    <br />
                    {t("aboutUs.companyOverview.registeredOffice")}
                </p>

                <h6>{t("aboutUs.contactInfo.title")}</h6>
                <p>
                    {t("aboutUs.contactInfo.email")}{" "}
                    <a href="mailto:hello@alphaday.com">hello@alphaday.com</a>
                    <br />
                    {t("aboutUs.contactInfo.xcom")}{" "}
                    <a
                        href="https://x.com/AlphadayHQ"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        https://x.com/AlphadayHQ
                    </a>
                </p>

                <h6>{t("aboutUs.legalInfo.title")}</h6>
                <p>
                    {t("aboutUs.legalInfo.terms")}{" "}
                    <a
                        href="https://alphaday.com/terms"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        https://alphaday.com/terms
                    </a>
                    <br />
                    {t("aboutUs.legalInfo.privacy")}{" "}
                    <a
                        href="https://alphaday.com/privacy"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        https://alphaday.com/privacy
                    </a>
                </p>

                <h6>{t("aboutUs.additionalResources.title")}</h6>
                <p>
                    {t("aboutUs.additionalResources.faqs")}{" "}
                    <a
                        href="https://alphaday.com/"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        alphaday.com
                    </a>
                    <br />
                    {t("aboutUs.additionalResources.feedback")}{" "}
                    <a
                        href="https://forms.gle/RbrrLGdFPAeuNJhk9"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        https://forms.gle/RbrrLGdFPAeuNJhk9
                    </a>
                </p>
                <p>{t("aboutUs.mission")}</p>
            </ModalBody>
            <ModalFooter>
                <Button className="pt-1.5" onClick={onClose}>
                    {t("aboutUs.closeButton")}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
