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

export type TRecipeTemplate = {
    id: string;
    name: string;
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

export type TRecipeTemplateRaw = {
    id: string;
    name: string;
    description: string;
    category?: string;
    author?: number | null;
    author_email?: string;
    is_public: boolean;
    is_featured: boolean;
    usage_count: number;
    template_config: TRecipeTemplateConfig;
    preview_image?: string;
    tags?: TRecipeTemplateTags;
    created: string;
    modified: string;
};

export type TGetRecipeTemplatesRequest = {
    page?: number;
    limit?: number;
};

export type TGetRecipeTemplatesRawResponse = {
    total: number;
    links: {
        next: string | null;
        previous: string | null;
    };
    results: TRecipeTemplateRaw[];
};

export type TGetRecipeTemplatesResponse = {
    total: number;
    links: {
        next: string | null;
        previous: string | null;
    };
    results: TRecipeTemplate[];
};

export type TCreateRecipeTemplateRequest = {
    name: string;
    description: string;
    category?: ERecipeTemplateCategory | string;
    author?: number;
    isPublic?: boolean;
    isFeatured?: boolean;
    templateConfig: TRecipeTemplateConfig;
    previewImage?: string;
    tags?: TRecipeTemplateTags;
};

export type TCreateRecipeTemplateRequestRaw = {
    name: string;
    description: string;
    category?: string;
    author?: number;
    is_public?: boolean;
    is_featured?: boolean;
    template_config: TRecipeTemplateConfig;
    preview_image?: string;
    tags?: TRecipeTemplateTags;
};

export type TCreateRecipeTemplateResponse = TRecipeTemplate;
export type TCreateRecipeTemplateRawResponse = TRecipeTemplateRaw;

// Recipe Types
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

export type TRecipeSourceRaw = {
    id?: string;
    source_category: string;
    filters?: TRecipeFilters;
    max_items?: number;
    priority_score_threshold?: number;
    created?: string;
    modified?: string;
};

export type TRecipeOutput = {
    id?: string;
    outputFormat: number;
    outputFormatName?: string;
    promptTemplate: number;
    promptTemplateName?: string;
    userPromptOverride?: string;
    deliveryChannels?: TRecipeDeliveryChannels;
    created?: string;
    modified?: string;
};

export type TRecipeOutputRaw = {
    id?: string;
    output_format: number;
    output_format_name?: string;
    prompt_template: number;
    prompt_template_name?: string;
    user_prompt_override?: string;
    delivery_channels?: TRecipeDeliveryChannels;
    created?: string;
    modified?: string;
};

export type TRecipe = {
    id: string;
    user?: number;
    userEmail?: string;
    name: string;
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

export type TRecipeRaw = {
    id: string;
    user?: number;
    user_email?: string;
    name: string;
    description?: string;
    is_active: boolean;
    schedule: string;
    last_run?: string | null;
    timezone?: string;
    version?: number;
    recipe_sources?: TRecipeSourceRaw[];
    recipe_outputs?: TRecipeOutputRaw[];
    created: string;
    modified: string;
};

export type TGetRecipesRequest = {
    page?: number;
    limit?: number;
};

export type TGetRecipesRawResponse = {
    total: number;
    links: {
        next: string | null;
        previous: string | null;
    };
    results: TRecipeRaw[];
};

export type TGetRecipesResponse = {
    total: number;
    links: {
        next: string | null;
        previous: string | null;
    };
    results: TRecipe[];
};

export type TCreateRecipeRequest = {
    name: string;
    description?: string;
    isActive?: boolean;
    schedule: string;
    timezone?: string;
    sources: Array<{
        sourceCategory: string;
        filters?: TRecipeFilters;
        maxItems?: number;
        priorityScoreThreshold?: number;
    }>;
    outputs: Array<{
        outputFormat: number;
        promptTemplate: number;
        userPromptOverride?: string;
        deliveryChannels?: TRecipeDeliveryChannels;
    }>;
};

export type TCreateRecipeRequestRaw = {
    name: string;
    description?: string;
    is_active?: boolean;
    schedule: string;
    timezone?: string;
    sources: Array<{
        source_category: string;
        filters?: TRecipeFilters;
        max_items?: number;
        priority_score_threshold?: number;
    }>;
    outputs: Array<{
        output_format: number;
        prompt_template: number;
        user_prompt_override?: string;
        delivery_channels?: TRecipeDeliveryChannels;
    }>;
};

export type TCreateRecipeResponse = TRecipe;
export type TCreateRecipeRawResponse = TRecipeRaw;

export type TGetRecipeRequest = {
    id: string;
};

export type TGetRecipeResponse = TRecipe;
export type TGetRecipeRawResponse = TRecipeRaw;

export type TUpdateRecipeRequest = {
    id: string;
    name: string;
    description?: string;
    isActive?: boolean;
    schedule: string;
    timezone?: string;
    sources: Array<{
        sourceCategory: string;
        filters?: TRecipeFilters;
        maxItems?: number;
        priorityScoreThreshold?: number;
    }>;
    outputs: Array<{
        outputFormat: number;
        promptTemplate: number;
        userPromptOverride?: string;
        deliveryChannels?: TRecipeDeliveryChannels;
    }>;
};

export type TUpdateRecipeRequestRaw = {
    name: string;
    description?: string;
    is_active?: boolean;
    schedule: string;
    timezone?: string;
    sources: Array<{
        source_category: string;
        filters?: TRecipeFilters;
        max_items?: number;
        priority_score_threshold?: number;
    }>;
    outputs: Array<{
        output_format: number;
        prompt_template: number;
        user_prompt_override?: string;
        delivery_channels?: TRecipeDeliveryChannels;
    }>;
};

export type TUpdateRecipeResponse = TRecipe;
export type TUpdateRecipeRawResponse = TRecipeRaw;

export type TActivateRecipeRequest = {
    id: string;
};

export type TActivateRecipeResponse = TRecipe;
export type TActivateRecipeRawResponse = TRecipeRaw;

export type TDeactivateRecipeRequest = {
    id: string;
};

export type TDeactivateRecipeResponse = TRecipe;
export type TDeactivateRecipeRawResponse = TRecipeRaw;
