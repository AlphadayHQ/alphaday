export type TRecipeFilters = Record<string, unknown>;

export type TRecipeDeliveryChannels = Record<string, unknown>;

export type TRecipeSource = {
    id?: string;
    sourceCategory: string;
    filters?: TRecipeFilters;
    maxItems?: number;
    priorityScoreThreshold?: number;
    created?: string;
    modified?: string;
};

export type TRecipeOutput = {
    id?: string;
    outputFormat: string;
    outputFormatName?: string;
    promptTemplate: number;
    promptTemplateName?: string;
    userPromptOverride?: string;
    deliveryChannels?: TRecipeDeliveryChannels;
    created?: string;
    modified?: string;
};

export type TRecipe = {
    id: string;
    user?: number;
    userEmail?: string;
    name: string;
    icon: string;
    description?: string;
    isActive: boolean;
    schedule: string;
    lastRun?: string | null;
    timezone?: string;
    version?: number;
    recipeSources?: TRecipeSource[];
    recipeOutputs?: TRecipeOutput[];
    created: string;
    modified: string;
};

export type TRecipeInput = {
    id: string;
    name: string;
    description?: string;
    schedule: string;
    timezone?: string;
    sources: Array<{
        sourceCategory: string;
        filters?: Record<string, unknown>;
        maxItems?: number;
    }>;
    outputs: Array<{
        outputFormat: string;
        promptTemplate: number;
        deliveryChannels?: Record<string, unknown>;
    }>;
};

export type TRecipeTemplateConfig = {
    schedule: string;
    timezone: string;
    sources: Array<{
        source_category: string;
        filters: Record<string, unknown>;
        max_items: number;
    }>;
    outputs: Array<{
        output_format_type: string;
        prompt_template_id: number | null;
        delivery_channels: Record<string, unknown>;
    }>;
};

export type TRecipeTemplateTags = string[];

export enum ERecipeTemplateCategory {
    News = "news",
    Market = "market",
    Social = "social",
    Portfolio = "portfolio",
    Custom = "custom",
    Research = "research",
    Alert = "alert",
}

export type TOutputFormat = {
    id: string;
    type: string;
    name: string;
    description?: string;
    template: string;
    costMultiplier: number;
    isActive: boolean;
    created: string;
    modified: string;
};

export type TRecipeTemplate = {
    id: string;
    name: string;
    icon: string;
    description: string;
    category?: ERecipeTemplateCategory | string;
    author?: number | null;
    authorEmail?: string;
    isPublic: boolean;
    isFeatured: boolean;
    usageCount: number;
    templateConfig: TRecipeTemplateConfig;
    previewImage?: string;
    tags?: TRecipeTemplateTags;
    created: string;
    modified: string;
};
