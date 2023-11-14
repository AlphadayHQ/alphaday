import { FC, useCallback, useState } from "react";
import { Input } from "../input/Input";
import { ErrorModal } from "../modal/ErrorModal";
import { Spinner } from "../spinner/Spinner";
import { Dialog } from "./Dialog";

export enum EViewDialogState {
    Closed,
    Save,
    Remove,
    Busy,
    Error,
    LimitReached,
}

interface IProps {
    dialogState: EViewDialogState;
    isCreateNewView: boolean;
    onClose: () => void;
    onSave: (viewName: string) => MaybeAsync<void>;
    onRemove: () => MaybeAsync<void>;
    errorMessage: string | undefined;
    viewName: string | undefined;
    viewNameLimit: number;
}

export const ViewDialog: FC<IProps> = ({
    dialogState,
    onSave,
    onRemove,
    onClose,
    errorMessage,
    isCreateNewView,
    viewName,
    viewNameLimit,
}) => {
    const [value, setValue] = useState(viewName ?? "");
    const [error, setError] = useState<string>();

    const handleValue = useCallback(
        (text: string) => {
            if (text !== "" && /[^A-Za-z\d\s]/.test(text)) {
                setError("Please enter only alpha-numeric characters");
            } else if (error !== undefined) setError(undefined);
            if (text.length <= viewNameLimit) setValue(text);
        },
        [error, viewNameLimit]
    );

    switch (dialogState) {
        case EViewDialogState.Save:
            return (
                <Dialog
                    title={
                        isCreateNewView
                            ? "Create New Board" // change the title if the user is creating a new board
                            : `${viewName ? "Edit" : "Save"} Current Board`
                    }
                    saveButtonText={isCreateNewView ? "Create" : "Save"}
                    showDialog
                    showXButton
                    onClose={onClose}
                    disableSave={!!error}
                    onSave={async () => {
                        await onSave(value.trim());
                        setValue("");
                    }}
                    size="sm"
                >
                    <Input
                        value={value}
                        onChange={(e) => {
                            handleValue(e.target.value);
                        }}
                        id="save-view-input"
                        name="saveViewInput"
                        placeholder="Board name"
                        showState={value.length === viewNameLimit || !!error}
                        state={error !== undefined ? "error" : undefined}
                        showErrorOnly={error !== undefined}
                        feedbackText={
                            error !== undefined
                                ? error
                                : `Board name should be less than ${viewNameLimit.toString()} characters`
                        }
                    />
                </Dialog>
            );
        case EViewDialogState.Remove:
            return (
                <Dialog
                    title="Remove Board"
                    saveButtonText="Remove"
                    showDialog
                    showXButton
                    onClose={onClose}
                    onSave={async () => {
                        await onRemove();
                    }}
                    size="sm"
                >
                    Are you sure you want to remove this board?
                </Dialog>
            );
        case EViewDialogState.LimitReached:
            return (
                <ErrorModal
                    title="Max Widgets Reached"
                    onClose={onClose}
                    errorMessage={errorMessage}
                >
                    You have reached the maximum number of widgets in your
                    board. Please remove some widgets or try creating multiple
                    boards instead.
                </ErrorModal>
            );
        case EViewDialogState.Busy:
            return (
                <Dialog
                    title="Saving preferences..."
                    saveButtonText="Save"
                    showDialog
                    showXButton
                    onClose={onClose}
                    size="sm"
                >
                    <div className="flex justify-center items-center flex-1">
                        <Spinner size="md" color="primary" />
                    </div>
                </Dialog>
            );
        case EViewDialogState.Error:
            return (
                <ErrorModal
                    title="Error"
                    onClose={onClose}
                    errorMessage={errorMessage}
                >
                    We were not able to save your board preferences.
                </ErrorModal>
            );
        default:
            return null;
    }
};
