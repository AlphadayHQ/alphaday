import { FC, useState } from "react";
import { Dialog, Input } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";

interface IEndpointInput {
    onSetEndpointUrl: (url: string) => void;
    show: boolean;
    onClose: () => void;
}

const validateUrl = (url: string): boolean => {
    try {
        if (URL.parse(url)) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

const EndpointInput: FC<IEndpointInput> = ({
    onSetEndpointUrl,
    show,
    onClose,
}) => {
    const { t } = useTranslation();
    const [value, setValue] = useState("");

    const handleSave = () => {
        if (validateUrl(value)) {
            onSetEndpointUrl(value);
        }
        setValue("");
        onClose();
    };

    return (
        <Dialog
            title={t("dune.enterEndpointURL")}
            showDialog={show}
            onClose={onClose}
            saveButtonText={t("buttons.save")}
            showXButton
            onSave={handleSave}
            disableSave={!validateUrl(value)}
            size="sm"
        >
            <div className="flex justify-center w-full tiny:[&>input]:min-w-[200px] tiny:[&>input]:w-[calc(100vw_-_45px)]">
                <Input
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                    id="endpoint-input"
                    name="endpointInput"
                    placeholder={t("dune.endpointInputPlaceholder")}
                />
            </div>
        </Dialog>
    );
};

export default EndpointInput;
