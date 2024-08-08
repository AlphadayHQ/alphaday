import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from "@alphaday/ui-kit";

interface IProps {
    showModal: boolean;
    onClose?: () => void;
}
export const AboutUsModal: React.FC<IProps> = ({ showModal, onClose }) => {
    return (
        <Modal showModal={showModal} onClose={onClose}>
            <ModalHeader className="">
                <ModalTitle>About Us</ModalTitle>
            </ModalHeader>

            <ModalBody className="[&_a]:text-secondaryOrange">
                <h6>Company Overview:</h6>
                <p>
                    Registered Name: Alphabox Solutions Pte. Ltd.
                    <br />
                    Registration Number: <code>202136261C</code>
                    <br />
                    Registered Office: 45 North Canal Road #01-01 Lew Building
                    Singapore
                </p>

                <h6>Contact Information:</h6>
                <p>
                    Email Address:{" "}
                    <a href="mailto:hello@alphaday.com">hello@alphaday.com</a>
                    <br />
                    X.com:{" "}
                    <a
                        href="https://x.com/AlphadayHQ"
                        target="_blank"
                        rel="noreferrer"
                    >
                        https://x.com/AlphadayHQ
                    </a>
                </p>

                <h6>Legal Information:</h6>
                <p>
                    Terms & Conditions:{" "}
                    <a
                        href="https://alphaday.com/terms"
                        target="_blank"
                        rel="noreferrer"
                    >
                        https://alphaday.com/terms
                    </a>
                    <br />
                    Privacy Policy:{" "}
                    <a
                        href="https://alphaday.com/privacy"
                        target="_blank"
                        rel="noreferrer"
                    >
                        https://alphaday.com/privacy
                    </a>
                </p>

                <h6>Additional Resources:</h6>
                <p>
                    FAQs:{" "}
                    <a
                        href="https://alphaday.com/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        alphaday.com
                    </a>
                    <br />
                    API:{" "}
                    <a
                        href="http://api.alphaday.com/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        http://api.alphaday.com/
                    </a>
                    <br />
                    Feedback:{" "}
                    <a
                        href="https://forms.gle/RbrrLGdFPAeuNJhk9"
                        target="_blank"
                        rel="noreferrer"
                    >
                        https://forms.gle/RbrrLGdFPAeuNJhk9
                    </a>
                </p>
                <p>
                    Alphaday&apos;s mission is to bring you all the tools needed
                    to follow your favorite projects, stay up-to-date with the
                    latest narratives, and use your favorite dapps, all from the
                    comfort of one easy-to-use customizable dashboard.
                </p>
            </ModalBody>
            <ModalFooter>
                <Button className="pt-1.5" onClick={onClose}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    );
};
