import { FC, useState } from "react";
import { Dialog, Input } from "@alphaday/ui-kit";
import { useTranslation } from "react-i18next";
import { useKeyPress } from "src/api/hooks";

interface IAddressInput {
    onChange: (addr: string) => void;
    onAddAddress: (addr: string) => void;
    show: boolean;
    onClose: () => void;
    disabled: boolean;
}

const AddressInput: FC<IAddressInput> = ({
    onChange,
    onAddAddress,
    show,
    onClose,
    disabled,
}) => {
    const { t } = useTranslation();
    const [value, setValue] = useState("");

    return (
        <Dialog
            title={t("portfolio.addAWallet")}
            showDialog={show}
            onClose={onClose}
            saveButtonText={t("buttons.save")}
            showXButton
            onSave={() => {
                onAddAddress(value);
                setValue("");
                onClose();
            }}
            disableSave={disabled}
            size="sm"
            useKeyPress={useKeyPress}
        >
            <div className="flex justify-center tiny:[&>input]:min-w-[200px] w-[calc(100vw_-_45px)]">
                <Input
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        onChange(e.target.value);
                    }}
                    id="wallet-input"
                    name="walletInput"
                    placeholder={t("portfolio.inputPlaceholder")}
                    className="max-w-[85vw]"
                />
            </div>
        </Dialog>
    );
};

export default AddressInput;
