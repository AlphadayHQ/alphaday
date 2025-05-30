import { FC } from "react";
import { FormTextArea } from "src/mobile-components/form-elements/FormElements";
import { IPromptEditorProps } from "./types";

const PromptEditor: FC<IPromptEditorProps> = ({
    prompts,
    onPromptsChange,
    // selectedMarket,
    // selectedChartRange,
}) => {
    return (
        <div className="grid grid-cols-2 gap-4 w-full p-4 pb-12">
            <div className="flex-1 h-full">
                <FormTextArea
                    label="System Prompt"
                    placeholder="Enter your prompt"
                    value={prompts.system}
                    className="h-full flex-1"
                    onChange={(e) =>
                        onPromptsChange({
                            ...prompts,
                            system: e.target.value,
                        })
                    }
                />
            </div>
            <div className="flex-1 h-full">
                <FormTextArea
                    label="User Prompt"
                    placeholder="Enter your prompt"
                    value={prompts.user}
                    rows={10}
                    className="h-full flex-1"
                    onChange={(e) => {
                        onPromptsChange({
                            ...prompts,
                            user: e.target.value,
                        });
                    }}
                />
            </div>
        </div>
    );
};

export default PromptEditor;
