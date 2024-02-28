import { FC, useState } from "react";
import { Button, FullPageModal } from "@alphaday/ui-kit";
import { TUserProfile } from "src/api/types";
import { Logger } from "src/api/utils/logging";
import { ReactComponent as ChevronSVG } from "src/assets/icons/chevron-down2.svg";

interface IEditProfileModal {
    profile: TUserProfile | undefined;
    onSave: (req: { handle: string }) => void;
    isSavingProfile: boolean;
    show: boolean;
    onCloseModal: () => void;
}

export const EditProfileModal: FC<IEditProfileModal> = ({
    profile,
    onSave,
    isSavingProfile,
    show,
    onCloseModal,
}) => {
    const [handle, setHandle] = useState<string | undefined>(undefined);

    const handleHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHandle(e.target.value);
    };

    const handleSaveProfile = () => {
        Logger.debug("saving profile...", handle);
        if (handle && handle !== profile?.handle) {
            onSave({ handle });
        }
    };

    return (
        <FullPageModal isOpen={show} closeModal={onCloseModal}>
            <div className="flex flex-start w-full items-center mb-4">
                <ChevronSVG
                    onClick={onCloseModal}
                    tabIndex={0}
                    role="button"
                    className="w-6 h-6 mr-2 rotate-180 -ml-1.5"
                />
                <h1 className="uppercase fontGroup-major !text-lg flex-grow text-center mb-0">
                    Edit Profile
                </h1>
            </div>
            <div className="flex flex-col mb-5">
                <div className="flex flex-row items-center mb-5 pb-2.5 border-b border-primaryVariant100 last:border-none">
                    <span className="mr-4">Handle</span>
                    <input
                        value={handle ?? profile?.handle ?? ""}
                        type="text"
                        className="self-stretch px-4 py-6 border-0 bg-neutral-800 rounded-lg justify-start items-center inline-flex grow shrink basis-0 text-primary text-base leading-tight tracking-tight"
                        onChange={handleHandleChange}
                    />
                </div>
            </div>
            <div className="flex flex-col ">
                <Button
                    className="w-full border-0 justify-center items-center gap-1 text-base font-bold px-4 py-6 bg-accentVariant100 text-primary rounded-lg tracking-tight"
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                >
                    Save
                </Button>
            </div>
        </FullPageModal>
    );
};
export default EditProfileModal;
