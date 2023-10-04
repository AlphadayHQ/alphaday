import { memo } from "react";
import { Button } from "@alphaday/ui-kit";

interface IWalletButtonProps {
    id: string;
    onClick: () => MaybeAsync<void>;
    disabled?: boolean;
    title: string;
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

interface IProps {
    walletButtons: IWalletButtonProps[];
}

const WalletConnectionPicker: React.FC<IProps> = ({ walletButtons }) => {
    return (
        <div className="flex flex-wrap justify-evenly w-full">
            {walletButtons.map((wallet) => (
                <Button
                    variant="primaryXL"
                    key={wallet.id}
                    onClick={wallet.onClick}
                    disabled={!!wallet.disabled}
                    testId={`wallet-connection-button-${wallet.id}`}
                    className="w-48 mt-2"
                >
                    <wallet.icon className="w-7 h-7 mr-2" /> {wallet.title}
                </Button>
            ))}
        </div>
    );
};

export default memo(WalletConnectionPicker);
