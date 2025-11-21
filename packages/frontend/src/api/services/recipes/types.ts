import {
    TOutputFormat,
    TRecipe,
    TRecipeDeliveryChannels,
    TRecipeFilters,
    TRecipeTemplate,
    TRecipeTemplateConfig,
    TRecipeTemplateTags,
} from "src/api/types";

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

// Recipe Types

export type TRecipeSourceRaw = {
    id?: string;
    source_category: string;
    filters?: TRecipeFilters;
    max_items?: number;
    priority_score_threshold?: number;
    created?: string;
    modified?: string;
};

export type TRecipeOutputRaw = {
    id?: string;
    output_format: string;
    output_format_name?: string;
    prompt_template: number;
    prompt_template_name?: string;
    user_prompt_override?: string;
    delivery_channels?: TRecipeDeliveryChannels;
    created?: string;
    modified?: string;
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
        outputFormat: string;
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
        output_format: string;
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
        outputFormat: string;
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
        output_format: string;
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

// Output Formats Types
export type TOutputFormatRaw = {
    id: string;
    type: string;
    name: string;
    description?: string;
    template: string;
    cost_multiplier: number;
    is_active: boolean;
    created: string;
    modified: string;
};

export type TGetOutputFormatsRequest = {
    page?: number;
    limit?: number;
};

export type TGetOutputFormatsRawResponse = {
    total: number;
    links: {
        next: string | null;
        previous: string | null;
    };
    results: TOutputFormatRaw[];
};

export type TGetOutputFormatsResponse = {
    total: number;
    links: {
        next: string | null;
        previous: string | null;
    };
    results: TOutputFormat[];
};
