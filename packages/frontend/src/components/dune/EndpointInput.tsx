import { FC, useState } from "react";
import { Dialog, Input } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";

interface IEndpointInput {
    onSetDuneMeta: (data: {
        widgetName: string;
        duneQueryURL: string;
        importTime: string;
    }) => void;
    show: boolean;
    onClose: () => void;
}

const validateUrl = (string: string): boolean => {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
};

const EndpointInput: FC<IEndpointInput> = ({
    onSetDuneMeta,
    show,
    onClose,
}) => {
    const { t } = useTranslation();
    const [url, setUrl] = useState("");
    const [name, setName] = useState("");

    const handleSave = () => {
        if (validateUrl(url) && name !== "") {
            onSetDuneMeta({
                widgetName: name,
                duneQueryURL: url,
                importTime: new Date().toISOString(),
            });
        }
        setUrl("");
        setName("");
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
            disableSave={!validateUrl(url)}
            size="sm"
        >
            <div className="flex flex-col gap-4 w-full tiny:[&>input]:min-w-[200px] tiny:[&>input]:w-[calc(100vw_-_45px)]">
                <Input
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    id="data-import-name"
                    name="DataImportName"
                    placeholder="Data import name e.g Top 10 DEXs"
                />
                <Input
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
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
