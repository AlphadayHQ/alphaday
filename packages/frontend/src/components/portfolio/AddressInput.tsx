import { FC, useState } from "react";
import { Dialog, Input } from "@alphaday/ui-kit";

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
    const [value, setValue] = useState("");

    return (
        <Dialog
            title="Add a Wallet Address"
            showDialog={show}
            onClose={onClose}
            saveButtonText="Save"
            showXButton
            darkerBackdrop
            onSave={() => {
                onAddAddress(value);
                setValue("");
                onClose();
            }}
            disableSave={disabled}
            size="sm"
        >
            <div className="flex justify-center w-full tiny:[&>input]:min-w-[200px] tiny:[&>input]:w-[calc(100vw_-_45px)]">
                <Input
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        onChange(e.target.value);
                    }}
                    id="wallet-input"
                    name="walletInput"
                    placeholder="Enter an Ethereum or ENS address"
                />
            </div>
        </Dialog>
    );
};

export default AddressInput;
