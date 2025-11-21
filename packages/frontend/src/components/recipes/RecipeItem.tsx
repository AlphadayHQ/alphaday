/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useState } from "react";
import { twMerge, Button, Input } from "@alphaday/ui-kit";
import { TRecipe } from "src/api/types";

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

interface IRecipeItem {
    recipe: TRecipe;
    onUpdate?: (recipeData: {
        id: string;
        name: string;
        description?: string;
        schedule: string;
        timezone?: string;
    }) => void;
    onToggleActivation?: (recipeId: string, isActive: boolean) => void;
}

const RecipeItem: FC<IRecipeItem> = ({
    recipe,
    onUpdate,
    onToggleActivation,
}) => {
    const [openAccordion, setOpenAccordion] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(recipe.name);
    const [editedDescription, setEditedDescription] = useState(
        recipe.description || ""
    );
    const [editedTimezone, setEditedTimezone] = useState(
        recipe.timezone || "UTC"
    );
    const [scheduleConfig, setScheduleConfig] = useState(
        parseCron(recipe.schedule)
    );

    const toggleAccordion = () => {
        setOpenAccordion((prev) => !prev);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedName(recipe.name);
        setEditedDescription(recipe.description || "");
        setScheduleConfig(parseCron(recipe.schedule));
        setEditedTimezone(recipe.timezone || "UTC");
    };

    const handleScheduleChange = (
        field: "time" | "frequency" | "dayOfWeek",
        value: string
    ) => {
        setScheduleConfig((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (onUpdate) {
            // Convert schedule config to cron expression
            const [hour, minute] = scheduleConfig.time.split(":");
            const dayOfWeek =
                scheduleConfig.frequency === "daily"
                    ? "*"
                    : scheduleConfig.dayOfWeek;
            const cronExpression = `${minute} ${hour} * * ${dayOfWeek}`;

            onUpdate({
                id: recipe.id,
                name: editedName,
                description: editedDescription,
                schedule: cronExpression,
                timezone: editedTimezone,
            });
        }
        setIsEditing(false);
    };

    const handleToggleActivation = () => {
        if (onToggleActivation) {
            onToggleActivation(recipe.id, recipe.isActive);
        }
    };

    return (
        <div className="bg-backgroundVariant100 rounded-lg border border-borderLine">
            <div
                tabIndex={0}
                role="button"
                onClick={toggleAccordion}
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-backgroundVariant200 transition-colors duration-200"
            >
                <div className="flex items-center gap-3 flex-1">
                    <span className="fontGroup-normal text-primary truncate flex-1">
                        {recipe.name}
                    </span>
                </div>
                <span
                    className={`fontGroup-mini px-2 py-1 rounded ${
                        recipe.isActive
                            ? "bg-accentVariant100 text-accentVariant400"
                            : "bg-backgroundVariant200 text-primaryVariant100"
                    }`}
                >
                    {recipe.isActive ? "Active" : "Inactive"}
                </span>
            </div>

            <div
                className={twMerge(
                    "overflow-hidden transition-all duration-300 ease-[ease]",
                    openAccordion
                        ? "max-h-[1000px] opacity-100"
                        : "max-h-0 opacity-0"
                )}
            >
                <div className="p-4 pt-0 border-t border-borderLine">
                    {isEditing ? (
                        <div className="space-y-4 mt-4">
                            <div>
                                <label className="fontGroup-support text-primaryVariant100 block mb-1">
                                    Name
                                </label>
                                <Input
                                    id="name"
                                    name="Recipe name"
                                    value={editedName}
                                    onChange={(e) =>
                                        setEditedName(e.target.value)
                                    }
                                    className="w-full bg-backgroundVariant200"
                                />
                            </div>
                            <div>
                                <label className="fontGroup-support text-primaryVariant100 block mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={editedDescription}
                                    onChange={(e) =>
                                        setEditedDescription(e.target.value)
                                    }
                                    rows={2}
                                    placeholder="Enter recipe description"
                                    className="w-full bg-backgroundVariant200 text-primary fontGroup-normal p-2 rounded border border-backgroundVariant100 min-h-[60px] resize-y"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="fontGroup-support text-primaryVariant100 block mb-1">
                                        Frequency
                                    </label>
                                    <select
                                        title="recipe frequency"
                                        value={scheduleConfig.frequency}
                                        onChange={(e) =>
                                            handleScheduleChange(
                                                "frequency",
                                                e.target.value
                                            )
                                        }
                                        className="w-full bg-backgroundVariant200 text-primary fontGroup-normal p-2 rounded border border-backgroundVariant100"
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                    </select>
                                </div>

                                {scheduleConfig.frequency === "weekly" && (
                                    <div>
                                        <label className="fontGroup-support text-primaryVariant100 block mb-1">
                                            Day of Week
                                        </label>
                                        <select
                                            title="recipe schedulw"
                                            value={scheduleConfig.dayOfWeek}
                                            onChange={(e) =>
                                                handleScheduleChange(
                                                    "dayOfWeek",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full bg-backgroundVariant200 text-primary fontGroup-normal p-2 rounded border border-backgroundVariant100"
                                        >
                                            <option value="1">Monday</option>
                                            <option value="2">Tuesday</option>
                                            <option value="3">Wednesday</option>
                                            <option value="4">Thursday</option>
                                            <option value="5">Friday</option>
                                            <option value="6">Saturday</option>
                                            <option value="0">Sunday</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="fontGroup-support text-primaryVariant100 block mb-1">
                                        Time of Day
                                    </label>
                                    <input
                                        type="time"
                                        title="time"
                                        value={scheduleConfig.time}
                                        onChange={(e) =>
                                            handleScheduleChange(
                                                "time",
                                                e.target.value
                                            )
                                        }
                                        className="w-full bg-backgroundVariant200 text-primary fontGroup-normal p-2 rounded border border-backgroundVariant100"
                                    />
                                </div>
                                <div>
                                    <label className="fontGroup-support text-primaryVariant100 block mb-1">
                                        Timezone
                                    </label>
                                    <select
                                        title="timezone"
                                        value={editedTimezone}
                                        onChange={(e) =>
                                            setEditedTimezone(e.target.value)
                                        }
                                        className="w-full bg-backgroundVariant200 text-primary fontGroup-normal p-2 rounded border border-backgroundVariant100"
                                    >
                                        {TIMEZONES.map((tz) => (
                                            <option key={tz} value={tz}>
                                                {tz}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button onClick={handleSave} variant="primary">
                                    Save
                                </Button>
                                <Button
                                    onClick={handleCancel}
                                    variant="secondary"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3 mt-4">
                            <div>
                                <p className="fontGroup-support text-primaryVariant100 m-0">
                                    Description
                                </p>
                                <p className="fontGroup-normal text-primary m-0 mt-1">
                                    {recipe.description || "No description"}
                                </p>
                            </div>
                            <div>
                                <p className="fontGroup-support text-primaryVariant100 m-0">
                                    Schedule
                                </p>
                                <p className="fontGroup-normal text-primary m-0 mt-1">
                                    {recipe.schedule}
                                </p>
                            </div>
                            <div>
                                <p className="fontGroup-support text-primaryVariant100 m-0">
                                    Timezone
                                </p>
                                <p className="fontGroup-normal text-primary m-0 mt-1">
                                    {recipe.timezone || "Not set"}
                                </p>
                            </div>
                            {recipe.recipeOutputs &&
                                recipe.recipeOutputs.length > 0 && (
                                    <div>
                                        <p className="fontGroup-support text-primaryVariant100 m-0">
                                            Delivery Channels
                                        </p>
                                        <p className="fontGroup-normal text-primary m-0 mt-1">
                                            {recipe.recipeOutputs
                                                .flatMap((output) =>
                                                    output.deliveryChannels
                                                        ? Object.keys(
                                                              output.deliveryChannels
                                                          )
                                                        : []
                                                )
                                                .filter(
                                                    (v, i, a) =>
                                                        a.indexOf(v) === i
                                                )
                                                .map((channel) =>
                                                    typeof channel === "string"
                                                        ? channel
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                          channel.slice(1)
                                                        : ""
                                                )
                                                .filter(Boolean)
                                                .join(", ") || "None"}
                                        </p>
                                    </div>
                                )}
                            {recipe.recipeSources &&
                                recipe.recipeSources.length > 0 && (
                                    <div>
                                        <p className="fontGroup-support text-primaryVariant100 m-0">
                                            Sources
                                        </p>
                                        <div className="mt-1 space-y-1">
                                            {recipe.recipeSources.map(
                                                (source) => (
                                                    <p
                                                        key={source.id}
                                                        className="fontGroup-normal text-primary m-0"
                                                    >
                                                        •{" "}
                                                        {source.sourceCategory}
                                                        {source.maxItems &&
                                                            ` (max: ${source.maxItems})`}
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            {recipe.lastRun && (
                                <div>
                                    <p className="fontGroup-support text-primaryVariant100 m-0">
                                        Last Run
                                    </p>
                                    <p className="fontGroup-normal text-primary m-0 mt-1">
                                        {new Date(
                                            recipe.lastRun
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            )}
                            <div className="flex gap-2 pt-2">
                                <Button
                                    onClick={handleEdit}
                                    variant="secondary"
                                >
                                    Edit
                                </Button>
                                <Button
                                    onClick={handleToggleActivation}
                                    variant={
                                        recipe.isActive
                                            ? "secondary"
                                            : "primary"
                                    }
                                >
                                    {recipe.isActive
                                        ? "Deactivate"
                                        : "Activate"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeItem;
