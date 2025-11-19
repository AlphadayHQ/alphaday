/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useState, ChangeEvent } from "react";
import { Input, ScrollBar } from "@alphaday/ui-kit";
import { TRecipeTemplate } from "src/api/services/recipes/types";
import { ReactComponent as ArrowSVG } from "src/assets/icons/arrow-right.svg";

const TIMEZONES = [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Toronto",
    "America/Vancouver",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Europe/Madrid",
    "Europe/Rome",
    "Europe/Amsterdam",
    "Europe/Brussels",
    "Europe/Vienna",
    "Europe/Zurich",
    "Asia/Dubai",
    "Asia/Singapore",
    "Asia/Hong_Kong",
    "Asia/Tokyo",
    "Asia/Seoul",
    "Asia/Shanghai",
    "Asia/Kolkata",
    "Australia/Sydney",
    "Australia/Melbourne",
    "Pacific/Auckland",
];

// Parse existing cron to extract time and frequency
const parseCron = (cron: string) => {
    const parts = cron.split(" ");
    const minute = parts[0] || "0";
    const hour = parts[1] || "9";
    const dayOfWeek = parts[4] || "*";

    return {
        time: `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`,
        frequency: dayOfWeek === "*" ? "daily" : "weekly",
        dayOfWeek: dayOfWeek !== "*" ? dayOfWeek : "1",
    };
};

interface IRecipeFormProps {
    template: TRecipeTemplate;
    onBack: () => void;
    onCreate: (data: {
        name: string;
        description?: string;
        schedule: string;
        timezone?: string;
    }) => void;
}

const RecipeForm: FC<IRecipeFormProps> = ({ template, onCreate, onBack }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: template.description || "",
        schedule: template.templateConfig.schedule || "0 9 * * *",
        timezone: template.templateConfig.timezone || "UTC",
    });

    const [scheduleConfig, setScheduleConfig] = useState(
        parseCron(template.templateConfig.schedule || "0 9 * * *")
    );

    const handleInputChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleScheduleChange = (
        field: "time" | "frequency" | "dayOfWeek",
        value: string
    ) => {
        const newConfig = { ...scheduleConfig, [field]: value };
        setScheduleConfig(newConfig);

        // Convert to cron expression
        const [hour, minute] = newConfig.time.split(":");
        const dayOfWeek =
            newConfig.frequency === "daily" ? "*" : newConfig.dayOfWeek;
        const cronExpression = `${minute} ${hour} * * ${dayOfWeek}`;

        setFormData((prev) => ({ ...prev, schedule: cronExpression }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(formData);
    };

    return (
        <div className="flex flex-col bg-background h-full">
            <ScrollBar>
                <div className="px-6 pb-4">
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={onBack}
                            className="inline-flex text-primaryVariant100"
                        >
                            <ArrowSVG className="self-center mr-[5px] w-3 h-3 fill-primary" />{" "}
                            Back to Templates
                        </button>
                        <h3 className="text-primary fontGroup-highlight mt-2">
                            {template.name}
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-primary fontGroup-highlightSemi mb-2">
                                Recipe Name *
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter recipe name"
                                    className="w-full bg-backgroundVariant200 mt-2"
                                />
                            </label>
                        </div>

                        <div>
                            <label className="block text-primary fontGroup-highlightSemi mb-2">
                                Description
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={2}
                                    placeholder="Enter recipe description"
                                    className="w-full bg-backgroundVariant200 text-primary fontGroup-normal p-2 rounded border border-backgroundVariant100 min-h-[100px] resize-y mt-2"
                                />
                            </label>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-primary fontGroup-highlightSemi mb-2">
                                        Frequency *
                                        <select
                                            value={scheduleConfig.frequency}
                                            onChange={(e) =>
                                                handleScheduleChange(
                                                    "frequency",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full bg-backgroundVariant200 text-primary fontGroup-normal p-3 rounded border border-backgroundVariant100 mt-2"
                                            required
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">
                                                Weekly
                                            </option>
                                        </select>
                                    </label>
                                </div>

                                {scheduleConfig.frequency === "weekly" && (
                                    <div>
                                        <label className="block text-primary fontGroup-highlightSemi mb-2">
                                            Day of Week *
                                            <select
                                                value={scheduleConfig.dayOfWeek}
                                                onChange={(e) =>
                                                    handleScheduleChange(
                                                        "dayOfWeek",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full bg-backgroundVariant200 text-primary fontGroup-normal p-3 rounded border border-backgroundVariant100 mt-2"
                                                required
                                            >
                                                <option value="1">
                                                    Monday
                                                </option>
                                                <option value="2">
                                                    Tuesday
                                                </option>
                                                <option value="3">
                                                    Wednesday
                                                </option>
                                                <option value="4">
                                                    Thursday
                                                </option>
                                                <option value="5">
                                                    Friday
                                                </option>
                                                <option value="6">
                                                    Saturday
                                                </option>
                                                <option value="0">
                                                    Sunday
                                                </option>
                                            </select>
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-primary fontGroup-highlightSemi mb-2">
                                        Time of Day *
                                        <input
                                            type="time"
                                            value={scheduleConfig.time}
                                            onChange={(e) =>
                                                handleScheduleChange(
                                                    "time",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full bg-backgroundVariant200 text-primary fontGroup-normal p-3 rounded border border-backgroundVariant100 mt-2"
                                            required
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-primary fontGroup-highlightSemi mb-2">
                                        Timezone *
                                        <select
                                            name="timezone"
                                            value={formData.timezone}
                                            onChange={handleInputChange}
                                            className="w-full bg-backgroundVariant200 text-primary fontGroup-normal p-3 rounded border border-backgroundVariant100 mt-2"
                                            required
                                        >
                                            {TIMEZONES.map((tz) => (
                                                <option key={tz} value={tz}>
                                                    {tz}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-backgroundBlue hover:bg-backgroundBlue100 text-primary fontGroup-highlightSemi py-3 px-4 rounded"
                            >
                                Create Recipe
                            </button>
                        </div>
                    </form>
                </div>
            </ScrollBar>
        </div>
    );
};

export default RecipeForm;
